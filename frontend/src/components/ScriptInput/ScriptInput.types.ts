import type { BrollStyle } from '../../hooks/useBrollGenerator';

export interface ScriptInputProps {
  script: string;
  setScript: (value: string) => void;
  brollPromptsJson: string;
  brollPromptsPlain: string;
  totalScenes: number;
  onGenerateClick: () => void;
  onGenerateBroll: () => void;
  onCancelGenerateBroll: () => void;
  isGenerating: boolean;
  showBrollOutput: boolean;
  showStyleOptions: boolean;
  selectedStyle: BrollStyle;
  setSelectedStyle: (style: BrollStyle) => void;
  error: string | null;
  showClearDialog: boolean;
  onClear: () => void;
  confirmClear: () => void;
  cancelClear: () => void;
  showDeleteBrollDialog: boolean;
  onDeleteBroll: () => void;
  confirmDeleteBroll: () => void;
  cancelDeleteBroll: () => void;
  showComingSoon: boolean;
  onDismissComingSoon: () => void;
}

