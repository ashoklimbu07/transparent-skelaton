import { scriptToScenes } from './broll/scriptToScenes.js';
import { generateBrollPrompts } from './broll/generateBrollPrompts.js';

// helper functions moved to `backend/src/services/broll/*`

/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export const brollService = {
  scriptToScenes,

  /**
   * Generate B-roll prompts from a raw script (splits into scenes internally).
   */
  generateBrollPromptsFromScript: async (
    script: string,
    signal?: AbortSignal
  ): Promise<{ jsonText: string; plainText: string }> => {
    // Choose a target number of scenes between 20 and 35 based on script length.
    // (Your frontend enforces 1000–1500 chars, so this stays within bounds.)
    const normalized = script.replace(/\r\n/g, '\n').trim();
    const charLen = normalized.length;
    const minScenes = 20;
    const maxScenes = 35;

    // Map ~1000 chars -> 20 scenes, ~1500 chars -> 35 scenes.
    const t = (charLen - 1000) / 500;
    const targetScenes = Math.max(minScenes, Math.min(maxScenes, Math.round(minScenes + t * (maxScenes - minScenes))));

    const scenes = scriptToScenes(script, targetScenes, targetScenes);
    if (Object.keys(scenes).length === 0) {
      throw new Error('Script could not be split into scenes');
    }
    return await generateBrollPrompts(scenes, signal);
  },

  generateBrollPrompts,
};
