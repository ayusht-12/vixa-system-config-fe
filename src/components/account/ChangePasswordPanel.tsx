import { useState, type FormEvent } from "react";
import { ApiError } from "../../lib/apiClient";
import { SectionCard } from "../ui/SectionCard";

const INPUT_CLASSES =
  "w-full rounded-small bg-surface border border-accent px-3 py-2 text-sm text-gray-200 outline-none focus:border-neon";

interface ChangePasswordPanelProps {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<unknown>;
}

export function ChangePasswordPanel({ onSubmit }: ChangePasswordPanelProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(current, next);
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard>
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Change Password</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
        <div>
          <label htmlFor="current-password" className="block text-xs text-gray-500 mb-1">
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className={INPUT_CLASSES}
            required
          />
        </div>
        <div>
          <label htmlFor="new-password" className="block text-xs text-gray-500 mb-1">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            className={INPUT_CLASSES}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-xs text-gray-500 mb-1">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className={INPUT_CLASSES}
            required
          />
        </div>

        {error ? <p className="text-xs text-danger">{error}</p> : null}
        {success ? (
          <p className="text-xs text-neon">
            Password changed. For security, other active sessions have been signed out.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-small bg-neon text-gray-900 font-bold text-sm py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </SectionCard>
  );
}
