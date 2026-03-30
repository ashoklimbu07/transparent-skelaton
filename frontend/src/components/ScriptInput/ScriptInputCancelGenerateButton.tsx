export function ScriptInputCancelGenerateButton(props: { onCancelGenerateBroll: () => void }) {
  const { onCancelGenerateBroll } = props;

  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={onCancelGenerateBroll}
          className="px-5 py-3 border border-red-900/60 text-red-300 hover:bg-[#241313] font-bold transition-all duration-200 active:scale-[0.98] bg-[#1a1010]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

