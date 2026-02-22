/**
 * Process script scenes in batches to generate B-roll image prompts
 */
export declare const brollService: {
    /**
     * Generate B-roll prompts for all scenes in batches
     * @param scenes - Object with scene_1, scene_2, etc.
     * @returns Object with both JSON text and plain text formats
     */
    generateBrollPrompts: (scenes: Record<string, string>) => Promise<{
        jsonText: string;
        plainText: string;
    }>;
};
//# sourceMappingURL=broll.service.d.ts.map