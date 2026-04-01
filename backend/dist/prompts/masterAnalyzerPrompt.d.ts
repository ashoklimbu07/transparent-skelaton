/**
 * Single-call master analyzer: global context card + full scene chunk list.
 * Kept tight to reduce output tokens; fields must stay aligned with SceneChunk / ContextCard.
 */
export declare function getMasterAnalyzerSystemPrompt(): string;
export declare function getMasterAnalyzerUserPrompt(script: string, sceneCount: number): string;
//# sourceMappingURL=masterAnalyzerPrompt.d.ts.map