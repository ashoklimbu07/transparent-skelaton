export function ScriptInputDeleteBrollDialog(props: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { onCancel, onConfirm } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#111111] border border-[#222222] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#20110d] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#ff8c6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#f0ede8]">Delete B-Roll output?</h3>
        </div>

        <p className="text-sm text-[#888888] mb-6">
          Do you want to delete the current B-Roll prompts? You can generate a new B-Roll after deleting.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 border border-[#2b2b2b] text-[#cccccc] font-semibold hover:bg-[#1a1a1a] transition-all duration-200 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-[#ff3c00] hover:bg-[#ff5a28] text-white font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            OK, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

