/**
 * Extract top-level JSON objects from arbitrary model output.
 * We scan for balanced `{ ... }` blocks while respecting JSON strings so
 * braces inside strings don't break parsing.
 */
export declare function splitTopLevelJsonObjects(text: string): string[];
//# sourceMappingURL=splitTopLevelJsonObjects.d.ts.map