import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from '../config.js';
import { generateBrollPrompt } from '../prompts/brollmasterprompt.js';
import type { BrollScene, SceneChunk } from '../types.js';
import { safeParseJSON } from '../utils/safeParseJSON.js';
import { ApiKeyPool } from './apiKeyPool.js';

function splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

function splitTopLevelJsonObjects(text: string): string[] {
  const input = text.replace(/\r\n/g, '\n').trim();
  if (!input) return [];

  const objects: string[] = [];
  let i = 0;

  while (i < input.length) {
    while (i < input.length && input[i] !== '{') i += 1;
    if (i >= input.length) break;

    const start = i;
    let depth = 0;
    let inString = false;
    let escaped = false;

    while (i < input.length) {
      const ch = input[i];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
      } else if (ch === '"') {
        inString = true;
      } else if (ch === '{') {
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          i += 1;
          const objectText = input.slice(start, i).trim();
          if (objectText) objects.push(objectText);
          break;
        }
      }
      i += 1;
    }

    if (i <= start) break;
  }

  return objects;
}

function parseBatchScenes(rawText: string): BrollScene[] {
  try {
    const parsed = safeParseJSON<BrollScene[] | BrollScene>(rawText);
    if (Array.isArray(parsed)) return parsed;
    return [parsed];
  } catch {
    const objectBlocks = splitTopLevelJsonObjects(rawText);
    if (objectBlocks.length === 0) {
      throw new Error(`Failed to parse JSON response. Raw preview: ${rawText.slice(0, 300)}`);
    }
    return objectBlocks.map((block) => safeParseJSON<BrollScene>(block));
  }
}

export async function runBatchGenerator(params: {
  allChunks: SceneChunk[];
  pool: ApiKeyPool;
  signal?: AbortSignal;
}): Promise<BrollScene[]> {
  const throwIfAborted = () => {
    if (params.signal?.aborted) {
      const err = new Error('Cancelled') as Error & { name: string };
      err.name = 'AbortError';
      throw err;
    }
  };

  throwIfAborted();
  const batches = splitIntoBatches(params.allChunks, CONFIG.BATCH_SIZE);
  const total = batches.length;

  const results = await Promise.all(
    batches.map(async (batch, index) => {
      throwIfAborted();
      if (index > 0 && CONFIG.BATCH_DELAY_MS > 0) {
        await new Promise((resolve) => setTimeout(resolve, CONFIG.BATCH_DELAY_MS * index));
        throwIfAborted();
      }

      const keyEntry = await params.pool.getFreeKey();
      const keyLast4 = keyEntry.key.slice(-4);
      const batchSceneTotal = batch.length;
      const batchLabel = `${index + 1}/${total}`;

      try {
        let lastError: unknown;
        for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt += 1) {
          try {
            throwIfAborted();
            const genAI = new GoogleGenerativeAI(keyEntry.key);
            const model = genAI.getGenerativeModel({
              model: CONFIG.MODEL,
              generationConfig: {
                maxOutputTokens: 8192,
                temperature: CONFIG.TEMPERATURE,
              },
            });

            const batchStartIndex = index * CONFIG.BATCH_SIZE;
            const sceneLines = batch.map((chunk) => chunk.broll_prompt);
            const firstSceneId = batchStartIndex + 1;
            const lastSceneId = batchStartIndex + batchSceneTotal;
            const attemptNote = attempt > 1 ? ` · retry ${attempt}/${CONFIG.MAX_RETRIES}` : '';
            console.log(
              `[B-roll] Batch ${batchLabel}${attemptNote} · scenes ${firstSceneId}–${lastSceneId} · key #${keyEntry.id} …${keyLast4}`,
            );
            const prompt = generateBrollPrompt(sceneLines, batchStartIndex);
            const response = await model.generateContent(prompt);
            throwIfAborted();
            const rawText = response.response.text();
            const parsed = parseBatchScenes(rawText);
            if (parsed.length !== batchSceneTotal) {
              throw new Error(
                `Batch ${batchLabel} returned ${parsed.length} scenes, expected ${batchSceneTotal}`,
              );
            }

            const withIds = parsed.map((scene, i) => ({
              ...scene,
              id: batchStartIndex + i + 1,
            }));

            console.log(`[B-roll] Batch ${batchLabel} · OK (${batchSceneTotal} scenes)`);
            return withIds;
          } catch (error) {
            lastError = error;
            if (attempt >= CONFIG.MAX_RETRIES) break;
          }
        }

        const message =
          lastError instanceof Error ? lastError.message : String(lastError ?? 'Unknown error');
        throw new Error(`Batch ${index + 1}/${total} failed after retries: ${message}`);
      } finally {
        params.pool.releaseKey(keyEntry);
      }
    }),
  );

  return results
    .flat()
    .sort((a, b) => a.id - b.id);
}
