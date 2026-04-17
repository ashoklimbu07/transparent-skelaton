import React, { type RefObject } from 'react';
import { Sparkles, Film, Video, FileVideo, Upload } from 'lucide-react';

interface InputPanelProps {
  activeTab: 'script' | 'video';
  setActiveTab: (tab: 'script' | 'video') => void;
  script: string;
  setScript: (value: string) => void;
  videoFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  activeTab,
  setActiveTab,
  script,
  setScript,
  videoFile,
  fileInputRef,
  onFileChange,
  onAnalyze,
  isAnalyzing
}) => {
  return (
    <div className="bg-[#121212] border border-[#2a2a2a] rounded-[10px] overflow-hidden">
      <div className="flex border-b border-[#252525]">
        <button
          onClick={() => setActiveTab('script')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'script' ? 'bg-[#1a1a1a] text-[#f0ede8]' : 'text-[#8e8e8e] hover:text-[#f0ede8] hover:bg-[#171717]'
          }`}
        >
          <Film className="w-4 h-4" /> Script Mode
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'video' ? 'bg-[#1a1a1a] text-[#f0ede8]' : 'text-[#8e8e8e] hover:text-[#f0ede8] hover:bg-[#171717]'
          }`}
        >
          <Video className="w-4 h-4" /> Video Recreate
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'script' ? (
          <>
            <h2 className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-[0.8px] mb-4">Input Script</h2>
            <textarea
              className="w-full bg-[#161616] border border-[#2f2f2f] rounded-md p-4 text-sm text-[#f0ede8] focus:outline-none focus:ring-0 focus:border-[#ff5a2f] min-h-[190px] resize-y"
              placeholder="Paste your video script here... We will generate a scene for every line."
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </>
        ) : (
          <>
            <h2 className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-[0.8px] mb-3">Upload Video</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#161616] border border-dashed border-[#2f2f2f] rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff5a2f]/60 hover:bg-[#1a1a1a] transition-all min-h-[156px]"
            >
              {videoFile ? (
                <div className="text-center">
                  <FileVideo className="w-10 h-10 text-[#ff5a2f] mx-auto mb-2.5" />
                  <p className="text-sm font-medium text-[#f0ede8] mb-1 truncate max-w-[180px]">{videoFile.name}</p>
                  <p className="text-xs text-[#7e7e7e]">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-xs text-[#ff7d58] mt-1.5">Click to replace</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-[#555555] mx-auto mb-2.5" />
                  <p className="text-sm text-[#c7c7c7] mb-1">Click to upload video</p>
                  <p className="text-xs text-[#787878]">Max size: 200MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
            <p className="text-xs text-[#7e7e7e] mt-3 leading-relaxed">
              Upload a video to reverse-engineer its visual scenes. The AI will analyze the footage and create prompts to recreate it.
            </p>
          </>
        )}

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || (activeTab === 'script' ? !script.trim() : !videoFile)}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold uppercase tracking-[0.5px] transition-all
            ${isAnalyzing
              ? 'bg-[#1f1f1f] text-[#707070] cursor-not-allowed border border-[#2a2a2a]'
              : 'bg-[#e8380d] hover:bg-[#ff4d20] text-white border border-[#e8380d] hover:border-[#ff4d20]'
            }`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {activeTab === 'script' ? 'Analyze Scenes' : 'Analyze Video'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
