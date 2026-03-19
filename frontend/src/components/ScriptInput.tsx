import type { ScriptInputProps } from './ScriptInput/ScriptInput.types';
import { ScriptInputEditorSection } from './ScriptInput/ScriptInputEditorSection';
import { ScriptInputGenerateButton } from './ScriptInput/ScriptInputGenerateButton';
import { ScriptInputStyleOptions } from './ScriptInput/ScriptInputStyleOptions';
import { ScriptInputComingSoon } from './ScriptInput/ScriptInputComingSoon';
import { ScriptInputCancelGenerateButton } from './ScriptInput/ScriptInputCancelGenerateButton';
import { ScriptInputBrollOutput } from './ScriptInput/ScriptInputBrollOutput';
import { ScriptInputDeleteBrollDialog } from './ScriptInput/ScriptInputDeleteBrollDialog';
import { ScriptInputClearDialog } from './ScriptInput/ScriptInputClearDialog';

export const ScriptInput = ({
  script,
  setScript,
  brollPromptsJson,
  brollPromptsPlain,
  totalScenes,
  onGenerateClick,
  onGenerateBroll,
  onCancelGenerateBroll,
  isGenerating,
  showBrollOutput,
  showStyleOptions,
  selectedStyle,
  setSelectedStyle,
  error,
  showClearDialog,
  onClear,
  confirmClear,
  cancelClear,
  showDeleteBrollDialog,
  onDeleteBroll,
  confirmDeleteBroll,
  cancelDeleteBroll,
  showComingSoon,
  onDismissComingSoon,
}: ScriptInputProps) => {
  const trimmedLength = script.trim().length;
  const isScriptLengthInvalid =
    trimmedLength > 0 && (trimmedLength < 1000 || trimmedLength > 1500);

  return (
    <div className="mt-8 space-y-6">
      {/* Script Input */}
      <ScriptInputEditorSection
        script={script}
        setScript={setScript}
        showBrollOutput={showBrollOutput}
        isGenerating={isGenerating}
        onClear={onClear}
        trimmedLength={trimmedLength}
        isScriptLengthInvalid={isScriptLengthInvalid}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in duration-300">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Primary Generate Button (single entry point) */}
      <ScriptInputGenerateButton
        isGenerating={isGenerating}
        showStyleOptions={showStyleOptions}
        selectedStyle={selectedStyle}
        showBrollOutput={showBrollOutput}
        showComingSoon={showComingSoon}
        script={script}
        isScriptLengthInvalid={isScriptLengthInvalid}
        onGenerateClick={onGenerateClick}
        onGenerateBroll={onGenerateBroll}
      />

      {/* Style Options */}
      {showStyleOptions && (
        <ScriptInputStyleOptions
          isGenerating={isGenerating}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
        />
      )}

      {/* Coming Soon — when 2D Animation / hand-drawn is selected and user clicked Generate B-Roll */}
      {showComingSoon && (
        <ScriptInputComingSoon onDismissComingSoon={onDismissComingSoon} />
      )}

      {/* Cancel button (visible only while generating) */}
      {isGenerating && showStyleOptions && selectedStyle && !showBrollOutput && !showComingSoon && (
        <ScriptInputCancelGenerateButton onCancelGenerateBroll={onCancelGenerateBroll} />
      )}

      {/* B-roll Output Section */}
      {showBrollOutput && (
        <ScriptInputBrollOutput
          isGenerating={isGenerating}
          brollPromptsJson={brollPromptsJson}
          brollPromptsPlain={brollPromptsPlain}
          totalScenes={totalScenes}
          onDeleteBroll={onDeleteBroll}
        />
      )}

      {/* Delete B-Roll Confirmation Dialog */}
      {showDeleteBrollDialog && (
        <ScriptInputDeleteBrollDialog
          onCancel={cancelDeleteBroll}
          onConfirm={confirmDeleteBroll}
        />
      )}

      {/* Clear Confirmation Dialog */}
      {showClearDialog && (
        <ScriptInputClearDialog onCancel={cancelClear} onConfirm={confirmClear} />
      )}
    </div>
  );
};
