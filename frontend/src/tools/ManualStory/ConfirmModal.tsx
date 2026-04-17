type ConfirmModalProps = {
  open: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  tone?: 'default' | 'danger';
};

export function ConfirmModal({
  open,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  tone = 'default',
}: ConfirmModalProps) {
  if (!open) return null;

  const danger = tone === 'danger';

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div
          className={`relative z-10 w-full max-w-md rounded-[6px] border bg-[#111111] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
            danger ? 'border-red-700/60' : 'border-[#3a2a25]'
          }`}
        >
        <h3 className={`text-sm font-bold uppercase tracking-[.8px] ${danger ? 'text-red-300' : 'text-[#ff8c6a]'}`}>
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#d8d1c9]">{body}</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[#2f2f2f] bg-[#161616] px-4 py-2 text-xs font-semibold uppercase tracking-[.7px] text-[#b3b3b3] transition-colors hover:border-[#5a5a5a] hover:text-[#f0ede8]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              danger
                ? 'rounded border border-red-700/60 bg-red-950/30 px-4 py-2 text-xs font-semibold uppercase tracking-[.7px] text-red-300 transition-colors hover:bg-red-950/50'
                : 'rounded border border-[#e8380d] bg-[#e8380d] px-4 py-2 text-xs font-semibold uppercase tracking-[.7px] text-white transition-colors hover:border-[#ff4d20] hover:bg-[#ff4d20]'
            }
          >
            {confirmLabel}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
