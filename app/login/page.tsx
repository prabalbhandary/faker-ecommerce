"use client";

import { useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { Store, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const busy = isSubmitting || isLoading;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-3">
              <Store size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your account
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-xs text-blue-700">
            <p className="font-semibold mb-0.5">Demo credentials:</p>
            <p>
              Username: <code className="font-mono">johnd</code> &nbsp;
              Password: <code className="font-mono">m38rmF$</code>
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={busy}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={busy}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className="w-full px-4 py-3 pr-11 text-sm border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 mt-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Powered by{" "}
          <a
            href="https://fakestoreapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 transition-colors"
          >
            Fake Store API
          </a>
        </p>
      </div>
    </div>
  );
}
