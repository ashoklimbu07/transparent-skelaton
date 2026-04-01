import { runPipeline } from '../pipeline/pipeline.js';
// helper functions moved to `backend/src/services/broll/*`
/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export const brollService = {
    /**
     * Generate B-roll prompts from a raw script via analyzer -> phase -> batch pipeline.
     */
    generateBrollPromptsFromScript: async (script, desiredScenes, signal) => {
        const result = await runPipeline(script, desiredScenes, signal);
        const toSceneBlock = (scene) => JSON.stringify(scene, null, 2);
        const output = result.scenes.map(toSceneBlock).join('\n\n');
        return {
            jsonText: output,
            plainText: output,
        };
    },
};
//# sourceMappingURL=broll.service.js.map