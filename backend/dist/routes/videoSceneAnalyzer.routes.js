import { Router } from 'express';
import { videoSceneAnalyzerService } from '../services/videoSceneAnalyzer.service.js';
import { persistGenerationHistory } from '../services/history.service.js';
const router = Router();
function buildAnalyzerCombinedOutput(scenes, segmentLabel) {
    return scenes
        .map((scene, index) => {
        const originalText = typeof scene.originalText === 'string' ? scene.originalText.trim() : '';
        const visualPrompt = typeof scene.visualPrompt === 'string' ? scene.visualPrompt.trim() : '';
        return [
            `SCENE ${index + 1}`,
            '------------------',
            `${segmentLabel}: "${originalText}"`,
            `VISUAL PROMPT: ${visualPrompt}`,
        ].join('\n');
    })
        .join('\n\n');
}
router.post('/analyze-video', async (req, res) => {
    try {
        const videoBase64 = typeof req.body?.videoBase64 === 'string' ? req.body.videoBase64.trim() : '';
        const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType.trim() : '';
        if (!videoBase64) {
            res.status(400).json({ error: 'videoBase64 is required' });
            return;
        }
        if (!mimeType) {
            res.status(400).json({ error: 'mimeType is required' });
            return;
        }
        const scenes = await videoSceneAnalyzerService.analyzeVideo(videoBase64, mimeType);
        const payload = { scenes };
        const combinedOutput = buildAnalyzerCombinedOutput(scenes, 'VIDEO SEGMENT');
        await persistGenerationHistory({
            req,
            sourceTool: 'video-scene-analyzer.analyze-video',
            input: {
                mimeType,
                videoBytesApprox: Math.floor((videoBase64.length * 3) / 4),
            },
            output: payload,
            combinedOutput,
            outputFormats: ['json', 'text'],
            files: [
                {
                    name: 'analyzed-video-scenes.json',
                    mimeType: 'application/json',
                    content: JSON.stringify(scenes, null, 2),
                },
                {
                    name: 'analyzed-video-scenes.txt',
                    mimeType: 'text/plain',
                    content: combinedOutput,
                },
            ],
        });
        res.json(payload);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Video Scene Analyzer video analysis error:', message);
        res.status(500).json({ error: 'Failed to analyze video', details: message });
    }
});
router.post('/regenerate-visual-prompt', async (req, res) => {
    try {
        const segmentText = typeof req.body?.segmentText === 'string' ? req.body.segmentText.trim() : '';
        if (!segmentText) {
            res.status(400).json({ error: 'segmentText is required' });
            return;
        }
        const visualPrompt = await videoSceneAnalyzerService.regenerateVisualPrompt(segmentText);
        const payload = { visualPrompt };
        await persistGenerationHistory({
            req,
            sourceTool: 'video-scene-analyzer.regenerate-visual-prompt',
            input: { segmentText },
            output: payload,
            combinedOutput: visualPrompt,
            outputFormats: ['text'],
            files: [
                {
                    name: 'visual-prompt.txt',
                    mimeType: 'text/plain',
                    content: visualPrompt,
                },
            ],
        });
        res.json(payload);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Video Scene Analyzer prompt regeneration error:', message);
        res.status(500).json({ error: 'Failed to regenerate visual prompt', details: message });
    }
});
router.post('/generate-image', async (req, res) => {
    try {
        const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
        const styleModifier = typeof req.body?.styleModifier === 'string' ? req.body.styleModifier : '';
        const aspectRatio = typeof req.body?.aspectRatio === 'string' ? req.body.aspectRatio : '';
        if (!prompt.trim() || !styleModifier.trim() || !aspectRatio.trim()) {
            res.status(400).json({ error: 'prompt, styleModifier and aspectRatio are required' });
            return;
        }
        const imageUrl = await videoSceneAnalyzerService.generateImage(prompt, styleModifier, aspectRatio);
        const payload = { imageUrl };
        await persistGenerationHistory({
            req,
            sourceTool: 'video-scene-analyzer.generate-image',
            input: { prompt, styleModifier, aspectRatio },
            output: payload,
            combinedOutput: imageUrl,
            outputFormats: ['url'],
            files: [
                {
                    name: 'generated-image-url.txt',
                    mimeType: 'text/plain',
                    content: imageUrl,
                    url: imageUrl,
                },
            ],
        });
        res.json(payload);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Video Scene Analyzer image generation error:', message);
        res.status(500).json({ error: 'Failed to generate image', details: message });
    }
});
router.post('/generate-video', async (req, res) => {
    try {
        const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
        const styleModifier = typeof req.body?.styleModifier === 'string' ? req.body.styleModifier : '';
        const aspectRatio = typeof req.body?.aspectRatio === 'string' ? req.body.aspectRatio : '';
        if (!prompt.trim() || !styleModifier.trim() || !aspectRatio.trim()) {
            res.status(400).json({ error: 'prompt, styleModifier and aspectRatio are required' });
            return;
        }
        const videoUrl = await videoSceneAnalyzerService.generateVideo(prompt, styleModifier, aspectRatio);
        const payload = { videoUrl };
        await persistGenerationHistory({
            req,
            sourceTool: 'video-scene-analyzer.generate-video',
            input: { prompt, styleModifier, aspectRatio },
            output: payload,
            combinedOutput: videoUrl,
            outputFormats: ['url'],
            files: [
                {
                    name: 'generated-video-url.txt',
                    mimeType: 'text/plain',
                    content: videoUrl,
                    url: videoUrl,
                },
            ],
        });
        res.json(payload);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Video Scene Analyzer video generation error:', message);
        res.status(500).json({ error: 'Failed to generate video', details: message });
    }
});
export const videoSceneAnalyzerRoutes = router;
//# sourceMappingURL=videoSceneAnalyzer.routes.js.map