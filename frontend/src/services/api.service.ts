const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_LOCAL_API_BASE_URL).replace(
  /\/+$/,
  '',
);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface BrollGenerationResponse {
  success: boolean;
  style: string;
  promptsJson: string;  // JSON format (JSON objects separated by blank lines)
  promptsPlain: string;  // Human-readable plain text format
  totalScenes: number;
}

export interface HealthCheckResponse {
  status: string;
  port: string | number;
  geminiKeyBroll: boolean;
  geminiKeyBrollCount: number;
  timestamp: string;
  uptimeSeconds?: number;
  environment?: string;
}

export const apiService = {
  checkHealth: async (signal?: AbortSignal): Promise<HealthCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }

    return response.json() as Promise<HealthCheckResponse>;
  },

  wakeBackend: async (
    timeoutMs = 70_000,
    pollIntervalMs = 3_000,
    signal?: AbortSignal,
  ): Promise<HealthCheckResponse> => {
    const startedAt = Date.now();
    let lastError = 'Backend is not awake yet';

    while (Date.now() - startedAt < timeoutMs) {
      if (signal?.aborted) {
        throw new Error('Wake backend request was cancelled');
      }

      try {
        const health = await apiService.checkHealth(signal);
        if (health.status === 'OK') {
          return health;
        }
        lastError = `Unexpected health status: ${health.status}`;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown wake error';
      }

      await wait(pollIntervalMs);
    }

    throw new Error(
      `Backend did not wake up in time. Last error: ${lastError}. Please try again in a few seconds.`,
    );
  },

  generateBroll: async (
    script: string,
    style: string,
    signal?: AbortSignal
  ): Promise<BrollGenerationResponse> => {
    try {
      console.log('🎬 Frontend: Sending B-roll generation request to backend...');
      console.log(`   Style: ${style}`);
      console.log(`   Script length: ${script.length}`);

      const response = await fetch(`${API_BASE_URL}/broll/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script, style }),
        signal,
      });

      console.log('📡 Frontend: Received B-roll response, status:', response.status);

      if (!response.ok) {
        const error = await response.json();

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

      const data = await response.json();
      console.log('✅ Frontend: Successfully received B-roll prompts');
      console.log(`   Total prompts generated: ${data.totalScenes}`);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Frontend: Network error - Cannot reach backend at', API_BASE_URL);
        throw new Error(
          'Cannot connect to backend right now. If hosted on Render, click "Wake Backend" and retry.',
        );
      }
      throw error;
    }
  },
};
