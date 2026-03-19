import { useEffect } from 'react';
import { STORAGE_KEYS } from './brollStorageKeys';
import type { BrollStyle } from './brollTypes';

export function useBrollGeneratorEffects(args: {
  script: string;
  brollPromptsJson: string;
  brollPromptsPlain: string;
  showBrollOutput: boolean;
  selectedStyle: BrollStyle;
  setShowComingSoon: (value: boolean) => void;
}) {
  const {
    script,
    brollPromptsJson,
    brollPromptsPlain,
    showBrollOutput,
    selectedStyle,
    setShowComingSoon,
  } = args;

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
  }, [selectedStyle, setShowComingSoon]);
}

