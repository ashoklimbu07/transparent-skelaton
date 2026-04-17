import React, { useState, useRef } from 'react';
import type { Scene } from '../types';
import { Image as ImageIcon, RefreshCw, Wand2, Download, AlertCircle, Edit3, Copy, Check, Video } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  sceneNumber: number;
  onGenerate: (id: string, prompt: string) => void;
  onGenerateVideo: (id: string, prompt: string) => void;
  onUpdatePrompt: (id: string, newPrompt: string) => void;
  onRegenerateSpecs: (id: string, newText: string) => Promise<void>;
}

const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  sceneNumber,
  onGenerate,
  onGenerateVideo,
  onUpdatePrompt,
  onRegenerateSpecs
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSegment, setIsEditingSegment] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(scene.visualPrompt);
  const [localSegmentText, setLocalSegmentText] = useState(scene.originalText);
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGenerateClick = () => {
    setIsEditing(false);
    onUpdatePrompt(scene.id, localPrompt);
    onGenerate(scene.id, localPrompt);
  };

  const handleGenerateVideoClick = () => {
    setIsEditing(false);
    onUpdatePrompt(scene.id, localPrompt);
    onGenerateVideo(scene.id, localPrompt);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    onUpdatePrompt(scene.id, localPrompt);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(scene.visualPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRegenerateSpecsClick = async () => {
    if (!localSegmentText.trim()) return;
    setIsRegenerating(true);
    try {
      await onRegenerateSpecs(scene.id, localSegmentText);
      setIsEditingSegment(false);
    } catch (e) {
      console.error("Failed to regenerate specs", e);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-[#2a2a2a] rounded-[10px] overflow-hidden hover:border-[#3a3a3a] transition-colors">
      <div className="px-5 py-3 border-b border-[#252525] bg-[#0f0f0f]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#ff9b7b]">
          Scene {sceneNumber}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#252525]">
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-[0.8px]">Original Segment</h3>
                {!isEditingSegment && (
                  <button
                    onClick={() => setIsEditingSegment(true)}
                    className="text-[#6c6c6c] hover:text-[#ff7d58] transition-colors"
                    title="Edit segment"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {isEditingSegment ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full bg-[#161616] border border-[#2f2f2f] rounded-md p-2 text-sm text-[#d7d7d7] focus:outline-none focus:ring-0 focus:border-[#ff5a2f]"
                    rows={3}
                    value={localSegmentText}
                    onChange={(e) => setLocalSegmentText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsEditingSegment(false);
                        setLocalSegmentText(scene.originalText);
                      }}
                      className="text-xs px-2 py-1 hover:bg-[#242424] rounded text-[#8a8a8a]"
                      disabled={isRegenerating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRegenerateSpecsClick}
                      className="text-xs px-2 py-1 bg-[#e8380d] hover:bg-[#ff4d20] text-white rounded flex items-center gap-1"
                      disabled={isRegenerating}
                    >
                      {isRegenerating ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          Regenerate Specs
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#d0d0d0] italic text-sm leading-relaxed border-l-2 border-[#2f2f2f] pl-3 max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                  "{scene.originalText}"
                </p>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-[#ff7d58] uppercase tracking-[0.8px] flex items-center gap-1">
                  <Wand2 className="w-3 h-3" /> Visual Prompt Specs
                </h3>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={handleCopyPrompt}
                        className="text-xs text-[#7a7a7a] hover:text-[#f0ede8] transition-colors flex items-center gap-1"
                        title="Copy Prompt"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {isCopied && <span className="text-green-400">Copied</span>}
                      </button>
                      <div className="w-px h-3 bg-[#2f2f2f]"></div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-[#7a7a7a] hover:text-[#ff7d58] transition-colors"
                        title="Edit Prompt Manually"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full bg-[#161616] border border-[#2f2f2f] rounded-md p-2 text-xs font-mono text-[#d0d0d0] focus:outline-none focus:ring-0 focus:border-[#ff5a2f] max-h-[320px] overflow-y-auto custom-scrollbar"
                    rows={15}
                    value={localPrompt}
                    onChange={(e) => setLocalPrompt(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs px-2 py-1 hover:bg-[#242424] rounded text-[#8a8a8a]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="text-xs px-2 py-1 bg-[#e8380d] hover:bg-[#ff4d20] text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="text-xs text-[#9a9a9a] leading-relaxed whitespace-pre-wrap font-mono bg-[#161616] p-3 rounded border border-[#2f2f2f] max-h-[300px] overflow-y-auto custom-scrollbar">
                  {scene.visualPrompt}
                </pre>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleGenerateClick}
              disabled={scene.status === 'generating' || scene.status === 'generating-video'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold transition-all text-xs uppercase tracking-[0.6px]
                ${scene.status === 'generating'
                  ? 'bg-[#1f1f1f] text-[#727272] border border-[#2a2a2a] cursor-wait'
                  : scene.imageUrl && !scene.videoUrl
                    ? 'bg-[#1a1a1a] hover:bg-[#232323] text-[#ff9b7b] border border-[#e8380d]/40'
                    : 'bg-[#e8380d] hover:bg-[#ff4d20] text-white border border-[#e8380d]'
                }`}
            >
              {scene.status === 'generating' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Image
                </>
              )}
            </button>

            <button
              onClick={handleGenerateVideoClick}
              disabled={scene.status === 'generating' || scene.status === 'generating-video'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold transition-all text-xs uppercase tracking-[0.6px]
                ${scene.status === 'generating-video'
                  ? 'bg-[#1f1f1f] text-[#727272] border border-[#2a2a2a] cursor-wait'
                  : scene.videoUrl
                    ? 'bg-[#1a1a1a] hover:bg-[#232323] text-[#ff9b7b] border border-[#e8380d]/40'
                    : 'bg-[#e8380d]/18 hover:bg-[#e8380d]/25 text-[#ff9b7b] border border-[#e8380d]/45'
                }`}
            >
              {scene.status === 'generating-video' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  Video
                </>
              )}
            </button>
          </div>
          {scene.error && (
            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {scene.error}
            </p>
          )}
        </div>

        <div className="bg-[#101010] min-h-[300px] md:min-h-auto relative group flex items-center justify-center">
          {scene.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={scene.videoUrl}
                className="w-full h-full object-cover absolute inset-0"
                controls
                autoPlay
                loop
                muted
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <a
                  href={scene.videoUrl}
                  download={`broll-scene-${scene.id}.mp4`}
                  className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-md text-white transition-all"
                  title="Download Video"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </>
          ) : scene.imageUrl ? (
            <>
              <img
                src={scene.imageUrl}
                alt="Generated B-roll"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a
                  href={scene.imageUrl}
                  download={`broll-scene-${scene.id}.jpg`}
                  className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                  title="Download Image"
                >
                  <Download className="w-6 h-6" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-[#666666] flex flex-col items-center gap-3 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#171717] flex items-center justify-center border border-[#2a2a2a]">
                <div className="flex gap-2">
                  <ImageIcon className="w-6 h-6 opacity-20" />
                  <Video className="w-6 h-6 opacity-20" />
                </div>
              </div>
              <p className="text-sm">Generated content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
