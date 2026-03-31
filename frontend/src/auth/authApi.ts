export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';

const normalizeApiBaseUrl = (rawBaseUrl?: string): string => {
  const trimmed = (rawBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export function getGoogleStartUrl(): string {
  return `${API_BASE_URL}/auth/google/start`;
}

export async function getCurrentSessionUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch current session.');
  }

  const data = (await response.json()) as { authenticated?: boolean; user?: AuthUser };
  return data.authenticated ? (data.user ?? null) : null;
}

export async function logoutSession(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to log out.');
  }
}
