/**
 * Generate B-roll prompts for all scenes in batches.
 * @param scenes - Object with scene_1, scene_2, etc.
 * @param signal - Optional AbortSignal; when aborted (e.g. client cancelled), processing stops
 * @returns Object with both JSON text and plain text formats
 */
export declare function generateBrollPrompts(scenes: Record<string, string>, signal?: AbortSignal): Promise<{
    jsonText: string;
    plainText: string;
}>;
//# sourceMappingURL=generateBrollPrompts.d.ts.map