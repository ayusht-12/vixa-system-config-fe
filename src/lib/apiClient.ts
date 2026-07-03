const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api/v1";

const TOKEN_STORAGE_KEY = "vsc_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "vsc_refresh_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setStoredRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

export function clearSessionTokens(): void {
  setStoredToken(null);
  setStoredRefreshToken(null);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// The auth layer registers a handler here so a fully expired session (401
// that survives a refresh attempt) can clear session state and bounce to
// /login, without apiClient needing to import React/router.
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

// A 401 from any endpoint other than login/refresh triggers exactly one
// in-flight refresh call — concurrent 401s from a burst of parallel
// requests all await the same promise instead of each rotating the
// refresh token and invalidating each other's attempt.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return false;
  }
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!response.ok) {
          return false;
        }
        const data = (await response.json()) as RefreshResponse;
        setStoredToken(data.access_token);
        setStoredRefreshToken(data.refresh_token);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

const AUTH_PATHS_WITHOUT_RETRY = new Set(["/auth/login", "/auth/refresh", "/auth/logout"]);

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
  _isRetry = false,
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    if (!_isRetry && !AUTH_PATHS_WITHOUT_RETRY.has(path)) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiFetch<T>(path, options, true);
      }
    }
    clearSessionTokens();
    unauthorizedHandler?.();
    throw new ApiError(401, "Session expired — please log in again.");
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      (detail?.detail as string | undefined) ?? response.statusText,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
