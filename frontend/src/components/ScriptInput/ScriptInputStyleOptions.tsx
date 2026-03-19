import type { BrollStyle } from '../../hooks/useBrollGenerator';

export function ScriptInputStyleOptions(props: {
  isGenerating: boolean;
  selectedStyle: BrollStyle;
  setSelectedStyle: (style: BrollStyle) => void;
}) {
  const { isGenerating, selectedStyle, setSelectedStyle } = props;

  return (
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
              <span className="text-[9px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                Coming soon
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Classic hand-drawn style
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

