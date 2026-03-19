import { scriptToScenes } from './broll/scriptToScenes.js';
import { generateBrollPrompts } from './broll/generateBrollPrompts.js';
/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export declare const brollService: {
    scriptToScenes: typeof scriptToScenes;
    /**
     * Generate B-roll prompts from a raw script (splits into scenes internally).
     */
    generateBrollPromptsFromScript: (script: string, signal?: AbortSignal) => Promise<{
        jsonText: string;
        plainText: string;
    }>;
    generateBrollPrompts: typeof generateBrollPrompts;
};
//# sourceMappingURL=broll.service.d.ts.map