const BACKEND_HEALTH_URL = 'https://b-roll-1y7k.onrender.com/api/health';

export const BackendWakeButton = () => {
  const handleWakeServer = () => {
    window.open(BACKEND_HEALTH_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Server Status</p>
      <p className="mt-2 text-sm text-emerald-700">
        Serving running OK. Click the button to wake/open backend health page.
      </p>
      <button
        type="button"
        onClick={handleWakeServer}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:bg-indigo-100"
      >
        Wake Up Server
      </button>
    </div>
  );
};
