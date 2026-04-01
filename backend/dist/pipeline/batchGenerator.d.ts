import type { BrollScene, SceneChunk } from '../types.js';
import { ApiKeyPool } from './apiKeyPool.js';
export declare function runBatchGenerator(params: {
    allChunks: SceneChunk[];
    pool: ApiKeyPool;
    signal?: AbortSignal;
}): Promise<BrollScene[]>;
//# sourceMappingURL=batchGenerator.d.ts.map