import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  apiFetch,
  clearSessionTokens,
  getStoredRefreshToken,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
  setUnauthorizedHandler,
} from "./apiClient";

export interface CurrentUser {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));

    if (!getStoredToken()) {
      setIsLoading(false);
      return;
    }

    apiFetch<CurrentUser>("/auth/me")
      .then(setUser)
      .catch(() => clearSessionTokens())
      .finally(() => setIsLoading(false));

    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(email: string, password: string) {
    const res = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setStoredToken(res.access_token);
    setStoredRefreshToken(res.refresh_token);
    const me = await apiFetch<CurrentUser>("/auth/me");
    setUser(me);
  }

  function logout() {
    const refreshToken = getStoredRefreshToken();
    clearSessionTokens();
    setUser(null);
    if (refreshToken) {
      // Best-effort server-side revocation — the client is already logged
      // out locally regardless of whether this call succeeds.
      void apiFetch("/auth/logout", { method: "POST", body: { refresh_token: refreshToken } }).catch(
        () => undefined,
      );
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
