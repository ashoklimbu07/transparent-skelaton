export declare const videoSceneAnalyzerService: {
    analyzeVideo(videoBase64: string, mimeType: string): Promise<{
        id: string;
        originalText: string;
        visualPrompt: string;
        status: "pending";
    }[]>;
    regenerateVisualPrompt(segmentText: string): Promise<string>;
    generateImage(prompt: string, styleModifier: string, aspectRatio: string): Promise<string>;
    generateVideo(prompt: string, styleModifier: string, aspectRatio: string): Promise<string>;
};
//# sourceMappingURL=videoSceneAnalyzer.service.d.ts.map