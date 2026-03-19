export function ScriptInputGenerateButton(props: {
  isGenerating: boolean;
  showStyleOptions: boolean;
  selectedStyle: string;
  showBrollOutput: boolean;
  showComingSoon: boolean;
  script: string;
  isScriptLengthInvalid: boolean;
  onGenerateClick: () => void;
  onGenerateBroll: () => void;
}) {
  const {
    isGenerating,
    showStyleOptions,
    selectedStyle,
    showBrollOutput,
    showComingSoon,
    script,
    isScriptLengthInvalid,
    onGenerateClick,
    onGenerateBroll,
  } = props;

  return (
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
  );
}

