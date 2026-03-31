import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateBrollPrompt, brollGeneratorConfig } from '../../prompts/brollmasterprompt.js';
import { cleanBrollOutput } from './cleanBrollOutput.js';
import { delay } from './delay.js';
import { getBrollApiKeys } from './getBrollApiKeys.js';
/**
 * Generate B-roll prompts for all scenes in batches.
 * @param scenes - Object with scene_1, scene_2, etc.
 * @param signal - Optional AbortSignal; when aborted (e.g. client cancelled), processing stops
 * @returns Object with both JSON text and plain text formats
 */
export async function generateBrollPrompts(scenes, signal) {
    const throwIfAborted = () => {
        if (signal?.aborted) {
            const err = new Error('Cancelled');
            err.name = 'AbortError';
            throw err;
        }
    };
    console.log('🎬 Starting B-roll generation...');
    const apiKeys = getBrollApiKeys();
    console.log(`🔍 B-Roll Gemini API keys detected: ${apiKeys.length}`);
    if (apiKeys.length === 0) {
        throw new Error('No Gemini API keys configured for B-roll. Please set GEMINI_API_KEY_BROLL or GEMINI_API_KEY_BROLL1..N in .env');
    }
    // Convert scenes object to array of [key, value] pairs and sort by scene number
    const sceneEntries = Object.entries(scenes)
        .filter(([_, value]) => value && value.trim())
        .sort(([a], [b]) => {
        const numA = parseInt(a.replace('scene_', ''));
        const numB = parseInt(b.replace('scene_', ''));
        return numA - numB;
    });
    const totalScenes = sceneEntries.length;
    console.log(`📊 Total scenes to process: ${totalScenes}`);
    // Create one Gemini model client per API key
    const models = apiKeys.map((key, index) => {
        console.log(`🔑 Initializing Gemini client #${index + 1}`);
        const genAI = new GoogleGenerativeAI(key);
        return genAI.getGenerativeModel({
            model: brollGeneratorConfig.model,
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: brollGeneratorConfig.temperature,
            },
        });
    });
    const batchSize = brollGeneratorConfig.batchSize;
    const totalBatches = Math.ceil(totalScenes / batchSize);
    console.log(`📦 Processing in ${totalBatches} batches of up to ${batchSize} scenes each using ${models.length} parallel Gemini clients (round robin).`);
    // Run batches in "waves" so we only have up to `models.length` concurrent calls
    // (one per API key). This prevents flooding the API and keeps output stable.
    const batchResults = new Array(totalBatches).fill('');
    for (let waveStart = 0; waveStart < totalBatches; waveStart += models.length) {
        throwIfAborted();
        const waveIndices = [];
        for (let i = waveStart; i < Math.min(waveStart + models.length, totalBatches); i++) {
            waveIndices.push(i);
        }
        const wavePromises = waveIndices.map(async (batchIndex) => {
            const start = batchIndex * batchSize;
            const batch = sceneEntries.slice(start, start + batchSize);
            const sceneTexts = batch.map(([_, value]) => value);
            const startIndex = start;
            const batchNumber = batchIndex + 1;
            const modelStartIndex = batchIndex % models.length;
            let attempt = 0;
            let lastError = null;
            while (attempt < models.length) {
                throwIfAborted();
                const modelIndex = (modelStartIndex + attempt) % models.length;
                const model = models[modelIndex];
                console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (scenes ${startIndex + 1}-${startIndex + batch.length}) with API key #${modelIndex + 1}, attempt ${attempt + 1}/${models.length}...`);
                try {
                    const prompt = generateBrollPrompt(sceneTexts, startIndex);
                    const result = await model.generateContent(prompt);
                    // If user cancelled while Gemini was in-flight, do not continue pipeline.
                    throwIfAborted();
                    const response = result.response;
                    const text = response.text();
                    console.log(`✅ Batch ${batchNumber} completed successfully on API key #${modelIndex + 1}`);
                    return text;
                }
                catch (error) {
                    if (error instanceof Error && error.name === 'AbortError') {
                        throw error;
                    }
                    lastError = error;
                    const message = error instanceof Error ? error.message : String(error);
                    console.error(`❌ Error in batch ${batchNumber} using API key #${modelIndex + 1}: ${message}`);
                    attempt += 1;
                    if (attempt < models.length) {
                        console.log(`🔁 Retrying batch ${batchNumber} with next API key (attempt ${attempt + 1}/${models.length})...`);
                    }
                }
            }
            const lastMessage = lastError instanceof Error ? lastError.message : String(lastError ?? 'Unknown error');
            throw new Error(`All API keys failed for batch ${batchNumber}/${totalBatches}: ${lastMessage}`);
        });
        const waveResults = await Promise.all(wavePromises);
        throwIfAborted();
        waveIndices.forEach((batchIndex, idx) => {
            batchResults[batchIndex] = waveResults[idx] ?? '';
        });
        const hasMoreWaves = waveStart + models.length < totalBatches;
        if (hasMoreWaves && brollGeneratorConfig.batchDelayMs > 0) {
            await delay(brollGeneratorConfig.batchDelayMs, signal);
        }
    }
    console.log(`\n🎉 B-roll generation complete across ${totalBatches} batches.`);
    const allPromptsText = batchResults.join('\n\n');
    const cleaned = cleanBrollOutput(allPromptsText.trim());
    return {
        jsonText: cleaned,
        plainText: cleaned,
    };
}
//# sourceMappingURL=generateBrollPrompts.js.map