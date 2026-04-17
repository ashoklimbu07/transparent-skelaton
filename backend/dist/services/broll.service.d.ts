import type { BrollScene } from '../types.js';
/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export declare const brollService: {
    /**
     * Generate B-roll prompts from a raw script via analyzer -> phase -> batch pipeline.
     */
    generateBrollPromptsFromScript: (script: string, desiredScenes: number, signal?: AbortSignal) => Promise<{
        scenes: BrollScene[];
        jsonText: string;
        plainText: string;
    }>;
};
//# sourceMappingURL=broll.service.d.ts.map