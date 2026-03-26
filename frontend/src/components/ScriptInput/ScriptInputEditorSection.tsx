import { handleFileUpload } from './ScriptInput.helpers';

export function ScriptInputEditorSection(props: {
  script: string;
  setScript: (value: string) => void;
  showBrollOutput: boolean;
  isGenerating: boolean;
  onClear: () => void;
  trimmedLength: number;
  isScriptLengthInvalid: boolean;
}) {
  const {
    script,
    setScript,
    showBrollOutput,
    isGenerating,
    onClear,
    trimmedLength,
    isScriptLengthInvalid,
  } = props;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="script" className="block text-sm font-medium text-[#f0ede8]">
          Enter your script
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              accept=".txt,text/plain"
              onChange={(e) => handleFileUpload(e, setScript)}
              className="hidden"
              disabled={isGenerating}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-[#333333] bg-[#161616] text-[#cccccc] hover:bg-[#1d1d1d] transition-all duration-200 cursor-pointer ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload TXT
            </label>
          </div>
          {(script || showBrollOutput) && (
            <button
              type="button"
              onClick={onClear}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-red-900/60 bg-[#1a1010] text-red-300 hover:bg-[#241313] transition-all duration-200 ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Clear all content"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
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
        className="appearance-none block w-full px-4 py-3 border border-[#222222] bg-[#0b0b0b] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#ff3c00]/40 focus:border-[#ff3c00] transition-all duration-200 text-[#f0ede8] resize-none"
        placeholder="Once upon a time in a city made of glass... or upload a .txt file"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        disabled={isGenerating}
      />

      <div className="mt-1 flex justify-between text-[11px] text-[#666666]">
        <span>
          {isScriptLengthInvalid
            ? 'Script must be between 1000 and 1500 characters.'
            : 'Ideal length: 1000–1500 characters.'}
        </span>
        <span className={isScriptLengthInvalid ? 'text-red-400 font-semibold' : ''}>
          {trimmedLength} chars
        </span>
      </div>
    </div>
  );
}

