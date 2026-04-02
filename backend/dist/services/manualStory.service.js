import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeParseJSON } from '../utils/safeParseJSON.js';
import { getManualStorySystemPrompt, getManualStoryUserPrompt } from '../prompts/manualStorymasterprompt.js';
function getManualStoryGeminiKey() {
    const key = process.env.GEMINI_API_KEY_MANUALSTORY?.trim() || '';
    if (!key) {
        throw new Error('Missing GEMINI_API_KEY_MANUALSTORY. Add a dedicated Gemini key for Manual Story generation in backend/.env.');
    }
    return key;
}
export async function generateManualStoryPrompts(args) {
    const { characters, scenes, style, signal } = args;
    if (signal?.aborted) {
        const err = new Error('Cancelled');
        err.name = 'AbortError';
        throw err;
    }
    const geminiKey = getManualStoryGeminiKey();
    const modelName = process.env.MANUAL_STORY_GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    const temperature = process.env.MANUAL_STORY_TEMPERATURE ? Number(process.env.MANUAL_STORY_TEMPERATURE) : 0.7;
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            maxOutputTokens: 4096,
            temperature: Number.isFinite(temperature) ? temperature : 0.7,
        },
    });
    const result = await model.generateContent([
        { text: getManualStorySystemPrompt() },
        { text: getManualStoryUserPrompt({ characters, scenes, style }) },
    ]);
    if (signal?.aborted) {
        const err = new Error('Cancelled');
        err.name = 'AbortError';
        throw err;
    }
    const rawText = result.response.text();
    const parsed = safeParseJSON(rawText);
    const promptsByScene = [];
    if (Array.isArray(parsed.promptsByScene) && parsed.promptsByScene.length > 0) {
        for (const item of parsed.promptsByScene) {
            if (!item || typeof item.sceneIndex !== 'number' || typeof item.imagePrompt !== 'string')
                continue;
            const imagePrompt = item.imagePrompt.trim();
            if (!imagePrompt)
                continue;
            promptsByScene.push({ sceneIndex: item.sceneIndex, imagePrompt });
        }
    }
    else if (Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
        for (const item of parsed.scenes) {
            if (!item || typeof item.sceneIndex !== 'number')
                continue;
            const candidatePrompt = (typeof item.mainImagePrompt === 'string' && item.mainImagePrompt.trim()) ||
                (typeof item.imagePrompt === 'string' && item.imagePrompt.trim()) ||
                (typeof item.broll?.brollPrompt === 'string' && item.broll.brollPrompt.trim()) ||
                '';
            if (!candidatePrompt)
                continue;
            promptsByScene.push({ sceneIndex: item.sceneIndex, imagePrompt: candidatePrompt });
        }
    }
    if (promptsByScene.length !== scenes.length) {
        throw new Error(`Manual story generation returned ${promptsByScene.length} prompts, expected ${scenes.length}.`);
    }
    // Ensure stable ordering by sceneIndex.
    const normalized = [...promptsByScene].sort((a, b) => a.sceneIndex - b.sceneIndex);
    const promptsPlain = normalized
        .map((p) => JSON.stringify({
        sceneIndex: p.sceneIndex,
        imagePrompt: p.imagePrompt.trim(),
    }))
        .join('\n\n');
    return { promptsByScene: normalized, promptsPlain };
}
//# sourceMappingURL=manualStory.service.js.map