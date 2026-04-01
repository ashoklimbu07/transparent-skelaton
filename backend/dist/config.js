import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brollGeneratorConfig } from './prompts/brollmasterprompt.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });
dotenv.config();
const DEFAULT_SCENE_COUNT = Number(process.env.SCENE_COUNT ?? 30);
const readPoolKey = (index) => {
    const primary = process.env[`GEMINI_KEY_${index}`]?.trim();
    if (primary)
        return primary;
    const fallback = process.env[`GEMINI_API_KEY_BROLL${index}`]?.trim();
    return fallback || undefined;
};
export const CONFIG = {
    SCENE_COUNT: DEFAULT_SCENE_COUNT,
    /** Final B-roll generation: scenes per Gemini call (fixed at 5). */
    BATCH_SIZE: brollGeneratorConfig.batchSize,
    MAX_RETRIES: 3,
    BATCH_DELAY_MS: brollGeneratorConfig.batchDelayMs,
    MODEL: brollGeneratorConfig.model,
    TEMPERATURE: brollGeneratorConfig.temperature,
    ANALYZER_API_KEY: process.env.ANALYZER_GEMINI_KEY?.trim() || '',
    API_KEYS: [1, 2, 3, 4, 5].map(readPoolKey).filter((key) => Boolean(key)),
};
//# sourceMappingURL=config.js.map