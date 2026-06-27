import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Lock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.js";
import { useAuth } from "../../auth/AuthProvider.jsx";

const logo = "/assets/brooks-logo-transparent.png";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-4 py-8 text-ink-900">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,20,47,0.98),rgba(16,17,45,0.94)_45%,rgba(123,16,27,0.94))]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-ink-50" />

      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/20 bg-white/14 shadow-[0_34px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:grid-cols-[1fr_0.88fr]">
        <div className="relative hidden min-h-[640px] overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.14),transparent_30%),linear-gradient(145deg,rgba(123,16,27,0.58),rgba(7,20,47,0.9))]" />
          <div className="relative">
            <img src={logo} alt="Brooks School" className="h-20 w-64 rounded-full bg-white/95 object-contain px-5 py-2 shadow-soft" />
            <p className="mt-12 text-sm font-black uppercase text-[#f3c955]">Brooks School Portal</p>
            <h1 className="mt-4 max-w-xl text-6xl font-semibold leading-[0.95]">
              Manage daily school work with clarity.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/74">
              A secure workspace for student records, attendance, classes, results, and parent communication.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              [ShieldCheck, "Secure access", "Staff only"],
              [MapPin, "Eldoret", "Kenya"],
              [CalendarDays, "School records", "Daily updates"]
            ].map(([Icon, title, text]) => (
              <article key={title} className="rounded-3xl border border-white/18 bg-white/10 p-4 backdrop-blur-xl">
                <Icon size={20} className="text-[#f3c955]" />
                <h2 className="mt-5 text-sm font-black">{title}</h2>
                <p className="mt-1 text-xs text-white/64">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(251,247,239,0.72))] px-6 py-8 backdrop-blur-2xl sm:px-10 lg:px-12">
          <div className="mb-8">
            <img src={logo} alt="Brooks School" className="h-16 w-52 rounded-full bg-white object-contain px-4 py-2 shadow-soft lg:hidden" />
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-500 lg:mt-0">
              <span className="rounded-full border border-ink-200 bg-white/60 px-3 py-2">Eldoret, Kenya</span>
              <span className="rounded-full border border-ink-200 bg-white/60 px-3 py-2">Secure staff login</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase text-meadow-600">Welcome back</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-ink-900">Sign in to the Brooks management app.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-ink-500">
              Use your school account to continue to students, classes, attendance, and academic records.
            </p>
          </div>

          {sessionMessage ? (
            <div className="mt-5 rounded-md border border-sun-100 bg-sun-100/55 px-3 py-2 text-sm text-ink-900">
              {sessionMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-ink-700">Email address</span>
              <span className="mt-2 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/76 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(7,20,47,0.06)]">
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
              <span className="text-sm font-semibold text-ink-700">Password</span>
              <span className="mt-2 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/76 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(7,20,47,0.06)]">
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
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-meadow-600 px-4 py-3 text-sm font-black text-white shadow-soft transition hover:bg-meadow-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>

            <div className="rounded-3xl border border-ink-200/70 bg-white/50 p-4 text-sm text-ink-500">
              <p className="font-semibold text-ink-900">Demo admin</p>
              <p className="mt-1">admin@school.local</p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
