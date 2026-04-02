import { Router } from 'express';
import { generateManualStoryPrompts } from '../services/manualStory.service.js';
const router = Router();
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
        const { characters, scenes } = req.body;
        if (!characters || typeof characters !== 'object' || Array.isArray(characters)) {
            res.status(400).json({ error: 'characters must be an object like { "c1": "detail", ... }' });
            return;
        }
        if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
            res.status(400).json({ error: 'scenes must be a non-empty string array' });
            return;
        }
        if (scenes.length > 5) {
            res.status(400).json({ error: 'Maximum scenes is 5 for now.' });
            return;
        }
        const scenesClean = scenes
            .map((s) => (typeof s === 'string' ? s.trim() : ''))
            .filter((s) => s.length > 0);
        if (scenesClean.length === 0) {
            res.status(400).json({ error: 'scenes must contain at least one non-empty string' });
            return;
        }
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
            signal,
        });
        res.json({
            success: true,
            sceneCount: scenesClean.length,
            characterCount: Object.keys(charactersClean).length,
            promptsByScene: result.promptsByScene,
            promptsPlain: result.promptsPlain,
        });
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