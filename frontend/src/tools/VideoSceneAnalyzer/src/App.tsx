import React from 'react';
import { Film } from 'lucide-react';
import AppHeader from './components/AppHeader';
import InputPanel from './components/InputPanel';
import StyleSelector from './components/StyleSelector';
import HistoryPanel from './components/HistoryPanel';
import SceneCard from './components/SceneCard';
import SceneToolbar from './components/SceneToolbar';
import { useDirectorState } from './hooks/useDirectorState';
import { ConfirmModal } from '../../ManualStory/ConfirmModal';

const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    script,
    setScript,
    videoFile,
    isAnalyzing,
    scenes,
    selectedStyle,
    setSelectedStyle,
    selectedRatio,
    setSelectedRatio,
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
  } = useDirectorState();

  const isBusy = isGeneratingAll || isGeneratingAllVideos;

  return (
    <div className="w-full h-full min-h-0 border border-[#252525] bg-[#101010] text-[#f0ede8] shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        <aside className="lg:col-span-4 min-h-0 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
          <InputPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            script={script}
            setScript={setScript}
            videoFile={videoFile}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
            selectedRatio={selectedRatio}
            onRatioSelect={setSelectedRatio}
          />

          <HistoryPanel history={history} onLoadSession={requestLoadSession} onDeleteSession={requestDeleteSession} />
        </aside>

        <section className="lg:col-span-8 min-h-0 flex flex-col">
          <div className="mb-4 flex shrink-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold leading-tight text-white sm:whitespace-nowrap">
              Scene Breakdown
              {scenes.length > 0 && (
                <span className="text-sm font-normal text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full border border-gray-800">
                  {scenes.length} Scenes
                </span>
              )}
            </h2>

            <div className="w-full xl:w-auto">
              {scenes.length > 0 && (
                <SceneToolbar
                  copySuccess={copySuccess}
                  onCopyPrompts={handleCopyPrompts}
                  onDownloadPrompts={handleDownloadPrompts}
                  onGenerateAllImages={handleGenerateAllImages}
                  onGenerateAllVideos={handleGenerateAllVideos}
                  isGeneratingAll={isGeneratingAll}
                  isGeneratingAllVideos={isGeneratingAllVideos}
                  isBusy={isBusy}
                />
              )}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            {scenes.length === 0 && !isAnalyzing ? (
              <div className="border-2 border-dashed border-gray-800 rounded-xl p-12 text-center text-gray-500 bg-gray-900/30">
                <Film className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-400">Ready to Visualize</p>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  {activeTab === 'script'
                    ? 'Paste your script on the left and click "Analyze Scenes".'
                    : 'Upload a video on the left to reconstruct its visual scenes.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {isAnalyzing && (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl h-64 animate-pulse-slow"></div>
                    ))}
                  </>
                )}

                {scenes.map((scene, index) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    sceneNumber={index + 1}
                    onGenerate={handleGenerateImage}
                    onGenerateVideo={handleGenerateVideo}
                    onUpdatePrompt={handleUpdatePrompt}
                    onRegenerateSpecs={handleRegenerateVisualPrompt}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmModal
        open={Boolean(pendingLoadSession)}
        title="Load Previous Session?"
        body="This will replace your current unsaved scene results with the selected session."
        cancelLabel="Cancel"
        confirmLabel="Load Session"
        onCancel={cancelSessionAction}
        onConfirm={confirmLoadSession}
      />

      <ConfirmModal
        open={Boolean(pendingDeleteSessionId)}
        title="Delete Saved Session?"
        body="This action cannot be undone. The selected session will be permanently removed."
        cancelLabel="Cancel"
        confirmLabel="Delete Session"
        onCancel={cancelSessionAction}
        onConfirm={confirmDeleteSession}
        tone="danger"
      />
    </div>
  );
};

export default App;
