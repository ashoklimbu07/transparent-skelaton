import { Copy, Download, Trash2 } from 'lucide-react';
import type { ScenePrompt } from './manualStory.types';
import { formatScenePromptJson } from './manualStory.utils';

type PromptsSectionProps = {
  promptsByScene: ScenePrompt[];
  promptsPlain: string;
  copiedKey: string | null;
  onCopyText: (text: string, key: string) => void;
  onDownloadAll: () => void;
  onDeletePrompts: () => void;
};

export function PromptsSection({
  promptsByScene,
  promptsPlain,
  copiedKey,
  onCopyText,
  onDownloadAll,
  onDeletePrompts,
}: PromptsSectionProps) {
  if (promptsByScene.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[4px] border border-[#2f2f2f] bg-[#0d0d0d] p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#ff3c00]">Image Prompts</h3>
          <p className="mt-1 text-xs text-[#8a8a8a]">Generated {promptsByScene.length} scene prompt(s).</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDeletePrompts}
            className="inline-flex items-center justify-center gap-2 rounded border border-red-700/60 bg-red-950/30 px-4 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-950/50"
          >
            <Trash2 size={16} />
            Delete Prompts
          </button>
          <button
            type="button"
            onClick={onDownloadAll}
            className="inline-flex items-center justify-center gap-2 rounded border border-[#ff3c00] bg-transparent px-4 py-2 text-xs font-bold text-[#ff8c6a] transition-colors hover:bg-[#20110d]"
            disabled={!promptsPlain}
          >
            <Download size={16} />
            Download All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded border border-[#222222] bg-[#121212] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#888888]">All prompts preview</p>
            <button
              type="button"
              onClick={() => onCopyText(promptsPlain, 'all-prompts')}
              className="inline-flex items-center justify-center gap-1 rounded border border-[#252525] bg-[#161616] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.7px] text-[#b3b3b3] transition-colors hover:border-[#ff5a2f]/50 hover:text-[#f0ede8]"
              title="Copy all prompts"
              disabled={!promptsPlain}
            >
              <Copy size={13} />
              {copiedKey === 'all-prompts' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={promptsPlain}
            readOnly
            rows={5}
            className="w-full resize-y rounded border border-[#2f2f2f] bg-[#0f0f0f] p-3 text-sm text-[#f0ede8] outline-none"
          />
        </div>

        {promptsByScene.map((p) => (
          <div key={p.sceneIndex} className="rounded border border-[#222222] bg-[#121212] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#888888]">Scene {p.sceneIndex}</p>
              <button
                type="button"
                onClick={() => onCopyText(formatScenePromptJson(p), `scene-${p.sceneIndex}`)}
                className="inline-flex items-center justify-center gap-1 rounded border border-[#252525] bg-[#161616] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.7px] text-[#b3b3b3] transition-colors hover:border-[#ff5a2f]/50 hover:text-[#f0ede8]"
                title={`Copy Scene ${p.sceneIndex} prompt`}
              >
                <Copy size={13} />
                {copiedKey === `scene-${p.sceneIndex}` ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={formatScenePromptJson(p)}
              readOnly
              rows={6}
              className="w-full resize-y rounded border border-[#2f2f2f] bg-[#0f0f0f] p-3 text-sm text-[#f0ede8] outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
