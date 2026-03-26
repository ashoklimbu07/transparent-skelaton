import { useRef, type ChangeEvent } from 'react';
import {
  Bell,
  Clapperboard,
  Folder,
  Library,
  LoaderCircle,
  Palette,
  Plus,
  Scissors,
  Search,
  Send,
  Settings,
  Sparkles,
  Upload,
  Waves,
} from 'lucide-react';
import { Header } from '../components/Header';
import { ScriptInput } from '../components/ScriptInput';
import { useBrollGenerator } from '../hooks/useBrollGenerator';

export function GeneratePage() {
  const {
    script,
    setScript,
    brollPromptsJson,
    brollPromptsPlain,
    totalScenes,
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
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const uploadTextRef = useRef<HTMLInputElement | null>(null);

  const handlePromptGenerate = () => {
    if (!script.trim() || !selectedStyle) {
      promptRef.current?.focus();
      return;
    }
    void handleGenerateBroll();
  };

  const handleNew = () => {
    setScript('');
    promptRef.current?.focus();
  };

  const handleUploadTextClick = () => {
    uploadTextRef.current?.click();
  };

  const handleUploadTextChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const textContent = await file.text();
    setScript(textContent);
    promptRef.current?.focus();
    event.target.value = '';
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0b0b0b] text-[#f0ede8] font-['DM_Sans']">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
      />

      <div className="relative z-10 flex h-full">
        <aside className="hidden lg:flex h-full w-[220px] shrink-0 flex-col overflow-y-auto border-r border-[#252525] bg-[#0f0f0f]">
          <div className="border-b border-[#252525] px-5 py-5">
            <div className="flex items-center gap-2.5">
              <p className="font-['Bebas_Neue'] text-[24px] tracking-[1.5px]">
                Broll<span className="text-[#e8380d]">AI</span>
              </p>
              <span className="border border-[#e8380d]/25 bg-[#e8380d]/12 px-2 py-0.5 text-[9px] uppercase tracking-[2px] text-[#e8380d]">
                Beta
              </span>
            </div>
          </div>

          <div className="m-3 rounded-md border border-[#252525] bg-[#161616] px-3 py-2 text-[13px] font-medium">
            My Workspace
          </div>

          <p className="px-3 pb-1 pt-3 text-[9px] uppercase tracking-[3px] text-[#555555]">Main</p>
          <button
            type="button"
            className="relative mx-3 mt-1 flex items-center gap-2 rounded-md bg-[#e8380d]/12 px-3 py-2.5 text-left text-[13px] text-[#f0ede8]"
          >
            <Sparkles size={14} /> Generate
            <span className="absolute -left-3 top-1 bottom-1 w-[3px] rounded-r bg-[#e8380d]" />
          </button>
          {[
            { icon: Folder, label: 'Projects' },
            { icon: Clapperboard, label: 'Templates', badge: 'New', badgeClass: 'bg-[#ffb800] text-black' },
            { icon: Library, label: 'Media Library' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled
              className="mx-3 mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-[13px] text-[#888888] cursor-not-allowed"
            >
              <item.icon size={14} />
              <span>{item.label}</span>
              {item.badge ? (
                <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${item.badgeClass}`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="mx-3 my-2 h-px bg-[#252525]" />
          <p className="px-3 pb-1 pt-2 text-[9px] uppercase tracking-[3px] text-[#555555]">Tools</p>
          {[
            { icon: Scissors, label: 'Trim & Edit' },
            { icon: Clapperboard, label: 'Auto Captions' },
            { icon: Waves, label: 'Audio Sync' },
            { icon: Upload, label: 'Exports', badge: '3', badgeClass: 'bg-[#e8380d] text-white' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled
              className="mx-3 mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-[13px] text-[#888888] cursor-not-allowed"
            >
              <item.icon size={14} />
              <span>{item.label}</span>
              {item.badge ? (
                <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${item.badgeClass}`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="mx-3 my-2 h-px bg-[#252525]" />
          <p className="px-3 pb-1 pt-2 text-[9px] uppercase tracking-[3px] text-[#555555]">Account</p>
          {[
            { icon: Palette, label: 'Brand Kit' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled
              className="mx-3 mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-[13px] text-[#888888] cursor-not-allowed"
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}

          <div className="mt-auto p-3">
            <div className="rounded-md border border-[#e8380d]/25 bg-gradient-to-br from-[#e8380d]/15 to-[#ffb800]/10 p-3.5">
              <p className="text-[13px] font-medium">Unlock Creator Plan</p>
              <p className="mt-1 text-[11px] leading-5 text-[#888888]">
                Get 100 exports/month, 4K quality and trend-matched B-roll.
              </p>
              <button
                type="button"
                className="mt-3 w-full rounded-md bg-[#e8380d] px-3 py-2 text-[12px] font-semibold uppercase tracking-[.5px] text-white transition-colors hover:bg-[#ff4d20]"
              >
                Upgrade → $19/mo
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-t border-[#252525] px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#242424] text-[13px]">
              😎
            </div>
            <div>
              <p className="text-[13px] font-medium">My Account</p>
              <p className="text-[10px] text-[#888888]">Free - 7 exports left</p>
            </div>
            <span className="ml-auto text-[#555555]">⋯</span>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#252525] px-4 sm:px-6 lg:px-8">
            <p className="font-['Bebas_Neue'] text-[18px] tracking-[2px] text-[#888888]">
              Creator <span className="text-[#f0ede8]">Workspace</span>
            </p>
            <div className="flex items-center gap-2">
              <button type="button" className="hidden sm:inline-flex rounded-md border border-[#252525] bg-[#161616] px-3 py-1.5 text-sm text-[#888888]">
                <Bell size={14} />
              </button>
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[#252525] bg-[#161616] px-3 py-1.5 text-sm text-[#888888]"
              >
                <Search size={14} />
                Search
              </button>
              <button
                type="button"
                onClick={handleNew}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#e8380d] bg-[#e8380d] px-3 py-1.5 text-xs font-medium uppercase tracking-[.7px] text-white transition-colors hover:border-[#ff4d20] hover:bg-[#ff4d20]"
              >
                <Plus size={14} />
                New Project
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
            <section className="max-w-4xl border border-[#222222] bg-[#111111] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <h1 className="font-['Bebas_Neue'] text-[32px] sm:text-[40px] tracking-[1px] mb-4">
                What Are You Creating Today?
              </h1>
              <Header />
              <textarea
                ref={promptRef}
                rows={3}
                value={script}
                onChange={(event) => setScript(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                    event.preventDefault();
                    handlePromptGenerate();
                  }
                }}
                placeholder="Describe your video topic or paste your script. BrollAI will handle the rest."
                className="min-h-[84px] w-full resize-y border border-[#2e2e2e] bg-[#161616] p-4 text-[15px] text-[#f0ede8] placeholder:text-[#555555] outline-none focus:border-[#e8380d]/45"
              />

              <div className="mt-4 border-t border-[#252525] pt-3">
                <input
                  ref={uploadTextRef}
                  type="file"
                  accept=".txt,.md,.rtf,.json,.csv,.srt"
                  className="hidden"
                  onChange={handleUploadTextChange}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUploadTextClick}
                    className="inline-flex items-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-3 py-1.5 text-xs font-medium text-[#888888] hover:text-[#f0ede8]"
                  >
                    <Upload size={14} />
                    Upload Text
                  </button>
                  <p className="text-[11px] text-[#555555]">AI can make mistakes. Always review exports.</p>
                </div>

                <p className="mt-4 text-xs uppercase tracking-[.8px] text-[#888888]">Choose style / templates</p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedStyle('transparent_skeleton')}
                  disabled={isGenerating}
                  className={`rounded-md border p-4 text-left transition-colors ${
                    selectedStyle === 'transparent_skeleton'
                      ? 'border-[#e8380d] bg-[#e8380d]/12'
                      : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <p className="text-sm font-semibold text-[#f0ede8]">Transparent Skeleton</p>
                  <p className="mt-1 text-xs text-[#888888]">X-ray style transparent skeleton visuals</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStyle('2d_animation')}
                  disabled={isGenerating}
                  className={`rounded-md border p-4 text-left transition-colors ${
                    selectedStyle === '2d_animation'
                      ? 'border-[#e8380d] bg-[#e8380d]/12'
                      : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#f0ede8]">2D Animation</p>
                    <span className="bg-[#2a220f] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#ffb800]">
                      Coming soon
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#888888]">Classic hand-drawn animation look</p>
                </button>
              </div>

              <div className="mt-4 border-t border-[#252525] pt-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] text-[#555555]">AI can make mistakes. Always review exports.</p>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                    {isGenerating ? (
                      <button
                        type="button"
                        onClick={cancelGenerateBroll}
                      className="inline-flex w-full items-center justify-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-4 py-2 text-xs font-semibold uppercase tracking-[.6px] text-[#f0ede8] transition-colors hover:border-[#ff4d20] sm:w-auto"
                      >
                      <LoaderCircle size={14} />
                        Cancel
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={handlePromptGenerate}
                      disabled={isGenerating || !script.trim() || !selectedStyle}
                      className="inline-flex w-full items-center justify-center gap-2 border border-[#e8380d] bg-[#e8380d] px-7 py-3 text-sm font-semibold uppercase tracking-[.7px] text-white transition-colors hover:bg-[#ff4d20] hover:border-[#ff4d20] disabled:opacity-50 disabled:cursor-not-allowed sm:min-w-[220px] sm:w-auto"
                    >
                      <Send size={16} />
                      Generate B-roll
                    </button>
                  </div>
                </div>
              </div>

              <ScriptInput
                script={script}
                setScript={setScript}
                brollPromptsJson={brollPromptsJson}
                brollPromptsPlain={brollPromptsPlain}
                totalScenes={totalScenes}
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
                hideEditorSection
                hidePrimaryGenerateButton
                hideStyleOptions
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
