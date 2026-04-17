import { runPipeline } from '../pipeline/pipeline.js';
import type { BrollScene } from '../types.js';

// helper functions moved to `backend/src/services/broll/*`

/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export const brollService = {
  /**
   * Generate B-roll prompts from a raw script via analyzer -> phase -> batch pipeline.
   */
  generateBrollPromptsFromScript: async (
    script: string,
    desiredScenes: number,
    signal?: AbortSignal
  ): Promise<{ scenes: BrollScene[]; jsonText: string; plainText: string }> => {
    const result = await runPipeline(script, desiredScenes, signal);
    const toSceneBlock = (scene: BrollScene): string => JSON.stringify(scene, null, 2);
    const plainText = result.scenes.map(toSceneBlock).join('\n\n');
    return {
      scenes: result.scenes,
      jsonText: JSON.stringify(result.scenes, null, 2),
      plainText,
    };
  },
};
