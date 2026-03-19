import { STORAGE_KEYS } from './brollStorageKeys';
import type { BrollStyle } from './brollTypes';

function clearLocalStorageItems(keys: string[]) {
  if (typeof window === 'undefined') return;
  for (const key of keys) localStorage.removeItem(key);
}

export function handleClearClickImpl(args: {
  setShowClearDialog: (value: boolean) => void;
}) {
  args.setShowClearDialog(true);
}

export function confirmClearImpl(args: {
  setScriptState: (value: string) => void;
  setBrollPromptsJsonState: (value: string) => void;
  setBrollPromptsPlainState: (value: string) => void;
  setShowBrollOutputState: (value: boolean) => void;
  setShowStyleOptions: (value: boolean) => void;
  setSelectedStyle: (value: BrollStyle) => void;
  setShowComingSoon: (value: boolean) => void;
  setError: (value: string | null) => void;
  setShowClearDialog: (value: boolean) => void;
  setTotalScenes: (value: number) => void;
}) {
  const {
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
  } = args;

  setScriptState('');
  setBrollPromptsJsonState('');
  setBrollPromptsPlainState('');
  setShowBrollOutputState(false);
  setShowStyleOptions(false);
  setSelectedStyle('');
  setShowComingSoon(false);
  setError(null);
  setShowClearDialog(false);
  setTotalScenes(0);

  clearLocalStorageItems([
    STORAGE_KEYS.script,
    STORAGE_KEYS.brollPromptsJson,
    STORAGE_KEYS.brollPromptsPlain,
    STORAGE_KEYS.showBrollOutput,
  ]);
}

export function cancelClearImpl(args: {
  setShowClearDialog: (value: boolean) => void;
}) {
  args.setShowClearDialog(false);
}

export function handleDeleteBrollClickImpl(args: {
  setShowDeleteBrollDialog: (value: boolean) => void;
}) {
  args.setShowDeleteBrollDialog(true);
}

export function confirmDeleteBrollImpl(args: {
  setBrollPromptsJsonState: (value: string) => void;
  setBrollPromptsPlainState: (value: string) => void;
  setShowBrollOutputState: (value: boolean) => void;
  setShowComingSoonState: (value: boolean) => void;
  setShowDeleteBrollDialog: (value: boolean) => void;
  setError: (value: string | null) => void;
  setTotalScenes: (value: number) => void;
}) {
  const {
    setBrollPromptsJsonState,
    setBrollPromptsPlainState,
    setShowBrollOutputState,
    setShowComingSoonState,
    setShowDeleteBrollDialog,
    setError,
    setTotalScenes,
  } = args;

  setBrollPromptsJsonState('');
  setBrollPromptsPlainState('');
  setShowBrollOutputState(false);
  setShowComingSoonState(false);
  setShowDeleteBrollDialog(false);
  setError(null);
  setTotalScenes(0);

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.brollPromptsJson);
    localStorage.removeItem(STORAGE_KEYS.brollPromptsPlain);
    localStorage.setItem(STORAGE_KEYS.showBrollOutput, 'false');
  }
}

export function cancelDeleteBrollImpl(args: {
  setShowDeleteBrollDialog: (value: boolean) => void;
}) {
  args.setShowDeleteBrollDialog(false);
}

