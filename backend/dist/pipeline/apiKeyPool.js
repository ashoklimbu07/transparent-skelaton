const POLL_INTERVAL_MS = 500;
export class ApiKeyPool {
    entries;
    constructor(keys) {
        this.entries = keys.map((key, index) => ({
            id: index + 1,
            key,
            hitsUsed: 0,
            limit: 20,
            busy: false,
        }));
    }
    async getFreeKey() {
        while (true) {
            const free = this.entries.find((entry) => !entry.busy && entry.hitsUsed < entry.limit);
            if (free) {
                free.busy = true;
                return free;
            }
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        }
    }
    releaseKey(entry) {
        const target = this.entries.find((item) => item.key === entry.key);
        if (!target)
            return;
        target.hitsUsed += 1;
        target.busy = false;
    }
    getStats() {
        return this.entries.map((entry) => ({
            id: entry.id,
            key: entry.key,
            hitsUsed: entry.hitsUsed,
            available: !entry.busy && entry.hitsUsed < entry.limit,
        }));
    }
}
//# sourceMappingURL=apiKeyPool.js.map