import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GraduationCap, Lock, Mail } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.js";
import { useAuth } from "../../auth/AuthProvider.jsx";

export function LoginPage() {
  const { clearSessionMessage, isAuthenticated, sessionMessage, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@school.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const from = location.state?.from?.pathname ?? "/students";

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess(data) {
      signIn(data);
      navigate(from, { replace: true });
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/students" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-ink-200 bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-ink-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-meadow-600">
              <GraduationCap size={26} aria-hidden="true" />
            </div>
            <h1 className="mt-8 text-4xl font-semibold leading-tight">Brooks School</h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-ink-200">
              A clear workspace for daily school records, student care, and family communication.
            </p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/8 p-4">
            <p className="text-sm font-medium">Demo admin</p>
            <p className="mt-1 text-sm text-ink-200">admin@school.local</p>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 lg:px-12">
          <div className="mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-meadow-600 text-white">
              <GraduationCap size={26} aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-ink-900">Brooks School</h1>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink-900">Sign in to continue</h2>
          </div>

          {sessionMessage ? (
            <div className="mt-5 rounded-md border border-sun-100 bg-sun-100/55 px-3 py-2 text-sm text-ink-900">
              {sessionMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-ink-700">Email address</span>
              <span className="mt-2 flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2.5">
                <Mail size={18} className="text-ink-500" aria-hidden="true" />
                <input
                  value={email}
                  onChange={(event) => {
                    clearSessionMessage();
                    setEmail(event.target.value);
                  }}
                  type="email"
                  className="w-full border-0 bg-transparent text-ink-900 outline-none"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink-700">Password</span>
              <span className="mt-2 flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2.5">
                <Lock size={18} className="text-ink-500" aria-hidden="true" />
                <input
                  value={password}
                  onChange={(event) => {
                    clearSessionMessage();
                    setPassword(event.target.value);
                  }}
                  type="password"
                  className="w-full border-0 bg-transparent text-ink-900 outline-none"
                  autoComplete="current-password"
                  required
                />
              </span>
            </label>

            {loginMutation.isError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {loginMutation.error.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-meadow-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-meadow-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
