import { getAuthHeaders } from '../../../auth/authToken';
import type { Scene } from '../src/types';

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';

const normalizeApiBaseUrl = (rawBaseUrl?: string): string => {
  const trimmed = (rawBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const ENDPOINT_BASE = `${API_BASE_URL}/video-scene-analyzer`;

async function postJson<TResponse>(path: string, body: Record<string, unknown>): Promise<TResponse> {
  const response = await fetch(`${ENDPOINT_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage =
      typeof payload?.details === 'string'
        ? payload.details
        : typeof payload?.error === 'string'
          ? payload.error
          : `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return payload as TResponse;
}

export const analyzeVideo = async (videoBase64: string, mimeType: string): Promise<Scene[]> => {
  const response = await postJson<{ scenes: Scene[] }>('/analyze-video', { videoBase64, mimeType });
  return response.scenes;
};

export const generateSingleVisualPrompt = async (segmentText: string): Promise<string> => {
  const response = await postJson<{ visualPrompt: string }>('/regenerate-visual-prompt', { segmentText });
  return response.visualPrompt;
};

export const generateImageForScene = async (
  prompt: string,
  styleModifier: string,
  aspectRatio: string,
): Promise<string> => {
  const response = await postJson<{ imageUrl: string }>('/generate-image', { prompt, styleModifier, aspectRatio });
  return response.imageUrl;
};

export const generateVideoForScene = async (
  prompt: string,
  styleModifier: string,
  aspectRatio: string,
): Promise<string> => {
  const response = await postJson<{ videoUrl: string }>('/generate-video', { prompt, styleModifier, aspectRatio });
  return response.videoUrl;
};
