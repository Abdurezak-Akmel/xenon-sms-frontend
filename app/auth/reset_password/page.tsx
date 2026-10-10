"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { resetPassword } from "../../../services/auth/auth.service";

export default function ResetPasswordPage() {
  const [isDark, setIsDark] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("xenon_theme");
      if (saved !== null) setIsDark(saved === "dark");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      try {
        localStorage.setItem("xenon_theme", "dark");
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      try {
        localStorage.setItem("xenon_theme", "light");
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const query = new URLSearchParams(window.location.search);
    const token = query.get("token")?.trim();
    const email = query.get("email")?.trim();
    if (!token || !email) {
      setError(
        "This password reset link is incomplete. Request a new reset link and try again.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        email,
        token,
        newPassword: password,
      });
      setIsReset(true);
      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reset your password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`landing-page min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark
          ? "dark bg-[#07111f] text-slate-100"
          : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-[#0f1d35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full border border-cyan-300/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.28),transparent_45%)]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#7cb3ff] text-[#0f1d35] shadow-lg shadow-cyan-500/20">
                <Sparkles size={20} />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Xenon
              </span>
            </div>

            <div className="mt-20 max-w-md xl:mt-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                Secure recovery
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
                Choose a stronger password and continue safely.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-200/80">
                Set a secure new password to protect your school account and the
                data behind it.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              "Strong password protection",
              "Access restored securely",
              "Simple verification flow",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-slate-200/85"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
                  <CheckCircle2 size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-16">
          <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>

          <div className="absolute right-5 top-5 z-20">
            <button
              type="button"
              onClick={() => setIsDark((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunMedium size={14} /> : <MoonStar size={14} />}
              {isDark ? "Light" : "Dark"}
            </button>
          </div>

          <div className="w-full max-w-xl pt-10 sm:pt-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#3267d6] text-white shadow-md shadow-cyan-500/20">
                <Sparkles size={18} />
              </div>
              <div className="text-lg font-semibold tracking-tight">Xenon</div>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,41,77,0.10)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-[0_24px_80px_rgba(2,6,23,0.52)] sm:p-7 lg:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                    Account security
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
                    Reset password
                  </h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
                  <ShieldCheck size={22} />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mb-5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              {isReset ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Password updated
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Your password has been reset successfully. You can now
                      continue to your account.
                    </p>
                  </div>
                  <Link
                    href="/auth/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3267d6] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(50,103,214,0.28)] transition hover:bg-[#2957c0]"
                  >
                    Continue to sign in
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a new password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-new-password"
                      className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input
                        id="confirm-new-password"
                        type={showConfirmation ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Repeat your new password"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmation((current) => !current)
                        }
                        className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        aria-label={
                          showConfirmation
                            ? "Hide confirmation"
                            : "Show confirmation"
                        }
                      >
                        {showConfirmation ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3267d6] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(50,103,214,0.28)] transition hover:bg-[#2957c0] focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                  >
                    {isSubmitting ? "Resetting password..." : "Reset password"}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>
                </form>
              )}

              <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Need to go back?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
