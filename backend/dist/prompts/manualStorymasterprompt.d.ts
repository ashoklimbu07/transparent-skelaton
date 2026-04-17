export declare function getManualStorySystemPrompt(): string;
export declare function getManualStoryUserPrompt(args: {
    characters: Record<string, string>;
    scenes: Array<{
        sceneIndex: number;
        text: string;
    }>;
    style: 'cinematic-35mm' | 'photorealistic';
}): string;
//# sourceMappingURL=manualStorymasterprompt.d.ts.map