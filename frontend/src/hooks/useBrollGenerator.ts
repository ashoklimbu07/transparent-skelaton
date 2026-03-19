import { useState, useRef } from 'react';
import type { BrollStyle } from './broll/brollTypes';
import { STORAGE_KEYS } from './broll/brollStorageKeys';
import { useBrollGeneratorEffects } from './broll/useBrollGenerator.effects';
import {
  cancelGenerateBrollImpl,
  dismissComingSoonImpl,
  handleGenerateBrollImpl,
  handleGenerateClickImpl,
} from './broll/useBrollGenerator.generate.actions';
import { onScriptChangeImpl } from './broll/useBrollGenerator.script.actions';
import {
  cancelClearImpl,
  cancelDeleteBrollImpl,
  confirmClearImpl,
  confirmDeleteBrollImpl,
  handleClearClickImpl,
  handleDeleteBrollClickImpl,
} from './broll/useBrollGenerator.storage.actions';

export type { BrollStyle } from './broll/brollTypes';

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
  const [totalScenes, setTotalScenes] = useState(0);
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
  useBrollGeneratorEffects({
    script,
    brollPromptsJson,
    brollPromptsPlain,
    showBrollOutput,
    selectedStyle,
    setShowComingSoon,
  });

  const handleGenerateClick = () => {
    handleGenerateClickImpl({ script, setError, setShowStyleOptions });
  };

  const handleGenerateBroll = async () => {
    await handleGenerateBrollImpl({
      script,
      selectedStyle,
      brollAbortRef,
      setIsGenerating,
      setError,
      setShowBrollOutput: setShowBrollOutputState,
      setBrollPromptsJson: setBrollPromptsJsonState,
      setBrollPromptsPlain: setBrollPromptsPlainState,
      setTotalScenes,
      setShowComingSoon,
    });
  };

  const cancelGenerateBroll = () => {
    cancelGenerateBrollImpl({ brollAbortRef });
  };

  const dismissComingSoon = () => {
    dismissComingSoonImpl({ setShowComingSoon });
  };

  const onScriptChange = (value: string) => {
    onScriptChangeImpl({ value, setScriptState, setError });
  };

  // Show clear confirmation dialog
  const handleClearClick = () => {
    handleClearClickImpl({ setShowClearDialog });
  };

  // Clear all data function (called after confirmation)
  const confirmClear = () => {
    confirmClearImpl({
      setScriptState,
      setBrollPromptsJsonState,
      setBrollPromptsPlainState,
      setShowBrollOutputState,
      setShowStyleOptions,
      setSelectedStyle,
      setShowComingSoon,
      setError,
      setShowClearDialog,
      setTotalScenes,
    });
  };

  // Cancel clear action
  const cancelClear = () => {
    cancelClearImpl({ setShowClearDialog });
  };

  // Delete B-Roll: show confirmation dialog
  const handleDeleteBrollClick = () => {
    handleDeleteBrollClickImpl({ setShowDeleteBrollDialog });
  };

  // Delete B-Roll: confirm and clear B-Roll output so user can generate again
  const confirmDeleteBroll = () => {
    confirmDeleteBrollImpl({
      setBrollPromptsJsonState,
      setBrollPromptsPlainState,
      setShowBrollOutputState,
      setShowComingSoonState: setShowComingSoon,
      setShowDeleteBrollDialog,
      setError,
      setTotalScenes,
    });
  };

  const cancelDeleteBroll = () => {
    cancelDeleteBrollImpl({ setShowDeleteBrollDialog });
  };

  return {
    script,
    setScript: onScriptChange,
    brollPromptsJson,
    brollPromptsPlain,
    totalScenes,
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
