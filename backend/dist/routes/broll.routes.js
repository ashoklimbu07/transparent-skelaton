import { Router } from 'express';
import { brollService } from '../services/broll.service.js';
const router = Router();
// POST /api/broll/generate - Generate B-roll prompts from formatted scenes
router.post('/generate', async (req, res) => {
    try {
        const { scenes, style } = req.body;
        if (!scenes || typeof scenes !== 'object') {
            res.status(400).json({ error: 'Scenes object is required' });
            return;
        }
        if (!style || typeof style !== 'string') {
            res.status(400).json({ error: 'Style is required' });
            return;
        }
        // Currently only supporting transparent_skeleton style
        if (style !== 'transparent_skeleton') {
            res.status(400).json({ error: 'Only transparent_skeleton style is currently supported' });
            return;
        }
        console.log(`🎬 Generating B-roll for style: ${style}`);
        console.log(`📊 Number of scenes: ${Object.keys(scenes).length}`);
        const brollPrompts = await brollService.generateBrollPrompts(scenes);
        // Count scenes from the text output
        const sceneCount = (brollPrompts.plainText.match(/Scene \d+:/g) || []).length;
        res.json({
            success: true,
            style,
            promptsJson: brollPrompts.jsonText,
            promptsPlain: brollPrompts.plainText,
            totalScenes: sceneCount
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('B-roll generation error:', message);
        res.status(500).json({ error: 'Failed to generate B-roll prompts', details: message });
    }
});
export const brollRoutes = router;
//# sourceMappingURL=broll.routes.js.map