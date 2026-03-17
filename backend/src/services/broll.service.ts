import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateBrollPrompt, brollGeneratorConfig } from '../prompts/brollmasterprompt.js';

/**
 * Collect all configured B-roll Gemini API keys from environment.
 * Supports multiple keys like GEMINI_API_KEY_BROLL1, GEMINI_API_KEY_BROLL2, etc.
 */
function getBrollApiKeys(): string[] {
  const keys: string[] = [];
  // Backward-compatible single key
  if (process.env.GEMINI_API_KEY_BROLL) {
    keys.push(process.env.GEMINI_API_KEY_BROLL);
  }
  // Numbered keys
  for (let i = 1; i <= 10; i++) {
    const key = (process.env as Record<string, string | undefined>)[`GEMINI_API_KEY_BROLL${i}`];
    if (key) keys.push(key);
  }
  // De-duplicate just in case
  return Array.from(new Set(keys));
}

function normalizePromptBlocks(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .trim()
    // ensure exactly one blank line (two \n) between blocks
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Clean AI output to final format: "Scene N: Title" then prompt only. No markdown, no Negative Prompt or Suggested Settings.
 * Drops any leading content (e.g. script analysis) before the first scene.
 */
function cleanBrollOutput(raw: string): string {
  let text = raw.replace(/\r\n/g, '\n').replace(/\*\*/g, '').trim();
  const firstScene = text.match(/\bScene \d+:/i);
  if (firstScene && firstScene.index != null && firstScene.index > 0) {
    text = text.slice(firstScene.index).trim();
  }
  // Strip any trailing interactive questions like
  // "Do you want the next 4 scene prompts?"
  text = text
    .split('\n')
    .filter(
      (line) =>
        !/do you want the next/i.test(line) &&
        !/next 4 scene prompts/i.test(line),
    )
    .join('\n')
    .trim();
  const hasOldFormat =
    text.includes('Main Image Prompt:') ||
    text.includes('Negative Prompt:') ||
    text.includes('Suggested Settings:');
  if (!hasOldFormat) {
    // Normalize spacing so there is exactly one blank line between each scene block
    const simpleBlocks = text
      .split(/(?=Scene \d+:)/i)
      .map((b) => b.trim())
      .filter(Boolean);
    if (simpleBlocks.length > 0) {
      return normalizePromptBlocks(simpleBlocks.join('\n\n'));
    }
    return normalizePromptBlocks(text);
  }

  const sceneBlocks = text.split(/(?=Scene \d+:)/i).filter((b) => b.trim());
  const out: string[] = [];
  for (const block of sceneBlocks) {
    const firstLine = block.split('\n')[0]?.trim() || '';
    const title = firstLine.replace(/\*\*/g, '').trim();
    if (!title || !/^Scene \d+:/i.test(title)) continue;

    const mainIdx = block.indexOf('Main Image Prompt:');
    const negIdx = block.indexOf('Negative Prompt:');
    const setIdx = block.indexOf('Suggested Settings:');
    const endIdx = negIdx >= 0 ? negIdx : setIdx >= 0 ? setIdx : block.length;

    let prompt: string;
    if (mainIdx >= 0) {
      prompt = block.slice(mainIdx + 'Main Image Prompt:'.length, endIdx).replace(/\*\*/g, '').trim();
    } else {
      prompt = block.slice(firstLine.length, endIdx).replace(/\*\*/g, '').trim();
    }
    if (prompt) out.push(`${title}\n${prompt}`);
  }
  // Join cleaned scenes with a single blank line between each prompt
  const cleanedScenes = out.join('\n\n');
  const normalizedBlocks = cleanedScenes
    .split(/(?=Scene \d+:)/i)
    .map((b) => b.trim())
    .filter(Boolean);
  const joined = normalizedBlocks.length > 0 ? normalizedBlocks.join('\n\n') : cleanedScenes;
  return normalizePromptBlocks(joined);
}

/** Sleep for ms, or reject if signal is aborted (so generation can stop when client cancels). */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    const err = new Error('Cancelled') as Error & { name: string };
    err.name = 'AbortError';
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      const err = new Error('Cancelled') as Error & { name: string };
      err.name = 'AbortError';
      reject(err);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export const brollService = {
  /**
   * Split a raw script into scene-like chunks (deterministic, no AI formatting step).
   */
  scriptToScenes: (script: string, maxScenes = 30): Record<string, string> => {
    const normalized = script
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .trim();

    if (!normalized) return {};

    // Prefer splitting by blank lines first (author-intent), then by sentence boundaries.
    const blocks = normalized
      .split(/\n{2,}/g)
      .map((b) => b.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    const sentences: string[] = [];
    for (const block of blocks) {
      const parts = block
        .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/g)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length > 0) {
        sentences.push(...parts);
      } else {
        sentences.push(block);
      }
    }

    const trimmed = sentences
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, maxScenes);

    const scenes: Record<string, string> = {};
    trimmed.forEach((text, idx) => {
      scenes[`scene_${idx + 1}`] = text;
    });

    return scenes;
  },

  /**
   * Generate B-roll prompts from a raw script (splits into scenes internally).
   */
  generateBrollPromptsFromScript: async (
    script: string,
    signal?: AbortSignal
  ): Promise<{ jsonText: string; plainText: string }> => {
    const scenes = brollService.scriptToScenes(script);
    if (Object.keys(scenes).length === 0) {
      throw new Error('Script could not be split into scenes');
    }
    return await brollService.generateBrollPrompts(scenes, signal);
  },

  /**
   * Generate B-roll prompts for all scenes in batches
   * @param scenes - Object with scene_1, scene_2, etc.
   * @param signal - Optional AbortSignal; when aborted (e.g. client cancelled), processing stops
   * @returns Object with both JSON text and plain text formats
   */
  generateBrollPrompts: async (
    scenes: Record<string, string>,
    signal?: AbortSignal
  ): Promise<{ jsonText: string; plainText: string }> => {
    console.log('🎬 Starting B-roll generation...');
    const apiKeys = getBrollApiKeys();
    console.log(`🔍 B-Roll Gemini API keys detected: ${apiKeys.length}`);
    if (apiKeys.length === 0) {
      throw new Error('No Gemini API keys configured for B-roll. Please set GEMINI_API_KEY_BROLL or GEMINI_API_KEY_BROLL1..N in .env');
    }

    // Convert scenes object to array of [key, value] pairs and sort by scene number
    const sceneEntries = Object.entries(scenes)
      .filter(([_, value]) => value && value.trim())
      .sort(([a], [b]) => {
        const numA = parseInt(a.replace('scene_', ''));
        const numB = parseInt(b.replace('scene_', ''));
        return numA - numB;
      });

    const totalScenes = sceneEntries.length;
    console.log(`📊 Total scenes to process: ${totalScenes}`);

    // Create one Gemini model client per API key
    const models = apiKeys.map((key, index) => {
      console.log(`🔑 Initializing Gemini client #${index + 1}`);
      const genAI = new GoogleGenerativeAI(key);
      return genAI.getGenerativeModel({
        model: brollGeneratorConfig.model,
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: brollGeneratorConfig.temperature,
        },
      });
    });

    const batchSize = brollGeneratorConfig.batchSize;
    const totalBatches = Math.ceil(totalScenes / batchSize);

    console.log(`📦 Processing in ${totalBatches} batches of up to ${batchSize} scenes each using ${models.length} parallel Gemini clients (round robin).`);

    // Prepare batch tasks
    const batchPromises: Promise<string>[] = [];

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const batch = sceneEntries.slice(start, start + batchSize);
      const sceneTexts = batch.map(([_, value]) => value);
      const startIndex = start;
      const batchNumber = batchIndex + 1;
      const modelStartIndex = batchIndex % models.length;

      const task = (async (): Promise<string> => {
        let attempt = 0;
        let lastError: unknown = null;

        while (attempt < models.length) {
          if (signal?.aborted) {
            const err = new Error('Cancelled') as Error & { name: string };
            err.name = 'AbortError';
            throw err;
          }

          const modelIndex = (modelStartIndex + attempt) % models.length;
          const model = models[modelIndex]!;

          console.log(
            `\n🔄 Processing batch ${batchNumber}/${totalBatches} (scenes ${startIndex + 1}-${startIndex + batch.length}) with API key #${modelIndex + 1}, attempt ${attempt + 1}/${models.length}...`,
          );

          try {
            const prompt = generateBrollPrompt(sceneTexts, startIndex);
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            console.log(`✅ Batch ${batchNumber} completed successfully on API key #${modelIndex + 1}`);
            return text;
          } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
              throw error;
            }
            lastError = error;
            const message = error instanceof Error ? error.message : String(error);
            console.error(
              `❌ Error in batch ${batchNumber} using API key #${modelIndex + 1}: ${message}`,
            );
            attempt += 1;
            if (attempt < models.length) {
              console.log(
                `🔁 Retrying batch ${batchNumber} with next API key (attempt ${attempt + 1}/${models.length})...`,
              );
            }
          }
        }

        const lastMessage =
          lastError instanceof Error ? lastError.message : String(lastError ?? 'Unknown error');
        throw new Error(
          `All API keys failed for batch ${batchNumber}/${totalBatches}: ${lastMessage}`,
        );
      })();

      batchPromises.push(task);
    }

    // Run all batches in parallel and preserve ordering by batch index
    const batchResults = await Promise.all(batchPromises);

    console.log(`\n🎉 B-roll generation complete across ${totalBatches} batches.`);
    const allPromptsText = batchResults.join('\n\n');
    const cleaned = cleanBrollOutput(allPromptsText.trim());
    return {
      jsonText: cleaned,
      plainText: cleaned
    };
  },
};
