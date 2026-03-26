import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';

type StatusState = 'idle' | 'checking' | 'running' | 'error';

const getApiKeyConfigType = (keyCount: number): string => {
  if (keyCount <= 0) return 'Missing';
  if (keyCount === 1) return 'Single key';
  return `Multi-key (${keyCount})`;
};

export const BackendWakeButton = () => {
  const [statusState, setStatusState] = useState<StatusState>('idle');
  const [message, setMessage] = useState('Run a status check before generating B-roll.');
  const [apiKeyType, setApiKeyType] = useState('Unknown');
  const [environment, setEnvironment] = useState('unknown');

  const checkBackendStatus = async () => {
    setStatusState('checking');
    setMessage('Checking backend status... this can take up to 1 minute on Render.');

    try {
      const health = await apiService.wakeBackend();
      setStatusState('running');
      setEnvironment(health.environment ?? 'unknown');
      setApiKeyType(getApiKeyConfigType(health.geminiKeyBrollCount));
      setMessage('Backend is running. You can generate now.');
    } catch (error) {
      setStatusState('error');
      setApiKeyType('Unknown');
      setEnvironment('unknown');
      setMessage(error instanceof Error ? error.message : 'Failed to check backend status.');
    }
  };

  useEffect(() => {
    void checkBackendStatus();
  }, []);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Backend Status</p>
      <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-slate-700">
        <p>
          State:{' '}
          <span className="font-semibold">
            {statusState === 'running' ? 'Running' : statusState === 'checking' ? 'Checking' : 'Not Ready'}
          </span>
        </p>
        <p>
          Environment: <span className="font-semibold">{environment}</span>
        </p>
        <p>
          API key config: <span className="font-semibold">{apiKeyType}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={checkBackendStatus}
        disabled={statusState === 'checking'}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${
          statusState === 'checking'
            ? 'bg-slate-200 text-slate-600 border-slate-300 cursor-not-allowed'
            : statusState === 'running'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100'
        }`}
      >
        {statusState === 'checking' ? 'Checking Status...' : 'Check Backend Status'}
      </button>
      <p
        className={`mt-2 text-xs ${
          statusState === 'error'
            ? 'text-red-600'
            : statusState === 'running'
              ? 'text-emerald-600'
              : 'text-slate-500'
        }`}
      >
        {message}
      </p>
    </div>
  );
};
