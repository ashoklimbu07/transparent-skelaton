import type { BrollStyle } from '../../hooks/useBrollGenerator';

export function ScriptInputStyleOptions(props: {
  isGenerating: boolean;
  selectedStyle: BrollStyle;
  setSelectedStyle: (style: BrollStyle) => void;
}) {
  const { isGenerating, selectedStyle, setSelectedStyle } = props;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-[#0d0d0d] border border-[#222222]">
        <h3 className="text-xs font-bold text-[#ff3c00] uppercase tracking-wider mb-3">
          Select Style
        </h3>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedStyle('transparent_skeleton')}
            disabled={isGenerating}
            className={`w-full p-3 border text-left transition-all duration-200 ${
              selectedStyle === 'transparent_skeleton'
                ? 'border-[#ff3c00] bg-[#171717] ring-1 ring-[#ff3c00]/30'
                : 'border-[#2b2b2b] bg-[#111111] hover:border-[#ff3c00]/70'
            } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-bold text-[#f0ede8] text-xs">Transparent Skeleton</div>
            <div className="text-[10px] text-[#888888] mt-0.5">X-ray style 3D visuals</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStyle('2d_animation')}
            disabled={isGenerating}
            className={`w-full p-3 border text-left transition-all duration-200 ${
              selectedStyle === '2d_animation'
                ? 'border-[#ff3c00] bg-[#171717] ring-1 ring-[#ff3c00]/30'
                : 'border-[#2b2b2b] bg-[#111111] hover:border-[#ff3c00]/70'
            } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#f0ede8] text-xs">2D Animation</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-[#ffb800] bg-[#2a220f] px-1.5 py-0.5">
                Coming soon
              </span>
            </div>
            <div className="text-[10px] text-[#888888] mt-0.5">
              Classic hand-drawn style
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

