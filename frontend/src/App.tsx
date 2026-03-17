import { Header } from './components/Header';
import { ScriptInput } from './components/ScriptInput';
import { useBrollGenerator } from './hooks/useBrollGenerator';

function App() {
  const { 
    script, 
    setScript, 
    brollPromptsJson,
    brollPromptsPlain,
    isGenerating, 
    showBrollOutput,
    showStyleOptions,
    selectedStyle,
    setSelectedStyle,
    error,
    handleGenerateClick,
    handleGenerateBroll,
    cancelGenerateBroll,
    showClearDialog,
    handleClearClick,
    confirmClear,
    cancelClear,
    showDeleteBrollDialog,
    handleDeleteBrollClick,
    confirmDeleteBroll,
    cancelDeleteBroll,
    showComingSoon,
    dismissComingSoon,
  } = useBrollGenerator();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <Header />
        <ScriptInput 
          script={script} 
          setScript={setScript} 
          brollPromptsJson={brollPromptsJson}
          brollPromptsPlain={brollPromptsPlain}
          onGenerateClick={handleGenerateClick}
          onGenerateBroll={handleGenerateBroll}
          onCancelGenerateBroll={cancelGenerateBroll}
          isGenerating={isGenerating} 
          showBrollOutput={showBrollOutput}
          showStyleOptions={showStyleOptions}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          error={error}
          showClearDialog={showClearDialog}
          onClear={handleClearClick}
          confirmClear={confirmClear}
          cancelClear={cancelClear}
          showDeleteBrollDialog={showDeleteBrollDialog}
          onDeleteBroll={handleDeleteBrollClick}
          confirmDeleteBroll={confirmDeleteBroll}
          cancelDeleteBroll={cancelDeleteBroll}
          showComingSoon={showComingSoon}
          onDismissComingSoon={dismissComingSoon}
        />
      </div>
    </div>
  );
}

export default App;
