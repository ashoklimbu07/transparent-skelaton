import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api.service';

export type BrollStyle = 'transparent_skeleton' | '2d_animation' | '';

const STORAGE_KEYS = {
  script: 'broll_script',
  brollPromptsJson: 'broll_prompts_json',
  brollPromptsPlain: 'broll_prompts_plain',
  showBrollOutput: 'broll_show_output',
};

export const useBrollGenerator = () => {
  // Load from localStorage on mount
  const [script, setScriptState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.script) || '';
    }
    return '';
  });
  
  const [brollPromptsJson, setBrollPromptsJsonState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.brollPromptsJson);
      return stored || '';
    }
    return '';
  });

  const [brollPromptsPlain, setBrollPromptsPlainState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.brollPromptsPlain);
      return stored || '';
    }
    return '';
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBrollOutput, setShowBrollOutputState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.showBrollOutput) === 'true';
    }
    return false;
  });
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<BrollStyle>('');
  const [error, setError] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteBrollDialog, setShowDeleteBrollDialog] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const brollAbortRef = useRef<AbortController | null>(null);

  // Save to localStorage whenever script changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (script) {
        localStorage.setItem(STORAGE_KEYS.script, script);
      } else {
        localStorage.removeItem(STORAGE_KEYS.script);
      }
    }
  }, [script]);

  // Save brollPromptsJson to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (brollPromptsJson) {
        localStorage.setItem(STORAGE_KEYS.brollPromptsJson, brollPromptsJson);
      } else {
        localStorage.removeItem(STORAGE_KEYS.brollPromptsJson);
      }
    }
  }, [brollPromptsJson]);

  // Save brollPromptsPlain to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (brollPromptsPlain) {
        localStorage.setItem(STORAGE_KEYS.brollPromptsPlain, brollPromptsPlain);
      } else {
        localStorage.removeItem(STORAGE_KEYS.brollPromptsPlain);
      }
    }
  }, [brollPromptsPlain]);

  // Save showBrollOutput to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.showBrollOutput, showBrollOutput.toString());
    }
  }, [showBrollOutput]);

  // Dismiss "Coming soon" when user switches to a supported style
  useEffect(() => {
    if (selectedStyle && selectedStyle !== '2d_animation') {
      setShowComingSoon(false);
    }
  }, [selectedStyle]);

  // Wrapper functions to update state
  const setScript = (value: string) => {
    setScriptState(value);
  };

  const setBrollPromptsJson = (value: string) => {
    setBrollPromptsJsonState(value);
  };

  const setBrollPromptsPlain = (value: string) => {
    setBrollPromptsPlainState(value);
  };

  const setShowBrollOutput = (value: boolean) => {
    setShowBrollOutputState(value);
  };

  const handleGenerateClick = () => {
    const trimmed = script.trim();
    const length = trimmed.length;

    if (!length) {
      setError('Please enter a script first');
      return;
    }

    if (length < 1000 || length > 1500) {
      setError(
        `Your script must be between 1000 and 1500 characters. Current length: ${length}.`,
      );
      return;
    }

    setError(null);
    setShowStyleOptions(true);
  };

  const handleGenerateBroll = async () => {
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

    if (length < 1000 || length > 1500) {
      setError(
        `Your script must be between 1000 and 1500 characters. Current length: ${length}.`,
      );
      return;
    }

    setIsGenerating(true);
    setError(null);
    setShowBrollOutput(false);
    setBrollPromptsJson('');
    setBrollPromptsPlain('');

    const controller = new AbortController();
    brollAbortRef.current = controller;

    try {
      console.log(`🎬 Generating ${selectedStyle} B-roll from script...`);

      const result = await apiService.generateBroll(script, selectedStyle, controller.signal);

      setBrollPromptsJson(result.promptsJson);
      setBrollPromptsPlain(result.promptsPlain);
      setShowBrollOutput(true);

      console.log(`✅ B-roll generation complete! ${result.totalScenes} prompts generated`);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError(null);
        console.log('B-roll generation cancelled');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate B-roll');
        console.error('B-roll generation error:', err);
      }
    } finally {
      setIsGenerating(false);
      brollAbortRef.current = null;
    }
  };

  const cancelGenerateBroll = () => {
    if (brollAbortRef.current) {
      brollAbortRef.current.abort();
    }
  };

  const dismissComingSoon = () => {
    setShowComingSoon(false);
  };

  const onScriptChange = (value: string) => {
    setScript(value);

    const trimmed = value.trim();
    const length = trimmed.length;

    if (!length) {
      setError(null);
      return;
    }

    if (length < 1000 || length > 1500) {
      setError(
        `Your script must be between 1000 and 1500 characters. Current length: ${length}.`,
      );
    } else {
      setError(null);
    }
  };

  // Show clear confirmation dialog
  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  // Clear all data function (called after confirmation)
  const confirmClear = () => {
    setScript('');
    setBrollPromptsJson('');
    setBrollPromptsPlain('');
    setShowBrollOutput(false);
    setShowStyleOptions(false);
    setSelectedStyle('');
    setShowComingSoon(false);
    setError(null);
    setShowClearDialog(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.script);
      localStorage.removeItem(STORAGE_KEYS.brollPromptsJson);
      localStorage.removeItem(STORAGE_KEYS.brollPromptsPlain);
      localStorage.removeItem(STORAGE_KEYS.showBrollOutput);
    }
  };

  // Cancel clear action
  const cancelClear = () => {
    setShowClearDialog(false);
  };

  // Delete B-Roll: show confirmation dialog
  const handleDeleteBrollClick = () => {
    setShowDeleteBrollDialog(true);
  };

  // Delete B-Roll: confirm and clear B-Roll output so user can generate again
  const confirmDeleteBroll = () => {
    setBrollPromptsJson('');
    setBrollPromptsPlain('');
    setShowBrollOutput(false);
    setShowComingSoon(false);
    setShowDeleteBrollDialog(false);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.brollPromptsJson);
      localStorage.removeItem(STORAGE_KEYS.brollPromptsPlain);
      localStorage.setItem(STORAGE_KEYS.showBrollOutput, 'false');
    }
  };

  const cancelDeleteBroll = () => {
    setShowDeleteBrollDialog(false);
  };

  return {
    script,
    setScript: onScriptChange,
    brollPromptsJson,
    brollPromptsPlain,
    isGenerating,
    showBrollOutput,
    showStyleOptions,
    selectedStyle,
    setSelectedStyle,
    error,
    handleGenerateClick,
    handleGenerateBroll,
    cancelGenerateBroll,
    showClearDialog,
    handleClearClick,
    confirmClear,
    cancelClear,
    showDeleteBrollDialog,
    handleDeleteBrollClick,
    confirmDeleteBroll,
    cancelDeleteBroll,
    showComingSoon,
    dismissComingSoon,
  };
};
