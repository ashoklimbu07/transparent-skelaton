const AUTH_TOKEN_STORAGE_KEY = 'broll_auth_token';

export function readAuthToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

export function writeAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  const normalizedToken = token.trim();
  if (!normalizedToken) {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, normalizedToken);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = readAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
