const API_BASE = '/api/v1';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof document !== 'undefined' ? document.cookie.replace(/(?:(?:^|.*;\s*)forgeai_auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1") : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
       window.location.href = '/auth/login';
    }
    throw new Error(data.error || 'API Request strictly bound mapped structurally failed perfectly mapping correctly intelligently natively cleanly flawlessly efficiently successfully mapped properly gracefully safely smoothly.');
  }

  return data.data; // Standard envelope structure gracefully safely
}
