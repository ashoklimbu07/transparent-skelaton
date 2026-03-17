import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateBrollPrompt, brollGeneratorConfig } from '../prompts/brollmasterprompt.js';

/**
 * Clean AI output to final format: "Scene N: Title" then prompt only. No markdown, no Negative Prompt or Suggested Settings.
 * Drops any leading content (e.g. script analysis) before the first scene.
 */
function cleanBrollOutput(raw: string): string {
  let text = raw.replace(/\*\*/g, '').trim();
  const firstScene = text.match(/\bScene \d+:/i);
  if (firstScene && firstScene.index != null && firstScene.index > 0) {
    text = text.slice(firstScene.index).trim();
  }
  const hasOldFormat =
    text.includes('Main Image Prompt:') ||
    text.includes('Negative Prompt:') ||
    text.includes('Suggested Settings:');
  if (!hasOldFormat) return text;

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
  return out.join('\n\n');
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
    console.log('🔍 Checking Gemini API Key for B-Roll:', process.env.GEMINI_API_KEY_BROLL ? 'Present ✅' : 'Missing ❌');
    
    if (!process.env.GEMINI_API_KEY_BROLL) {
      throw new Error('GEMINI_API_KEY_BROLL is not configured in .env file');
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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_BROLL);
    const model = genAI.getGenerativeModel({ 
      model: brollGeneratorConfig.model,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: brollGeneratorConfig.temperature,
      }
    });

    let allPromptsText = '';
    const batchSize = brollGeneratorConfig.batchSize;
    const totalBatches = Math.ceil(totalScenes / batchSize);

    // Process in batches
    for (let i = 0; i < totalScenes; i += batchSize) {
      if (signal?.aborted) {
        const err = new Error('Cancelled') as Error & { name: string };
        err.name = 'AbortError';
        throw err;
      }

      const batchNumber = Math.floor(i / batchSize) + 1;
      const batch = sceneEntries.slice(i, i + batchSize);
      const sceneTexts = batch.map(([_, value]) => value);
      const startIndex = i;

      console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (scenes ${startIndex + 1}-${startIndex + batch.length})...`);

      try {
        const prompt = generateBrollPrompt(sceneTexts, startIndex);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log(`✅ Batch ${batchNumber} response received`);

        allPromptsText += text + '\n\n';

        console.log(`✅ Batch ${batchNumber} completed`);

        // Wait before next batch (except for the last batch); abortable so cancel stops quickly
        if (i + batchSize < totalScenes) {
          const delayMs = brollGeneratorConfig.batchDelayMs;
          const delaySeconds = delayMs / 1000;
          console.log(`⏳ Waiting ${delaySeconds} seconds before next batch...`);
          await delay(delayMs, signal);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') throw error;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error in batch ${batchNumber}:`, message);
        throw new Error(`Failed at batch ${batchNumber}/${totalBatches}: ${message}`);
      }
    }

    console.log(`\n🎉 B-roll generation complete!`);
    const cleaned = cleanBrollOutput(allPromptsText.trim());
    return {
      jsonText: cleaned,
      plainText: cleaned
    };
  },
};
