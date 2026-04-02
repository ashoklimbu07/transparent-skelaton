import { CircleHelp } from 'lucide-react';
import type { ManualStoryStyle } from './manualStory.types';

type StyleSectionProps = {
  style: ManualStoryStyle;
  isGenerating: boolean;
  onChangeStyle: (style: ManualStoryStyle) => void;
};

export function StyleSection({ style, isGenerating, onChangeStyle }: StyleSectionProps) {
  return (
    <div className="rounded-[4px] border border-[#2f2f2f] bg-[#121212] p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#f0ede8]">Visual Style</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <div
          className={`rounded border px-3 py-2 text-left text-xs transition-colors ${
            style === 'cinematic-35mm'
              ? 'border-[#ff5a2f] bg-[#20110d] text-[#ffd4c7]'
              : 'border-[#2f2f2f] bg-[#161616] text-[#9c9c9c] hover:border-[#ff5a2f]/50 hover:text-[#f0ede8]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => onChangeStyle('cinematic-35mm')}
              className="flex-1 text-left"
            >
              Cinematic 35mm camera
            </button>

            <button
              type="button"
              tabIndex={0}
              aria-label="More info about Cinematic 35mm camera style"
              className="group relative inline-flex h-5 w-5 items-center justify-center text-[#b0b0b0]/55 transition-colors hover:text-[#ffd4c7] focus:outline-none focus:ring-2 focus:ring-[#ff5a2f]/40"
            >
              <CircleHelp size={13} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-64 rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                Cinematic look with film-like contrast, warm highlights, and dramatic lighting.
              </span>
            </button>
          </div>
        </div>

        <div
          className={`rounded border px-3 py-2 text-left text-xs transition-colors ${
            style === 'photorealistic'
              ? 'border-[#ff5a2f] bg-[#20110d] text-[#ffd4c7]'
              : 'border-[#2f2f2f] bg-[#161616] text-[#9c9c9c] hover:border-[#ff5a2f]/50 hover:text-[#f0ede8]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => onChangeStyle('photorealistic')}
              className="flex-1 text-left"
            >
              Photorealistic
            </button>

            <button
              type="button"
              tabIndex={0}
              aria-label="More info about Photorealistic style"
              className="group relative inline-flex h-5 w-5 items-center justify-center text-[#b0b0b0]/55 transition-colors hover:text-[#ffd4c7] focus:outline-none focus:ring-2 focus:ring-[#ff5a2f]/40"
            >
              <CircleHelp size={13} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-64 rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                Natural, true-to-life visuals with realistic textures and balanced lighting.
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
