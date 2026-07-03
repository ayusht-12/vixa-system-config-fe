import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../lib/apiClient";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-backdrop grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-large border border-subtle bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-small bg-neon flex items-center justify-center">
            <span className="text-gray-900 text-xs font-bold">⬡</span>
          </div>
          <span className="font-heading font-bold text-white text-sm tracking-wide">
            NEXUS ENGINE
          </span>
        </div>

        <h1 className="text-sm font-medium text-gray-300 mb-4">Sign in to continue</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="block text-xs text-gray-500 mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-small bg-surface border border-accent px-3 py-2 text-sm text-gray-200 outline-none focus:border-neon"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-gray-500 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-small bg-surface border border-accent px-3 py-2 text-sm text-gray-200 outline-none focus:border-neon"
              required
            />
          </div>

          {error ? <p className="text-xs text-danger">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-small bg-neon text-gray-900 font-bold text-sm py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
