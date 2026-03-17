import { Router } from 'express';
import type { Request, Response } from 'express';
import { brollService } from '../services/broll.service.js';

const router = Router();

// POST /api/broll/generate - Generate B-roll prompts from a raw script
router.post('/generate', async (req: Request, res: Response) => {
  const abortController = new AbortController();
  const { signal } = abortController;

  // Stop processing only when client explicitly aborts (e.g. user clicked Cancel).
  // Use only 'aborted'; 'close' can fire in other cases and would cancel the request incorrectly.
  req.on('aborted', () => {
    abortController.abort();
  });

  try {
    const { script, style } = req.body;

    if (!script || typeof script !== 'string' || script.trim().length === 0) {
      res.status(400).json({ error: 'Script is required and must be a non-empty string' });
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
    console.log(`📝 Script length: ${script.length}`);

    const brollPrompts = await brollService.generateBrollPromptsFromScript(script, signal);

    // Count scenes from the text output
    const sceneCount = (brollPrompts.plainText.match(/Scene \d+:/g) || []).length;

    res.json({
      success: true,
      style,
      promptsJson: brollPrompts.jsonText,
      promptsPlain: brollPrompts.plainText,
      totalScenes: sceneCount
    });
  } catch (error) {
    if (signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
      console.log('🛑 B-roll generation cancelled by client');
      try {
        res.status(499).json({ error: 'Cancelled' });
      } catch {
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
