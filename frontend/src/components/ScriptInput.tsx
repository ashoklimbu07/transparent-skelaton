import type { BrollStyle } from '../hooks/useBrollGenerator';

interface ScriptInputProps {
  script: string;
  setScript: (value: string) => void;
  formattedScript: string;
  brollPromptsJson: string;
  brollPromptsPlain: string;
  onFormat: () => void;
  onGenerateClick: () => void;
  onGenerateBroll: () => void;
  isFormatting: boolean;
  isGenerating: boolean;
  showFormattedOutput: boolean;
  showBrollOutput: boolean;
  showStyleOptions: boolean;
  selectedStyle: BrollStyle;
  setSelectedStyle: (style: BrollStyle) => void;
  error: string | null;
  showConfirmDialog: boolean;
  confirmFormat: () => void;
  cancelFormat: () => void;
  showClearDialog: boolean;
  onClear: () => void;
  confirmClear: () => void;
  cancelClear: () => void;
}

export const ScriptInput = ({
  script,
  setScript,
  formattedScript,
  brollPromptsJson,
  brollPromptsPlain,
  onFormat,
  onGenerateClick,
  onGenerateBroll,
  isFormatting,
  isGenerating,
  showFormattedOutput,
  showBrollOutput,
  showStyleOptions,
  selectedStyle,
  setSelectedStyle,
  error,
  showConfirmDialog,
  confirmFormat,
  cancelFormat,
  showClearDialog,
  onClear,
  confirmClear,
  cancelClear,
}: ScriptInputProps) => {
  // Download functions
  const downloadJSON = () => {
    try {
      const parsed = JSON.parse(formattedScript);
      const jsonString = JSON.stringify(parsed, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-script.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      // If not JSON, download as is
      const blob = new Blob([formattedScript], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-script.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const downloadTXT = () => {
    try {
      const parsed = JSON.parse(formattedScript);
      const scenes = Object.entries(parsed)
        .sort(([a], [b]) => {
          const numA = parseInt(a.replace('scene_', ''));
          const numB = parseInt(b.replace('scene_', ''));
          return numA - numB;
        })
        .filter(([_, value]) => value && value.trim())
        .map(([_, value]) => value as string)
        .join('\n\n');
      
      const blob = new Blob([scenes], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-script.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      // If not JSON, download as is
      const blob = new Blob([formattedScript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-script.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // B-roll download functions
  const downloadBrollJSON = () => {
    // Download JSON format (JSON objects separated by blank lines)
    const blob = new Blob([brollPromptsJson], { type: 'text/plain' });
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
    const blob = new Blob([brollPromptsPlain], { type: 'text/plain' });
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
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                disabled={isFormatting}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer ${
                  isFormatting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload TXT
              </label>
            </div>
            {(script || formattedScript) && (
              <button
                type="button"
                onClick={onClear}
                disabled={isFormatting || isGenerating}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 transition-all duration-200 ${
                  isFormatting || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
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
          disabled={isFormatting}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in duration-300">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Action Buttons on Same Level */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onFormat}
          disabled={!script.trim() || isFormatting}
          className="flex-1 flex justify-center py-3 px-4 border border-slate-200 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFormatting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Formatting...
            </span>
          ) : (
            'Format Script'
          )}
        </button>
        
        <button
          type="button"
          onClick={onGenerateClick}
          disabled={!script.trim() || isFormatting}
          className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate B-Roll
        </button>
      </div>

      {/* Container for both outputs side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Formatted Output (left/first column) */}
        {showFormattedOutput && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl h-full">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                ✓ Formatted Output
              </h3>
              {(() => {
                try {
                  // Try to parse as JSON
                  const parsed = JSON.parse(formattedScript);
                  if (typeof parsed === 'object' && parsed !== null) {
                    const scenes = Object.entries(parsed)
                      .sort(([a], [b]) => {
                        const numA = parseInt(a.replace('scene_', ''));
                        const numB = parseInt(b.replace('scene_', ''));
                        return numA - numB;
                      })
                      .filter(([_, value]) => value && value.trim());
                    
                    return (
                      <div className="space-y-4">
                        {/* Completion Message */}
                        <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-emerald-800 mb-1">
                            ✓ Formatting completed!
                          </p>
                          <p className="text-xs text-emerald-700">
                            {scenes.length} scenes generated. Download in JSON or TXT format.
                          </p>
                        </div>

                        {/* Download Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={downloadJSON}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download JSON
                          </button>
                          <button
                            type="button"
                            onClick={downloadTXT}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download TXT
                          </button>
                        </div>
                      </div>
                    );
                  }
                } catch (e) {
                  // Not JSON, display as plain text with download options
                  return (
                    <div className="space-y-4">
                      <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-amber-800 mb-1">
                          ⚠️ Formatting completed (Plain text)
                        </p>
                        <p className="text-xs text-amber-700">
                          Response is not in JSON format. You can still download it.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={downloadJSON}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download JSON
                        </button>
                        <button
                          type="button"
                          onClick={downloadTXT}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download TXT
                        </button>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}

        {/* Style Options (right/second column) */}
        {showStyleOptions && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
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
                  <div className="font-bold text-slate-900 text-xs">2D Animation</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Classic hand-drawn style</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate B-Roll Button (appears below both outputs when style is selected) */}
      {showStyleOptions && selectedStyle && !showBrollOutput && (
        <button
          type="button"
          onClick={onGenerateBroll}
          disabled={isGenerating}
          className={`w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            isGenerating
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating B-Roll Prompts...
            </span>
          ) : (
            'Generate B-Roll'
          )}
        </button>
      )}

      {/* B-roll Output Section */}
      {showBrollOutput && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-3">
              ✓ B-Roll Prompts Generated
            </h3>
            {(() => {
              // Count only top-level B-roll scenes (those with scene_id)
              // Split by double newlines and count valid JSON objects with scene_id
              const sceneBlocks = brollPromptsJson.split('\n\n').filter(block => block.trim());
              let sceneCount = 0;
              
              sceneBlocks.forEach(block => {
                try {
                  const parsed = JSON.parse(block);
                  // Only count if it has scene_id (top-level scene object)
                  if (parsed.scene_id !== undefined) {
                    sceneCount++;
                  }
                } catch (e) {
                  // Skip invalid JSON blocks
                }
              });
              
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

      {/* Format Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Format New Script?</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-2">
              You already have a formatted output. Formatting a new script will replace the current output.
            </p>
            <p className="text-xs text-amber-600 mb-6 font-medium">
              ⚠️ Make sure to download the current formatted output before proceeding!
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelFormat}
                className="flex-1 py-2.5 px-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmFormat}
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Yes, Format New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
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
