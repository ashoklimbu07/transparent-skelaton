import React from 'react';
import { ASPECT_RATIO, VISUAL_STYLES, type AspectRatio, type ImageStyle } from '../types';
import {
  Palette,
  Maximize,
  Check,
  Clapperboard,
  Landmark,
  Camera,
  Cpu,
  Sparkles,
  Paintbrush2,
  Square
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: ImageStyle;
  onStyleSelect: (style: ImageStyle) => void;
  selectedRatio: AspectRatio;
  onRatioSelect: (ratio: AspectRatio) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  selectedRatio,
  onRatioSelect
}) => {
  const styleIcons: Record<string, LucideIcon> = {
    cinematic: Clapperboard,
    ancient: Landmark,
    photorealistic: Camera,
    cyberpunk: Cpu,
    anime: Sparkles,
    watercolor: Paintbrush2,
    minimalist: Square
  };

  const styleDisplayNames: Record<string, string> = {
    cinematic: 'Cinematic',
    ancient: 'Ancient',
    photorealistic: 'Photoreal',
    cyberpunk: 'Cyberpunk',
    anime: 'Anime',
    watercolor: 'Watercolor',
    minimalist: 'Minimalist'
  };

  return (
    <div className="bg-[#121212] border border-[#2a2a2a] rounded-[10px] p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3 text-[#b7b7b7] font-medium">
          <Maximize className="w-4 h-4 text-[#ff7d58]" />
          <span>Aspect Ratio</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ASPECT_RATIO).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onRatioSelect(value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedRatio === value
                  ? 'bg-[#e8380d] text-white border border-[#e8380d]'
                  : 'bg-[#1a1a1a] text-[#9a9a9a] border border-[#2a2a2a] hover:border-[#ff5a2f]/60 hover:text-[#f0ede8]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-[#b7b7b7] font-medium">
          <Palette className="w-4 h-4 text-[#ff7d58]" />
          <span>Visual Style</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_STYLES.map((style) => {
            const isSelected = selectedStyle.id === style.id;
            const StyleIcon = styleIcons[style.id] ?? Palette;
            const styleLabel = styleDisplayNames[style.id] ?? style.name;
            const isLastOddItem = VISUAL_STYLES.length % 2 === 1 && style.id === VISUAL_STYLES[VISUAL_STYLES.length - 1]?.id;
            return (
              <button
                key={style.id}
                onClick={() => onStyleSelect(style)}
                className={`relative group overflow-hidden rounded-md border transition-all duration-200 h-10 px-2.5 py-1.5 inline-flex w-full items-center gap-2 ${
                  isLastOddItem ? 'col-span-2' : ''
                } ${
                  isSelected
                    ? 'border-[#e8380d] shadow-[0_0_0_1px_rgba(232,56,13,0.35)]'
                    : 'border-[#2a2a2a] hover:border-[#ff5a2f]/60'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${style.previewColor} opacity-50 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 bg-black/45" />

                <div
                  className={`relative z-10 rounded-md border p-1 ${
                    isSelected
                      ? 'bg-black/35 border-white/35'
                      : 'bg-black/25 border-white/20'
                  }`}
                >
                  <StyleIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-100'}`} />
                </div>
                <span
                  className={`relative z-10 text-sm font-bold leading-none truncate ${
                    isSelected ? 'text-white' : 'text-gray-200'
                  }`}
                  title={style.name}
                >
                  {styleLabel}
                </span>
                {isSelected && (
                  <Check className="relative z-10 ml-auto h-4 w-4 shrink-0 rounded-full bg-black/30 p-0.5 text-[#ff7d58]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;
