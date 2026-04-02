import { MAX_SCENES } from './manualStory.utils';

type ScenesSectionProps = {
  scenesTextarea: string;
  scenesPreviewCount: number;
  isGenerating: boolean;
  onChangeScenesTextarea: (text: string) => void;
  onClear: () => void;
};

export function ScenesSection({
  scenesTextarea,
  scenesPreviewCount,
  isGenerating,
  onChangeScenesTextarea,
  onClear,
}: ScenesSectionProps) {
  return (
    <div className="rounded-[4px] border border-[#2f2f2f] bg-[#121212] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#f0ede8]">Manual Story Scenes</h2>
        <div className="flex items-center gap-2">
          <p className="text-xs leading-5 text-[#8a8a8a]">
            {scenesPreviewCount > 0
              ? `${scenesPreviewCount} scene(s) detected (up to ${MAX_SCENES}).`
              : 'Separate each scene with a line'}
          </p>
          <button
            type="button"
            disabled={isGenerating || scenesTextarea.trim().length === 0}
            onClick={onClear}
            className="rounded border border-[#3a2a25] bg-[#1a1210] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.7px] text-[#ff9f86] transition-colors hover:border-[#ff5a2f] hover:text-[#ffd4c7] disabled:cursor-not-allowed disabled:opacity-50"
            title="Clear scenes input"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-3">
        <textarea
          rows={7}
          value={scenesTextarea}
          onChange={(e) => onChangeScenesTextarea(e.target.value)}
          placeholder={
            'e.g. Scene 6: c1 is making coffee...\n\nScene 7: c2 walks in...\n\n(Scene numbers are kept in generated output; or use blank lines for Scene 1, 2, 3...)'
          }
          className="min-h-[160px] w-full resize-y rounded border border-[#2f2f2f] bg-[#161616] p-3 text-sm text-[#f0ede8] outline-none transition-colors focus:border-[#ff5a2f]"
          disabled={isGenerating}
        />
      </div>
    </div>
  );
}
