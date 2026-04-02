/**
 * Manual Story -> image prompt generator (text-only for now).
 *
 * Note: The "master prompt" is intentionally kept simple because you said you'll
 * refine it later. The goal right now is to complete the flow + data plumbing.
 */
export declare function getManualStorySystemPrompt(): string;
export declare function getManualStoryUserPrompt(args: {
    characters: Record<string, string>;
    scenes: string[];
}): string;
//# sourceMappingURL=manualStorymasterprompt.d.ts.map