/**
 * Collect all configured B-roll Gemini API keys from environment.
 * Supports multiple keys like GEMINI_API_KEY_BROLL1, GEMINI_API_KEY_BROLL2, etc.
 */
export function getBrollApiKeys() {
    const keys = [];
    // Backward-compatible single key
    if (process.env.GEMINI_API_KEY_BROLL) {
        keys.push(process.env.GEMINI_API_KEY_BROLL);
    }
    // Numbered keys
    for (let i = 1; i <= 10; i++) {
        const key = process.env[`GEMINI_API_KEY_BROLL${i}`];
        if (key)
            keys.push(key);
    }
    // De-duplicate just in case
    return Array.from(new Set(keys));
}
//# sourceMappingURL=getBrollApiKeys.js.map