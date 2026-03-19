export function ScriptInputClearDialog(props: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { onCancel, onConfirm } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Clear All Content?</h3>
        </div>

        <p className="text-sm text-slate-600 mb-2">
          This will permanently delete all your script content, formatted output, and clear all saved data.
        </p>
        <p className="text-xs text-red-600 mb-6 font-medium">
          ⚠️ This action cannot be undone! Make sure to download any important content before clearing.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            Yes, Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

