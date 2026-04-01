import type { ApiKeyEntry } from '../types.js';
export declare class ApiKeyPool {
    private readonly entries;
    constructor(keys: string[]);
    getFreeKey(): Promise<ApiKeyEntry>;
    releaseKey(entry: ApiKeyEntry): void;
    getStats(): {
        id: number;
        key: string;
        hitsUsed: number;
        available: boolean;
    }[];
}
//# sourceMappingURL=apiKeyPool.d.ts.map