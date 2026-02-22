import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

export type BrollStyle = 'transparent_skeleton' | '2d_animation' | '';

const STORAGE_KEYS = {
  script: 'broll_script',
  formattedScript: 'broll_formatted_script',
  showFormattedOutput: 'broll_show_formatted_output',
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
  
  const [formattedScript, setFormattedScriptState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.formattedScript) || '';
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
  
  const [isFormatting, setIsFormatting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFormattedOutput, setShowFormattedOutputState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.showFormattedOutput) === 'true';
    }
    return false;
  });
  const [showBrollOutput, setShowBrollOutputState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.showBrollOutput) === 'true';
    }
    return false;
  });
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<BrollStyle>('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [pendingFormat, setPendingFormat] = useState(false);

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

  // Save formattedScript to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (formattedScript) {
        localStorage.setItem(STORAGE_KEYS.formattedScript, formattedScript);
      } else {
        localStorage.removeItem(STORAGE_KEYS.formattedScript);
      }
    }
  }, [formattedScript]);

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

  // Save showFormattedOutput to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.showFormattedOutput, showFormattedOutput.toString());
    }
  }, [showFormattedOutput]);

  // Save showBrollOutput to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.showBrollOutput, showBrollOutput.toString());
    }
  }, [showBrollOutput]);

  // Wrapper functions to update state
  const setScript = (value: string) => {
    setScriptState(value);
  };

  const setFormattedScript = (value: string) => {
    setFormattedScriptState(value);
  };

  const setShowFormattedOutput = (value: boolean) => {
    setShowFormattedOutputState(value);
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

  const performFormat = async () => {
    if (!script.trim()) return;
    
    setIsFormatting(true);
    setError(null);
    
    // Clear old output before formatting new one
    setShowFormattedOutput(false);
    setFormattedScript('');
    
    try {
      const formatted = await apiService.formatScript(script);
      setFormattedScript(formatted);
      setShowFormattedOutput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format script');
      console.error('Format error:', err);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleFormat = async () => {
    if (!script.trim()) return;
    
    // If there's already formatted output, show confirmation dialog
    if (showFormattedOutput && formattedScript.trim()) {
      setShowConfirmDialog(true);
      setPendingFormat(true);
      return;
    }
    
    // Otherwise, format directly
    await performFormat();
  };

  const confirmFormat = async () => {
    setShowConfirmDialog(false);
    setPendingFormat(false);
    await performFormat();
  };

  const cancelFormat = () => {
    setShowConfirmDialog(false);
    setPendingFormat(false);
  };

  const handleGenerateClick = () => {
    if (!script.trim()) return;
    setShowStyleOptions(true);
  };

  const handleGenerateBroll = async () => {
    if (!selectedStyle) {
      setError('Please select a style first');
      return;
    }

    // First, ensure we have formatted script
    if (!formattedScript.trim()) {
      setError('Please format the script first before generating B-roll');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setShowBrollOutput(false);
    setBrollPromptsJson('');
    setBrollPromptsPlain('');

    try {
      // Parse formatted script to get scenes
      const scenes = JSON.parse(formattedScript);
      
      console.log(`🎬 Generating ${selectedStyle} B-roll for ${Object.keys(scenes).length} scenes...`);

      // Call API to generate B-roll
      const result = await apiService.generateBroll(scenes, selectedStyle);

      // Store both formats
      setBrollPromptsJson(result.promptsJson);
      setBrollPromptsPlain(result.promptsPlain);
      setShowBrollOutput(true);

      console.log(`✅ B-roll generation complete! ${result.totalScenes} prompts generated`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate B-roll');
      console.error('B-roll generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const onScriptChange = (value: string) => {
    setScript(value);
    setError(null);
  };

  // Show clear confirmation dialog
  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  // Clear all data function (called after confirmation)
  const confirmClear = () => {
    setScript('');
    setFormattedScript('');
    setBrollPromptsJson('');
    setBrollPromptsPlain('');
    setShowFormattedOutput(false);
    setShowBrollOutput(false);
    setShowStyleOptions(false);
    setSelectedStyle('');
    setError(null);
    setShowConfirmDialog(false);
    setShowClearDialog(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.script);
      localStorage.removeItem(STORAGE_KEYS.formattedScript);
      localStorage.removeItem(STORAGE_KEYS.brollPromptsJson);
      localStorage.removeItem(STORAGE_KEYS.brollPromptsPlain);
      localStorage.removeItem(STORAGE_KEYS.showFormattedOutput);
      localStorage.removeItem(STORAGE_KEYS.showBrollOutput);
    }
  };

  // Cancel clear action
  const cancelClear = () => {
    setShowClearDialog(false);
  };

  return {
    script,
    setScript: onScriptChange,
    formattedScript,
    brollPromptsJson,
    brollPromptsPlain,
    isFormatting,
    isGenerating,
    showFormattedOutput,
    showBrollOutput,
    showStyleOptions,
    selectedStyle,
    setSelectedStyle,
    error,
    handleFormat,
    handleGenerateClick,
    handleGenerateBroll,
    showConfirmDialog,
    confirmFormat,
    cancelFormat,
    showClearDialog,
    handleClearClick,
    confirmClear,
    cancelClear,
  };
};
