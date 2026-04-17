import type { Request } from 'express';
type HistoryFileInput = {
    name?: string;
    mimeType?: string;
    url?: string;
    content?: string;
};
type PersistGenerationHistoryInput = {
    req: Request;
    sourceTool: string;
    input?: unknown;
    output?: unknown;
    combinedOutput?: string;
    outputFormats?: string[];
    files?: HistoryFileInput[];
    metadata?: unknown;
};
export declare function persistGenerationHistory({ req, sourceTool, input, output, combinedOutput, outputFormats, files, metadata, }: PersistGenerationHistoryInput): Promise<void>;
export {};
//# sourceMappingURL=history.service.d.ts.map