import { Router } from 'express';
import { generateManualStoryPrompts } from '../services/manualStory.service.js';
import { persistGenerationHistory } from '../services/history.service.js';
const router = Router();
function normalizeManualStoryScenes(raw) {
    if (!Array.isArray(raw) || raw.length === 0)
        return null;
    if (raw.every((item) => typeof item === 'string')) {
        const out = [];
        const strings = raw;
        for (let i = 0; i < strings.length; i += 1) {
            const text = strings[i].trim();
            if (!text)
                continue;
            out.push({ sceneIndex: i + 1, text });
        }
        return out.length > 0 ? out : null;
    }
    if (raw.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
        const out = [];
        for (const item of raw) {
            const o = item;
            const sceneIndex = Number(o.sceneIndex);
            const text = typeof o.text === 'string' ? o.text.trim() : '';
            if (!Number.isFinite(sceneIndex) || sceneIndex < 1 || !Number.isInteger(sceneIndex) || !text) {
                return null;
            }
            out.push({ sceneIndex, text });
        }
        return out.length > 0 ? out : null;
    }
    return null;
}
// POST /api/manual-story/generate - Generate text image prompts for user-defined scenes
router.post('/generate', async (req, res) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    let disconnectHandled = false;
    const handleClientDisconnect = () => {
        if (disconnectHandled || signal.aborted)
            return;
        disconnectHandled = true;
        console.log('🛑 User cancelled Manual Story generation');
        abortController.abort();
    };
    req.on('aborted', handleClientDisconnect);
    res.on('close', () => {
        if (!res.writableEnded)
            handleClientDisconnect();
    });
    try {
        const { characters, scenes, style } = req.body;
        if (!characters || typeof characters !== 'object' || Array.isArray(characters)) {
            res.status(400).json({ error: 'characters must be an object like { "c1": "detail", ... }' });
            return;
        }
        const scenesNormalized = normalizeManualStoryScenes(scenes);
        if (!scenesNormalized) {
            res.status(400).json({
                error: 'scenes must be a non-empty array of strings, or objects { sceneIndex: number (>=1), text: string }',
            });
            return;
        }
        if (scenesNormalized.length > 5) {
            res.status(400).json({ error: 'Maximum scenes is 5 for now.' });
            return;
        }
        const sceneIndices = scenesNormalized.map((s) => s.sceneIndex);
        if (new Set(sceneIndices).size !== sceneIndices.length) {
            res.status(400).json({ error: 'Duplicate sceneIndex values are not allowed.' });
            return;
        }
        if (style !== 'cinematic-35mm' && style !== 'photorealistic') {
            res.status(400).json({ error: 'style must be either "cinematic-35mm" or "photorealistic"' });
            return;
        }
        const scenesClean = [...scenesNormalized].sort((a, b) => a.sceneIndex - b.sceneIndex);
        const charactersObj = characters;
        const allowedKeys = new Set(['c1', 'c2', 'c3', 'c4', 'c5']);
        const charactersClean = {};
        for (const [key, value] of Object.entries(charactersObj)) {
            if (!allowedKeys.has(key))
                continue;
            if (typeof value !== 'string')
                continue;
            const trimmed = value.trim();
            if (!trimmed)
                continue;
            charactersClean[key] = trimmed;
        }
        if (Object.keys(charactersClean).length === 0) {
            res.status(400).json({ error: 'At least one character detail must be provided.' });
            return;
        }
        console.log(`🎬 Manual Story generation · characters=${Object.keys(charactersClean).length} scenes=${scenesClean.length}`);
        const result = await generateManualStoryPrompts({
            characters: charactersClean,
            scenes: scenesClean,
            style,
            signal,
        });
        const payload = {
            success: true,
            sceneCount: scenesClean.length,
            characterCount: Object.keys(charactersClean).length,
            promptsByScene: result.promptsByScene,
            promptsPlain: result.promptsPlain,
        };
        await persistGenerationHistory({
            req,
            sourceTool: 'manual-story.generate',
            input: {
                characters: charactersClean,
                scenes: scenesClean,
                style,
            },
            output: payload,
            combinedOutput: result.promptsPlain,
            outputFormats: ['json', 'text'],
            files: [
                {
                    name: 'manual-story-prompts.json',
                    mimeType: 'application/json',
                    content: JSON.stringify(result.promptsByScene, null, 2),
                },
                {
                    name: 'manual-story-prompts.txt',
                    mimeType: 'text/plain',
                    content: result.promptsPlain,
                },
            ],
            metadata: {
                sceneCount: scenesClean.length,
                characterCount: Object.keys(charactersClean).length,
            },
        });
        res.json(payload);
    }
    catch (error) {
        if (signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
            console.log('🛑 Manual Story: Request closed');
            try {
                res.status(499).json({ error: 'Cancelled' });
            }
            catch {
                // ignore if connection already closed
            }
            return;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Manual Story generation error:', message);
        res.status(500).json({ error: 'Failed to generate manual story prompts', details: message });
    }
});
export const manualStoryRoutes = router;
//# sourceMappingURL=manualStory.routes.js.map