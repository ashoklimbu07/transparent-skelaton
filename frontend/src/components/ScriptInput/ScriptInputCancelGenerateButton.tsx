export function ScriptInputCancelGenerateButton(props: { onCancelGenerateBroll: () => void }) {
  const { onCancelGenerateBroll } = props;

  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={onCancelGenerateBroll}
          className="px-5 py-3 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all duration-200 active:scale-[0.98] bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

