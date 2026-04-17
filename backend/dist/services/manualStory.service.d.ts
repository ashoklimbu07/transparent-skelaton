export type ManualStoryPrompt = {
    sceneIndex: number;
    imagePrompt: string;
};
export type ManualStoryGenerationResult = {
    promptsByScene: ManualStoryPrompt[];
    promptsPlain: string;
};
export declare function generateManualStoryPrompts(args: {
    characters: Record<string, string>;
    scenes: Array<{
        sceneIndex: number;
        text: string;
    }>;
    style: 'cinematic-35mm' | 'photorealistic';
    signal?: AbortSignal;
}): Promise<ManualStoryGenerationResult>;
//# sourceMappingURL=manualStory.service.d.ts.map