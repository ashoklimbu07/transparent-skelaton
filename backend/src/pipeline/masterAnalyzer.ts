import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from '../config.js';
import { getMasterAnalyzerSystemPrompt, getMasterAnalyzerUserPrompt } from '../prompts/masterAnalyzerPrompt.js';
import type { MasterAnalyzerResult, SceneChunk } from '../types.js';
import { safeParseJSON } from '../utils/safeParseJSON.js';

function normalizeChunks(raw: SceneChunk[], sceneCount: number): SceneChunk[] {
  const withNumericIds = raw.map((c) => ({
    ...c,
    id: typeof c.id === 'string' ? Number(c.id) : c.id,
  }));
  const sorted = [...withNumericIds].sort((a, b) => a.id - b.id);
  if (sorted.length !== sceneCount) {
    throw new Error(`Master analyzer returned ${sorted.length} chunks, expected ${sceneCount}`);
  }
  for (let i = 0; i < sceneCount; i += 1) {
    const chunk = sorted[i]!;
    const expectedId = i + 1;
    if (chunk.id !== expectedId) {
      throw new Error(`Chunk id mismatch at index ${i}: got ${chunk.id}, expected ${expectedId}`);
    }
  }
  return sorted;
}

export async function runMasterAnalyzer(
  script: string,
  apiKey: string,
  sceneCount: number,
): Promise<MasterAnalyzerResult> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt += 1) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: CONFIG.MODEL,
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: CONFIG.TEMPERATURE,
        },
      });

      const result = await model.generateContent([
        { text: getMasterAnalyzerSystemPrompt() },
        { text: getMasterAnalyzerUserPrompt(script, sceneCount) },
      ]);
      const rawText = result.response.text();
      const parsed = safeParseJSON<MasterAnalyzerResult>(rawText);

      if (!parsed.context_card || !Array.isArray(parsed.chunks)) {
        throw new Error('Master analyzer JSON must include context_card and chunks array');
      }

      const chunks = normalizeChunks(parsed.chunks, sceneCount);
      console.log(`Master analyzer complete — context card + ${chunks.length} chunks (1 API call)`);
      return { context_card: parsed.context_card, chunks };
    } catch (error) {
      lastError = error;
      if (attempt >= CONFIG.MAX_RETRIES) break;
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError ?? 'Unknown error');
  throw new Error(`Master analyzer failed after ${CONFIG.MAX_RETRIES} retries: ${message}`);
}
