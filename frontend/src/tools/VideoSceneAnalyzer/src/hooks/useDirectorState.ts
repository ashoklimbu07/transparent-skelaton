import { useEffect, useRef, useState } from 'react';
import { ASPECT_RATIO, type AspectRatio, type Scene, type Session, VISUAL_STYLES } from '../types';
import {
  analyzeVideo,
  generateImageForScene,
  generateSingleVisualPrompt,
  generateVideoForScene
} from '../../services/geminiService';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const HISTORY_KEY = 'broll-director-history';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const useDirectorState = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(VISUAL_STYLES[0]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIO.PORTRAIT);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isGeneratingAllVideos, setIsGeneratingAllVideos] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState<Session[]>([]);
  const [pendingLoadSession, setPendingLoadSession] = useState<Session | null>(null);
  const [pendingDeleteSessionId, setPendingDeleteSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (!savedHistory) return;

    try {
      setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const saveHistory = (newSession: Session) => {
    const lightweightScenes = newSession.scenes.map(s => ({
      ...s,
      imageUrl: undefined,
      videoUrl: undefined
    }));

    const sessionToSave = { ...newSession, scenes: lightweightScenes };
    setHistory(prev => {
      const updated = [sessionToSave, ...prev];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save history to localStorage", e);
      }
      return [newSession, ...prev];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (file.size > 200 * 1024 * 1024) {
      alert("File size exceeds 200MB limit. Please upload a smaller video clip.");
      return;
    }
    setVideoFile(file);
  };

  const handleAnalyze = async () => {
    if (!videoFile) {
      console.warn('[B-Roll Director] Analyze skipped: no video file');
      return;
    }

    setIsAnalyzing(true);
    setHasAnalyzed(false);

    try {
      console.log('[VideoSceneAnalyzer] Processing video analyze', {
        fileName: videoFile.name,
        fileType: videoFile.type,
        fileSizeBytes: videoFile.size,
      });
      const base64Video = await fileToBase64(videoFile);
      const generatedScenes = await analyzeVideo(base64Video, videoFile.type);
      const sessionName = `Video: ${videoFile.name}`;
      console.log('[VideoSceneAnalyzer] Analyze video completed', {
        fileName: videoFile.name,
        scenes: generatedScenes.length,
      });

      setScenes(generatedScenes);
      setHasAnalyzed(true);

      saveHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'video',
        name: sessionName,
        scenes: generatedScenes
      });
    } catch (error) {
      console.error('[VideoSceneAnalyzer] Analyze video failed', error);
      const message = error instanceof Error ? error.message : 'Failed to video scene analyze content. Please try again.';
      alert(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyLoadSession = (session: Session) => {
    setScenes(session.scenes);
    setHasAnalyzed(true);
  };

  const applyDeleteSession = (sessionId: string) => {
    setHistory((prev) => {
      const updated = prev.filter((session) => session.id !== sessionId);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update history in localStorage', e);
      }
      return updated;
    });
  };

  const requestLoadSession = (session: Session) => {
    setPendingLoadSession(session);
  };

  const requestDeleteSession = (sessionId: string) => {
    setPendingDeleteSessionId(sessionId);
  };

  const cancelSessionAction = () => {
    setPendingLoadSession(null);
    setPendingDeleteSessionId(null);
  };

  const confirmLoadSession = () => {
    if (!pendingLoadSession) return;
    applyLoadSession(pendingLoadSession);
    setPendingLoadSession(null);
  };

  const confirmDeleteSession = () => {
    if (!pendingDeleteSessionId) return;
    applyDeleteSession(pendingDeleteSessionId);
    setPendingDeleteSessionId(null);
  };

  const handleUpdatePrompt = (id: string, newPrompt: string) => {
    setScenes(prev => prev.map(scene =>
      scene.id === id ? { ...scene, visualPrompt: newPrompt } : scene
    ));
  };

  const handleRegenerateVisualPrompt = async (id: string, newText: string) => {
    const newVisualPrompt = await generateSingleVisualPrompt(newText);
    setScenes(prev => prev.map(scene =>
      scene.id === id ? {
        ...scene,
        originalText: newText,
        visualPrompt: newVisualPrompt,
        status: 'pending',
        imageUrl: undefined,
        videoUrl: undefined,
        error: undefined
      } : scene
    ));
  };

  const handleGenerateImage = async (id: string, prompt: string) => {
    setScenes(prev => prev.map(scene =>
      scene.id === id ? { ...scene, status: 'generating', error: undefined } : scene
    ));

    try {
      const imageUrl = await generateImageForScene(prompt, selectedStyle.promptModifier, selectedRatio);
      setScenes(prev => prev.map(scene =>
        scene.id === id ? { ...scene, status: 'completed', imageUrl, videoUrl: undefined } : scene
      ));
    } catch {
      setScenes(prev => prev.map(scene =>
        scene.id === id ? { ...scene, status: 'error', error: 'Failed to generate image' } : scene
      ));
    }
  };

  const ensureSelectedApiKey = async () => {
    try {
      if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
        await window.aistudio.openSelectKey();
      }
      return true;
    } catch (e) {
      console.error("Error checking API key status", e);
      return false;
    }
  };

  const handleGenerateVideo = async (id: string, prompt: string) => {
    await ensureSelectedApiKey();

    setScenes(prev => prev.map(scene =>
      scene.id === id ? { ...scene, status: 'generating-video', error: undefined } : scene
    ));

    try {
      const videoUrl = await generateVideoForScene(prompt, selectedStyle.promptModifier, selectedRatio);
      setScenes(prev => prev.map(scene =>
        scene.id === id ? { ...scene, status: 'completed', videoUrl, imageUrl: undefined } : scene
      ));
    } catch {
      setScenes(prev => prev.map(scene =>
        scene.id === id ? { ...scene, status: 'error', error: 'Failed to generate video' } : scene
      ));
    }
  };

  const handleGenerateAllImages = async () => {
    const pendingScenes = scenes.filter(s => !s.imageUrl && s.status !== 'generating' && s.status !== 'generating-video');
    if (pendingScenes.length === 0) return;

    setIsGeneratingAll(true);
    setScenes(prev => prev.map(s =>
      pendingScenes.some(p => p.id === s.id)
        ? { ...s, status: 'generating', error: undefined }
        : s
    ));

    const BATCH_SIZE = 3;
    for (let i = 0; i < pendingScenes.length; i += BATCH_SIZE) {
      const batch = pendingScenes.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (scene) => {
        try {
          const imageUrl = await generateImageForScene(
            scene.visualPrompt,
            selectedStyle.promptModifier,
            selectedRatio
          );
          setScenes(prev => prev.map(s =>
            s.id === scene.id ? { ...s, status: 'completed', imageUrl } : s
          ));
        } catch {
          setScenes(prev => prev.map(s =>
            s.id === scene.id ? { ...s, status: 'error', error: 'Failed' } : s
          ));
        }
      }));
    }

    setIsGeneratingAll(false);
  };

  const handleGenerateAllVideos = async () => {
    const hasKey = await ensureSelectedApiKey();
    if (!hasKey) return;

    const pendingScenes = scenes.filter(s => !s.videoUrl && s.status !== 'generating' && s.status !== 'generating-video');
    if (pendingScenes.length === 0) return;

    setIsGeneratingAllVideos(true);
    setScenes(prev => prev.map(s =>
      pendingScenes.some(p => p.id === s.id)
        ? { ...s, status: 'generating-video', error: undefined }
        : s
    ));

    const BATCH_SIZE = 2;
    for (let i = 0; i < pendingScenes.length; i += BATCH_SIZE) {
      const batch = pendingScenes.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (scene) => {
        try {
          const videoUrl = await generateVideoForScene(
            scene.visualPrompt,
            selectedStyle.promptModifier,
            selectedRatio
          );
          setScenes(prev => prev.map(s =>
            s.id === scene.id ? { ...s, status: 'completed', videoUrl, imageUrl: undefined } : s
          ));
        } catch (error) {
          console.error(`Error generating video for scene ${scene.id}:`, error);
          setScenes(prev => prev.map(s =>
            s.id === scene.id ? { ...s, status: 'error', error: 'Video generation failed' } : s
          ));
        }
      }));
    }

    setIsGeneratingAllVideos(false);
  };

  const generatePromptsText = () => {
    return scenes.map((scene, index) => (
      `SCENE ${index + 1}\n------------------\nVIDEO SEGMENT: "${scene.originalText}"\nVISUAL PROMPT: ${scene.visualPrompt}\nSTYLE: ${selectedStyle.name} (${selectedRatio})\n`
    )).join('\n\n');
  };

  const handleCopyPrompts = async () => {
    try {
      await navigator.clipboard.writeText(generatePromptsText());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadPrompts = () => {
    const text = generatePromptsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `b-roll-prompts-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    videoFile,
    isAnalyzing,
    scenes,
    selectedStyle,
    setSelectedStyle,
    selectedRatio,
    setSelectedRatio,
    hasAnalyzed,
    isGeneratingAll,
    isGeneratingAllVideos,
    copySuccess,
    history,
    pendingLoadSession,
    pendingDeleteSessionId,
    fileInputRef,
    handleFileChange,
    handleAnalyze,
    requestLoadSession,
    requestDeleteSession,
    cancelSessionAction,
    confirmLoadSession,
    confirmDeleteSession,
    handleUpdatePrompt,
    handleRegenerateVisualPrompt,
    handleGenerateImage,
    handleGenerateVideo,
    handleGenerateAllImages,
    handleGenerateAllVideos,
    handleCopyPrompts,
    handleDownloadPrompts
  };
};
