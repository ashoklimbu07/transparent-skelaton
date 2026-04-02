import { Send } from 'lucide-react';

type GenerateActionsProps = {
  error: string | null;
  isGenerating: boolean;
  canGenerate: boolean;
  onCancel: () => void;
  onGenerate: () => void;
};

export function GenerateActions({
  error,
  isGenerating,
  canGenerate,
  onCancel,
  onGenerate,
}: GenerateActionsProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      {error ? <div className="rounded border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</div> : <div />}

      <div className="flex items-center gap-2">
        {isGenerating && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-4 py-2 text-xs font-semibold uppercase tracking-[.6px] text-[#f0ede8] transition-colors hover:border-[#ff4d20]"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="inline-flex items-center justify-center gap-2 border border-[#e8380d] bg-[#e8380d] px-7 py-3 text-sm font-semibold uppercase tracking-[.7px] text-white transition-colors hover:border-[#ff4d20] hover:bg-[#ff4d20] disabled:cursor-not-allowed disabled:opacity-50"
          title="Generate scene image prompts"
        >
          <Send size={16} />
          Generate Prompts
        </button>
      </div>
    </div>
  );
}
