import { Router } from 'express';
import type { Request, Response } from 'express';
import { videoSceneAnalyzerService } from '../services/videoSceneAnalyzer.service.js';

const router = Router();

router.post('/analyze-script', async (req: Request, res: Response) => {
  try {
    const script = typeof req.body?.script === 'string' ? req.body.script.trim() : '';
    if (!script) {
      res.status(400).json({ error: 'script is required and must be a non-empty string' });
      return;
    }

    const scenes = await videoSceneAnalyzerService.analyzeScript(script);
    res.json({ scenes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Video Scene Analyzer script analysis error:', message);
    res.status(500).json({ error: 'Failed to analyze script', details: message });
  }
});

router.post('/analyze-video', async (req: Request, res: Response) => {
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
    res.json({ scenes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Video Scene Analyzer video analysis error:', message);
    res.status(500).json({ error: 'Failed to analyze video', details: message });
  }
});

router.post('/regenerate-visual-prompt', async (req: Request, res: Response) => {
  try {
    const segmentText = typeof req.body?.segmentText === 'string' ? req.body.segmentText.trim() : '';
    if (!segmentText) {
      res.status(400).json({ error: 'segmentText is required' });
      return;
    }

    const visualPrompt = await videoSceneAnalyzerService.regenerateVisualPrompt(segmentText);
    res.json({ visualPrompt });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Video Scene Analyzer prompt regeneration error:', message);
    res.status(500).json({ error: 'Failed to regenerate visual prompt', details: message });
  }
});

router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
    const styleModifier = typeof req.body?.styleModifier === 'string' ? req.body.styleModifier : '';
    const aspectRatio = typeof req.body?.aspectRatio === 'string' ? req.body.aspectRatio : '';
    if (!prompt.trim() || !styleModifier.trim() || !aspectRatio.trim()) {
      res.status(400).json({ error: 'prompt, styleModifier and aspectRatio are required' });
      return;
    }

    const imageUrl = await videoSceneAnalyzerService.generateImage(prompt, styleModifier, aspectRatio);
    res.json({ imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Video Scene Analyzer image generation error:', message);
    res.status(500).json({ error: 'Failed to generate image', details: message });
  }
});

router.post('/generate-video', async (req: Request, res: Response) => {
  try {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
    const styleModifier = typeof req.body?.styleModifier === 'string' ? req.body.styleModifier : '';
    const aspectRatio = typeof req.body?.aspectRatio === 'string' ? req.body.aspectRatio : '';
    if (!prompt.trim() || !styleModifier.trim() || !aspectRatio.trim()) {
      res.status(400).json({ error: 'prompt, styleModifier and aspectRatio are required' });
      return;
    }

    const videoUrl = await videoSceneAnalyzerService.generateVideo(prompt, styleModifier, aspectRatio);
    res.json({ videoUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Video Scene Analyzer video generation error:', message);
    res.status(500).json({ error: 'Failed to generate video', details: message });
  }
});

export const videoSceneAnalyzerRoutes = router;
