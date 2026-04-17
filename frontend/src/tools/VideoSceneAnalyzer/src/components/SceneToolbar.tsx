import React from 'react';
import { Copy, Check, Download, ArrowRight, Sparkles, PlayCircle } from 'lucide-react';

interface SceneToolbarProps {
  copySuccess: boolean;
  onCopyPrompts: () => void;
  onDownloadPrompts: () => void;
  onGenerateAllImages: () => void;
  onGenerateAllVideos: () => void;
  isGeneratingAll: boolean;
  isGeneratingAllVideos: boolean;
  isBusy: boolean;
}

const SceneToolbar: React.FC<SceneToolbarProps> = ({
  copySuccess,
  onCopyPrompts,
  onDownloadPrompts,
  onGenerateAllImages,
  onGenerateAllVideos,
  isGeneratingAll,
  isGeneratingAllVideos,
  isBusy
}) => {
  return (
    <div className="flex w-full flex-wrap items-stretch gap-2 xl:w-auto xl:flex-nowrap xl:justify-end">
      <div className="flex h-10 items-center bg-[#171717] rounded-md p-1 border border-[#2a2a2a]">
        <button
          onClick={onCopyPrompts}
          className="h-8 w-8 inline-flex items-center justify-center text-[#8a8a8a] hover:text-[#f0ede8] hover:bg-[#232323] rounded-md transition-all relative group"
          title="Copy all prompts to clipboard"
        >
          {copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
        <div className="w-px h-4 bg-[#2a2a2a] mx-1"></div>
        <button
          onClick={onDownloadPrompts}
          className="h-8 w-8 inline-flex items-center justify-center text-[#8a8a8a] hover:text-[#f0ede8] hover:bg-[#232323] rounded-md transition-all"
          title="Download prompts as .txt"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onGenerateAllImages}
        disabled={isBusy}
        className={`h-10 text-[11px] uppercase tracking-[0.4px] px-3 lg:px-4 rounded-md transition-colors border inline-flex items-center justify-center gap-1.5 whitespace-nowrap
          ${isGeneratingAll
            ? 'bg-[#1f1f1f] text-[#727272] border-[#2a2a2a] cursor-wait'
            : isBusy
              ? 'bg-[#1f1f1f] text-[#606060] border-[#2a2a2a] cursor-not-allowed'
              : 'bg-[#1a1a1a] hover:bg-[#222222] text-[#f0ede8] border-[#2f2f2f]'
          }`}
      >
        {isGeneratingAll ? (
          <>
            <Sparkles className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            Generate All Images <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <button
        onClick={onGenerateAllVideos}
        disabled={isBusy}
        className={`h-10 text-[11px] uppercase tracking-[0.4px] px-3 lg:px-4 rounded-md transition-colors border inline-flex items-center justify-center gap-1.5 whitespace-nowrap
          ${isGeneratingAllVideos
            ? 'bg-[#1f1f1f] text-[#727272] border-[#2a2a2a] cursor-wait'
            : isBusy
              ? 'bg-[#1f1f1f] text-[#606060] border-[#2a2a2a] cursor-not-allowed'
              : 'bg-[#e8380d]/15 hover:bg-[#e8380d]/25 text-[#ff9b7b] border-[#e8380d]/40'
          }`}
      >
        {isGeneratingAllVideos ? (
          <>
            <Sparkles className="w-4 h-4 animate-spin" />
            Videos...
          </>
        ) : (
          <>
            Generate All Videos <PlayCircle className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default SceneToolbar;
