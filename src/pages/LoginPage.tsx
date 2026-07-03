import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/auth";
import { ApiError } from "../lib/apiClient";
import { useAuth } from "../lib/auth";

type Mode = "login" | "forgot" | "reset";

const INPUT_CLASSES =
  "w-full rounded-small bg-surface border border-accent px-3 py-2 text-sm text-gray-200 outline-none focus:border-neon";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
  }

  async function handleLogin(event: FormEvent) {
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

  async function handleForgot(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setNotice(res.detail);
      if (res.reset_token) {
        // Non-production convenience: the backend echoes the token so the flow
        // is usable without an email transport. Prefill it and move to reset.
        setResetToken(res.reset_token);
        setMode("reset");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(resetToken.trim(), newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setPassword("");
      switchMode("login");
      setNotice("Password reset. You can now sign in.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const heading =
    mode === "login"
      ? "Sign in to continue"
      : mode === "forgot"
        ? "Reset your password"
        : "Choose a new password";

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

        <h1 className="text-sm font-medium text-gray-300 mb-4">{heading}</h1>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
                className={INPUT_CLASSES}
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
                className={INPUT_CLASSES}
                required
              />
            </div>

            {error ? <p className="text-xs text-danger">{error}</p> : null}
            {notice ? <p className="text-xs text-neon">{notice}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-small bg-neon text-gray-900 font-bold text-sm py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Forgot password?
            </button>
          </form>
        ) : mode === "forgot" ? (
          <form onSubmit={handleForgot} className="flex flex-col gap-3">
            <div>
              <label htmlFor="forgot-email" className="block text-xs text-gray-500 mb-1">
                Email
              </label>
              <input
                id="forgot-email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={INPUT_CLASSES}
                required
              />
            </div>

            {error ? <p className="text-xs text-danger">{error}</p> : null}
            {notice ? <p className="text-xs text-neon">{notice}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-small bg-neon text-gray-900 font-bold text-sm py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Sending…" : "Send reset token"}
            </button>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                ← Back to sign in
              </button>
              <button
                type="button"
                onClick={() => switchMode("reset")}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                I have a token
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            <div>
              <label htmlFor="reset-token" className="block text-xs text-gray-500 mb-1">
                Reset token
              </label>
              <input
                id="reset-token"
                type="text"
                value={resetToken}
                onChange={(event) => setResetToken(event.target.value)}
                className={INPUT_CLASSES}
                required
              />
            </div>
            <div>
              <label htmlFor="reset-new" className="block text-xs text-gray-500 mb-1">
                New password
              </label>
              <input
                id="reset-new"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={INPUT_CLASSES}
                required
              />
            </div>
            <div>
              <label htmlFor="reset-confirm" className="block text-xs text-gray-500 mb-1">
                Confirm new password
              </label>
              <input
                id="reset-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={INPUT_CLASSES}
                required
              />
            </div>

            {error ? <p className="text-xs text-danger">{error}</p> : null}
            {notice ? <p className="text-xs text-neon">{notice}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-small bg-neon text-gray-900 font-bold text-sm py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Resetting…" : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
