import { getAuthHeaders } from '../auth/authToken';

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';

const normalizeApiBaseUrl = (rawBaseUrl?: string): string => {
  const trimmed = (rawBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const BACKEND_HEALTH_URL = `${API_BASE_URL}/health`;

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const onAbort = () => {
      cleanup();
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener('abort', onAbort);
    };

    if (signal?.aborted) {
      onAbort();
      return;
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });

const pingBackendHealth = async (signal?: AbortSignal): Promise<boolean> => {
  try {
    const response = await fetch(BACKEND_HEALTH_URL, {
      method: 'GET',
      cache: 'no-store',
      signal,
    });
    return response.ok;
  } catch {
    return false;
  }
};

const tryWakeBackend = async (signal?: AbortSignal): Promise<boolean> => {
  // Render cold starts can take a short while; poll health briefly before failing.
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const isHealthy = await pingBackendHealth(signal);
    if (isHealthy) {
      return true;
    }
    await sleep(attempt * 1200, signal);
  }
  return false;
};

const parseJsonResponse = async <T>(response: Response, context: string): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.toLowerCase().includes('application/json')) {
    const responseText = await response.text();
    const preview = responseText.slice(0, 120).replace(/\s+/g, ' ').trim();
    throw new Error(
      `${context} returned non-JSON response. Check VITE_API_BASE_URL and ensure it points to backend /api. Preview: ${preview || 'empty response'}`,
    );
  }

  return response.json() as Promise<T>;
};

export interface BrollGenerationResponse {
  success: boolean;
  style: string;
  promptsJson: string;  // JSON format (JSON objects separated by blank lines)
  promptsPlain: string;  // Human-readable plain text format
  totalScenes: number;
}

export const apiService = {
  wakeBackend: async (signal?: AbortSignal): Promise<boolean> => {
    return tryWakeBackend(signal);
  },

  generateBroll: async (
    script: string,
    style: string,
    signal?: AbortSignal
  ): Promise<BrollGenerationResponse> => {
    const executeGenerate = async (hasRetriedAfterWake = false): Promise<BrollGenerationResponse> => {
      try {
        // Proactively ping health so cold backends (e.g. Render) wake before heavy work.
        await tryWakeBackend(signal);

        console.log('🎬 Frontend: Sending B-roll generation request to backend...');
        console.log(`   Style: ${style}`);
        console.log(`   Script length: ${script.length}`);

        const response = await fetch(`${API_BASE_URL}/broll/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ script, style }),
          credentials: 'include',
          signal,
        });

        console.log('📡 Frontend: Received B-roll response, status:', response.status);

        if (!response.ok) {
          const error = await parseJsonResponse<{ error?: string; details?: string }>(
            response,
            'B-roll generation',
          );

          const details: string = typeof error.details === 'string' ? error.details : '';

          // Map noisy Gemini "high demand" errors to a user-friendly message
          if (
            details.includes('GoogleGenerativeAI Error') &&
            (details.includes('high demand') || details.includes('503 Service Unavailable'))
          ) {
            console.error('❌ Frontend: Gemini high-demand error:', details);
            throw new Error(
              'Our AI engine is currently under very high demand and cannot generate B-roll right now. Please wait a minute and try again — your script is safe.',
            );
          }

          const message = details
            ? `${error.error}: ${details}`
            : error.error || 'Failed to generate B-roll';

          console.error('❌ Frontend: Backend returned error:', message);
          throw new Error(message);
        }

        const data = await parseJsonResponse<BrollGenerationResponse>(response, 'B-roll generation');
        console.log('✅ Frontend: Successfully received B-roll prompts');
        console.log(`   Total prompts generated: ${data.totalScenes}`);
        return data;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.error('❌ Frontend: Network error - Cannot reach backend at', API_BASE_URL);

          if (!hasRetriedAfterWake) {
            const woke = await tryWakeBackend(signal);
            if (woke) {
              console.log('🔁 Frontend: Backend woke up, retrying B-roll generation...');
              return executeGenerate(true);
            }
          }

          throw new Error(
            'Cannot connect to backend right now. If hosted on Render, click "Wake Backend" and retry.',
          );
        }
        throw error;
      }
    };

    try {
      return await executeGenerate();
    } catch (error) {
      throw error;
    }
  },
};
