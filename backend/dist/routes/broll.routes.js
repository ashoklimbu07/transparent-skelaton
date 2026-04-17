import { Router } from 'express';
import { brollService } from '../services/broll.service.js';
import { persistGenerationHistory } from '../services/history.service.js';
const router = Router();
// POST /api/broll/generate - Generate B-roll prompts from a raw script
router.post('/generate', async (req, res) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    let disconnectHandled = false;
    const handleClientDisconnect = () => {
        if (disconnectHandled || signal.aborted) {
            return;
        }
        disconnectHandled = true;
        console.log('🛑 User cancelled B-roll generation');
        abortController.abort();
    };
    // Covers cancellation during upload/body stream.
    req.on('aborted', handleClientDisconnect);
    // Do not use req "close" as cancel signal: it can fire on normal completed uploads
    // before long server processing starts, which would falsely abort valid requests.
    res.on('close', () => {
        if (!res.writableEnded) {
            handleClientDisconnect();
        }
    });
    try {
        const { script, style, desiredScenes } = req.body;
        if (!script || typeof script !== 'string' || script.trim().length === 0) {
            res.status(400).json({ error: 'Script is required and must be a non-empty string' });
            return;
        }
        if (!style || typeof style !== 'string') {
            res.status(400).json({ error: 'Style is required' });
            return;
        }
        if (!Number.isInteger(desiredScenes)) {
            res.status(400).json({ error: 'Desired scenes is required and must be an integer' });
            return;
        }
        if (desiredScenes < 25 || desiredScenes > 35) {
            res.status(400).json({ error: 'Desired scenes must be between 25 and 35' });
            return;
        }
        // Currently only supporting transparent_skeleton style
        if (style !== 'transparent_skeleton') {
            res.status(400).json({ error: 'Only transparent_skeleton style is currently supported' });
            return;
        }
        console.log(`🎬 Generating B-roll for style: ${style}`);
        console.log(`📝 Script length: ${script.length}`);
        console.log(`🎞️ Desired scenes: ${desiredScenes}`);
        const brollPrompts = await brollService.generateBrollPromptsFromScript(script, desiredScenes, signal);
        const sceneCount = brollPrompts.scenes.length;
        const payload = {
            success: true,
            style,
            promptsJson: brollPrompts.jsonText,
            promptsPlain: brollPrompts.plainText,
            totalScenes: sceneCount
        };
        await persistGenerationHistory({
            req,
            sourceTool: 'broll.generate',
            input: { script, style, desiredScenes },
            output: payload,
            // Keep combined output aligned with TXT export for History view/download.
            combinedOutput: brollPrompts.plainText,
            outputFormats: ['json', 'text'],
            files: [
                {
                    name: 'broll-prompts.json',
                    mimeType: 'application/json',
                    content: brollPrompts.jsonText,
                },
                {
                    name: 'broll-prompts.txt',
                    mimeType: 'text/plain',
                    content: brollPrompts.plainText,
                },
            ],
            metadata: {
                totalScenes: sceneCount,
            },
        });
        res.json(payload);
    }
    catch (error) {
        if (signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
            console.log('🛑 Request closed: user cancelled');
            try {
                res.status(499).json({ error: 'Cancelled' });
            }
            catch {
                // Connection already closed
            }
            return;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('B-roll generation error:', message);
        res.status(500).json({ error: 'Failed to generate B-roll prompts', details: message });
    }
});
export const brollRoutes = router;
//# sourceMappingURL=broll.routes.js.map