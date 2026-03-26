import { downloadBrollJSON, downloadBrollPlainText, extractSceneBlocks } from './ScriptInput.helpers';

export function ScriptInputBrollOutput(props: {
  isGenerating: boolean;
  brollPromptsJson: string;
  brollPromptsPlain: string;
  totalScenes: number;
  onDeleteBroll: () => void;
}) {
  const { isGenerating, brollPromptsJson, brollPromptsPlain, totalScenes, onDeleteBroll } = props;

  const sceneBlocks = extractSceneBlocks({ brollPromptsJson, brollPromptsPlain });
  const parsedCount = sceneBlocks.length;
  const sceneCount = totalScenes || parsedCount;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-[#0d0d0d] border border-[#222222] relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#ff3c00] uppercase tracking-wider">
            ✓ B-Roll Prompts Generated
          </h3>
          <button
            type="button"
            onClick={onDeleteBroll}
            disabled={isGenerating}
            className="p-1.5 text-[#ff8c6a] hover:bg-[#20110d] hover:text-[#ffb8a3] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete B-Roll output"
            aria-label="Delete B-Roll output"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Completion Message */}
          <div className="bg-[#181818] border-[#2a2a2a] border p-3">
            <p className="text-sm font-semibold mb-1 text-[#f0ede8]">✓ B-Roll generation completed!</p>
            <p className="text-xs text-[#888888]">{sceneCount} B-Roll generated</p>
          </div>

          {/* Download Buttons - JSON and Plain Text */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => downloadBrollJSON({ brollPromptsJson, brollPromptsPlain })}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff3c00] hover:bg-[#ff5a28] border border-[#ff3c00] text-white text-sm font-bold transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download B-Roll JSON (TXT)
            </button>

            <button
              type="button"
              onClick={() => downloadBrollPlainText({ brollPromptsJson, brollPromptsPlain })}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-transparent border border-[#ff3c00] text-[#ff8c6a] hover:bg-[#20110d] text-sm font-bold transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download B-Roll Text (TXT)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

