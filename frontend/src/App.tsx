import { Header } from './components/Header';
import { ScriptInput } from './components/ScriptInput';
import { useBrollGenerator } from './hooks/useBrollGenerator';

function App() {
  const { 
    script, 
    setScript, 
    formattedScript,
    brollPromptsJson,
    brollPromptsPlain,
    isFormatting,
    isGenerating, 
    showFormattedOutput,
    showBrollOutput,
    showStyleOptions,
    selectedStyle,
    setSelectedStyle,
    error,
    handleFormat,
    handleGenerateClick,
    handleGenerateBroll,
    showConfirmDialog,
    confirmFormat,
    cancelFormat,
    showClearDialog,
    handleClearClick,
    confirmClear,
    cancelClear,
  } = useBrollGenerator();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <Header />
        <ScriptInput 
          script={script} 
          setScript={setScript} 
          formattedScript={formattedScript}
          brollPromptsJson={brollPromptsJson}
          brollPromptsPlain={brollPromptsPlain}
          onFormat={handleFormat}
          onGenerateClick={handleGenerateClick}
          onGenerateBroll={handleGenerateBroll}
          isFormatting={isFormatting}
          isGenerating={isGenerating} 
          showFormattedOutput={showFormattedOutput}
          showBrollOutput={showBrollOutput}
          showStyleOptions={showStyleOptions}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          error={error}
          showConfirmDialog={showConfirmDialog}
          confirmFormat={confirmFormat}
          cancelFormat={cancelFormat}
          showClearDialog={showClearDialog}
          onClear={handleClearClick}
          confirmClear={confirmClear}
          cancelClear={cancelClear}
        />
      </div>
    </div>
  );
}

export default App;
