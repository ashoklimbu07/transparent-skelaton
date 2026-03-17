import type { ChangeEvent } from 'react';
import type { BrollStyle } from '../hooks/useBrollGenerator';

interface ScriptInputProps {
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

  // B-roll download functions
  const normalizePromptText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n') // normalize newlines
      .trim()
      // collapse any run of 3+ newlines to exactly 2 (one blank line gap)
      .replace(/\n{3,}/g, '\n\n');
  };

  const downloadBrollJSON = () => {
    // Download JSON-ish format (prompts separated by a single blank line)
    const normalizedText = normalizePromptText(brollPromptsJson || brollPromptsPlain);
    const blob = new Blob([normalizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broll-prompts-json.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadBrollPlainText = () => {
    // Download plain text format (human-readable)
    // Normalize line breaks so each prompt block is separated by exactly one blank line
    const normalizedText = normalizePromptText(brollPromptsPlain || brollPromptsJson);
    const blob = new Blob([normalizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broll-prompts-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // File upload handler
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a text file
    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt')) {
      alert('Please upload a text file (.txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setScript(content);
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Script Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="script" className="block text-sm font-medium text-slate-700">
            Enter your script
          </label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                accept=".txt,text/plain"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isGenerating}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload TXT
              </label>
            </div>
            {(script || showBrollOutput) && (
              <button
                type="button"
                onClick={onClear}
                disabled={isGenerating}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 transition-all duration-200 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Clear all content"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          id="script"
          name="script"
          rows={6}
          className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-900 resize-none"
          placeholder="Once upon a time in a city made of glass... or upload a .txt file"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          disabled={isGenerating}
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>
            {isScriptLengthInvalid
              ? 'Script must be between 1000 and 1500 characters.'
              : 'Ideal length: 1000–1500 characters.'}
          </span>
          <span className={isScriptLengthInvalid ? 'text-red-600 font-semibold' : ''}>
            {trimmedLength} chars
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in duration-300">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Primary Generate Button (single entry point) */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={
            isGenerating
              ? undefined
              : !showStyleOptions
                ? onGenerateClick
                : selectedStyle && !showBrollOutput && !showComingSoon
                  ? onGenerateBroll
                  : undefined
          }
          disabled={
            isGenerating ||
            !script.trim() ||
            isScriptLengthInvalid ||
            (showStyleOptions && !selectedStyle) ||
            showComingSoon
          }
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            isGenerating
              ? 'bg-slate-300 shadow-none cursor-not-allowed'
              : !showStyleOptions
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                : selectedStyle && !showBrollOutput && !showComingSoon
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                  : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating B-Roll Prompts...
            </span>
          ) : (
            'Generate B-Roll'
          )}
        </button>
      </div>

      {/* Style Options */}
      {showStyleOptions && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
              Select Style
            </h3>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedStyle('transparent_skeleton')}
                disabled={isGenerating}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedStyle === 'transparent_skeleton'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-bold text-slate-900 text-xs">Transparent Skeleton</div>
                <div className="text-[10px] text-slate-500 mt-0.5">X-ray style 3D visuals</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStyle('2d_animation')}
                disabled={isGenerating}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedStyle === '2d_animation'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">2D Animation</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Coming soon</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Classic hand-drawn style</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon — when 2D Animation / hand-drawn is selected and user clicked Generate B-Roll */}
      {showComingSoon && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">Coming soon</h3>
              <p className="text-sm text-amber-800/90 mb-1">
                2D Animation &amp; classic hand-drawn style
              </p>
              <p className="text-xs text-amber-700/80 mb-5 max-w-xs">
                We’re working on it. Use <strong>Transparent Skeleton</strong> for now to generate B-roll prompts.
              </p>
              <button
                type="button"
                onClick={onDismissComingSoon}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel button (visible only while generating) */}
      {isGenerating && showStyleOptions && selectedStyle && !showBrollOutput && !showComingSoon && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={onCancelGenerateBroll}
              className="px-5 py-3 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all duration-200 active:scale-[0.98] bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* B-roll Output Section */}
      {showBrollOutput && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                ✓ B-Roll Prompts Generated
              </h3>
              <button
                type="button"
                onClick={onDeleteBroll}
                disabled={isGenerating}
                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-200 hover:text-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete B-Roll output"
                aria-label="Delete B-Roll output"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            {(() => {
              // Prefer backend-reported total scenes; fall back to parsing text if needed
              const sceneBlocks = (brollPromptsJson || brollPromptsPlain || '')
                .replace(/\r\n/g, '\n')
                .split(/\n{2,}/)
                .map((block) => block.trim())
                .filter(Boolean);
              const parsedCount = sceneBlocks.length;
              const sceneCount = totalScenes || parsedCount;
              
              return (
                <div className="space-y-4">
                  {/* Completion Message */}
                  <div className="bg-purple-100 border-purple-200 border rounded-lg p-3">
                    <p className="text-sm font-semibold mb-1 text-purple-800">
                      ✓ B-Roll generation completed!
                    </p>
                    <p className="text-xs text-purple-700">
                      {sceneCount} B-Roll generated
                    </p>
                  </div>

                  {/* Download Buttons - JSON and Plain Text */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={downloadBrollJSON}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download B-Roll JSON (TXT)
                    </button>
                    <button
                      type="button"
                      onClick={downloadBrollPlainText}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-purple-600 text-purple-700 hover:bg-purple-50 text-sm font-bold rounded-lg transition-all duration-200 active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download B-Roll Text (TXT)
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Delete B-Roll Confirmation Dialog */}
      {showDeleteBrollDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete B-Roll output?</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Do you want to delete the current B-Roll prompts? You can generate a new B-Roll after deleting.
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDeleteBroll}
                className="flex-1 py-2.5 px-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBroll}
                className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                OK, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clear All Content?</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-2">
              This will permanently delete all your script content, formatted output, and clear all saved data.
            </p>
            <p className="text-xs text-red-600 mb-6 font-medium">
              ⚠️ This action cannot be undone! Make sure to download any important content before clearing.
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelClear}
                className="flex-1 py-2.5 px-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClear}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
