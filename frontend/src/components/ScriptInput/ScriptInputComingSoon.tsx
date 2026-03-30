export function ScriptInputComingSoon(props: { onDismissComingSoon: () => void }) {
  const { onDismissComingSoon } = props;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-gradient-to-br from-[#1f1608] to-[#140f08] border border-[#4a3413] shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#2a220f] border border-[#6a5018] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#ffb800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#ffd67a] mb-1">Coming soon</h3>
          <p className="text-sm text-[#e3bf70] mb-1">
            2D Animation &amp; classic hand-drawn style
          </p>
          <p className="text-xs text-[#c9a963] mb-5 max-w-xs">
            We’re working on it. Use <strong>Transparent Skeleton</strong> for now to generate B-roll prompts.
          </p>
          <button
            type="button"
            onClick={onDismissComingSoon}
            className="px-5 py-2.5 bg-[#ffb800] hover:bg-[#ffc533] text-[#1a1205] text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

