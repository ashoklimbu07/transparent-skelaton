import { useState } from 'react';
import { apiService } from '../services/api.service';

type WakeState = 'idle' | 'waking' | 'awake' | 'error';

export const BackendWakeButton = () => {
  const [wakeState, setWakeState] = useState<WakeState>('idle');
  const [message, setMessage] = useState('Render backend sleeps after inactivity. Wake it before generating.');

  const handleWakeBackend = async () => {
    setWakeState('waking');
    setMessage('Waking backend... this can take up to 1 minute on Render.');

    try {
      const health = await apiService.wakeBackend();
      setWakeState('awake');
      setMessage(
        `Backend is awake (${health.environment ?? 'unknown env'}). You can generate now.`,
      );
    } catch (error) {
      setWakeState('error');
      setMessage(error instanceof Error ? error.message : 'Failed to wake backend.');
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleWakeBackend}
        disabled={wakeState === 'waking'}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${
          wakeState === 'waking'
            ? 'bg-slate-200 text-slate-600 border-slate-300 cursor-not-allowed'
            : wakeState === 'awake'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100'
        }`}
      >
        {wakeState === 'waking' ? 'Waking Backend...' : 'Wake Backend'}
      </button>
      <p
        className={`mt-2 text-xs ${
          wakeState === 'error'
            ? 'text-red-600'
            : wakeState === 'awake'
              ? 'text-emerald-600'
              : 'text-slate-500'
        }`}
      >
        {message}
      </p>
    </div>
  );
};
