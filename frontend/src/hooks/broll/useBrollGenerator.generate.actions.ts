import { apiService } from '../../services/api.service';
import type { BrollStyle } from './brollTypes';
import { getScriptLengthError } from './validateScriptLength';

type AbortRef = { current: AbortController | null };
type BooleanRef = { current: boolean };

export function handleGenerateClickImpl(args: {
  script: string;
  setError: (value: string | null) => void;
  setShowStyleOptions: (value: boolean) => void;
}) {
  const { script, setError, setShowStyleOptions } = args;

  const trimmed = script.trim();
  const length = trimmed.length;

  if (!length) {
    setError('Please enter a script first');
    return;
  }

  const error = getScriptLengthError(length);
  if (error) {
    setError(error);
    return;
  }

  setError(null);
  setShowStyleOptions(true);
}

export async function handleGenerateBrollImpl(args: {
  script: string;
  selectedStyle: BrollStyle;
  desiredScenes: number | null;
  brollAbortRef: AbortRef;
  cancelRequestedRef: BooleanRef;
  setIsGenerating: (value: boolean) => void;
  setError: (value: string | null) => void;
  setShowBrollOutput: (value: boolean) => void;
  setBrollPromptsJson: (value: string) => void;
  setBrollPromptsPlain: (value: string) => void;
  setTotalScenes: (value: number) => void;
  setShowComingSoon: (value: boolean) => void;
}) {
  const {
    script,
    selectedStyle,
    desiredScenes,
    brollAbortRef,
    cancelRequestedRef,
    setIsGenerating,
    setError,
    setShowBrollOutput,
    setBrollPromptsJson,
    setBrollPromptsPlain,
    setTotalScenes,
    setShowComingSoon,
  } = args;

  if (!selectedStyle) {
    setError('Please select a style first');
    return;
  }

  // 2D Animation / hand-drawn style is not implemented yet — show Coming Soon
  if (selectedStyle === '2d_animation') {
    setError(null);
    setShowComingSoon(true);
    return;
  }

  const trimmed = script.trim();
  const length = trimmed.length;

  if (!length) {
    setError('Please enter a script first');
    return;
  }

  const error = getScriptLengthError(length);
  if (error) {
    setError(error);
    return;
  }

  if (desiredScenes === null || Number.isNaN(desiredScenes)) {
    setError('Please enter scene number');
    return;
  }

  if (desiredScenes < 25 || desiredScenes > 35) {
    setError('Scene number must be between 25 and 35');
    return;
  }

  setIsGenerating(true);
  setError(null);
  setShowBrollOutput(false);
  setBrollPromptsJson('');
  setBrollPromptsPlain('');
  setTotalScenes(0);

  const controller = new AbortController();
  brollAbortRef.current = controller;
  cancelRequestedRef.current = false;

  try {
    console.log(`🎬 Generating ${selectedStyle} B-roll from script...`);
    const result = await apiService.generateBroll(script, selectedStyle, desiredScenes, controller.signal);

    // Frontend-only cancel guard: ignore late results after user clicked cancel.
    if (cancelRequestedRef.current || controller.signal.aborted) {
      console.log('🛑 Frontend: ignored response after user cancelled');
      return;
    }

    setBrollPromptsJson(result.promptsJson);
    setBrollPromptsPlain(result.promptsPlain);
    setTotalScenes(result.totalScenes ?? 0);
    setShowBrollOutput(true);

    console.log(`✅ B-roll generation complete! ${result.totalScenes} prompts generated`);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      if (!cancelRequestedRef.current) {
        setError(null);
      }
      console.log('B-roll generation cancelled');
    } else {
      setError(err instanceof Error ? err.message : 'Failed to generate B-roll');
      console.error('B-roll generation error:', err);
    }
  } finally {
    setIsGenerating(false);
    brollAbortRef.current = null;
  }
}

export function cancelGenerateBrollImpl(args: {
  brollAbortRef: AbortRef;
  cancelRequestedRef: BooleanRef;
  setError: (value: string | null) => void;
}) {
  const { brollAbortRef, cancelRequestedRef, setError } = args;
  cancelRequestedRef.current = true;
  setError('B-roll generation cancelled.');
  console.log('🛑 Frontend: user clicked cancel');
  brollAbortRef.current?.abort();
}

export function dismissComingSoonImpl(args: {
  setShowComingSoon: (value: boolean) => void;
}) {
  args.setShowComingSoon(false);
}

