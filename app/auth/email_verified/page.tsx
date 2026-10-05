"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from "lucide-react";

export default function EmailVerifiedPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("xenon_theme");
      if (saved !== null) setIsDark(saved === "dark");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    try {
      localStorage.setItem("xenon_theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

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
                Account security
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
                Your account is ready for the next step.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-200/80">
                Your email address has been confirmed. Sign in to continue to
                your Xenon workspace.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-slate-200/85">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
              <CheckCircle2 size={12} />
            </span>
            Verified access for your account
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-16">
          <Link
            href="/"
            className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300 sm:left-8 sm:top-8"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <button
            type="button"
            onClick={() => setIsDark((current) => !current)}
            className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300 sm:right-8 sm:top-8"
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunMedium size={14} /> : <MoonStar size={14} />}
            {isDark ? "Light" : "Dark"}
          </button>

          <div className="w-full max-w-xl pt-10 sm:pt-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#3267d6] text-white shadow-md shadow-cyan-500/20">
                <Sparkles size={18} />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Xenon
              </span>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,41,77,0.10)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-[0_24px_80px_rgba(2,6,23,0.52)] sm:p-9">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                    Email confirmation
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
                    Email verified
                  </h2>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                  <ShieldCheck size={22} />
                </div>
              </div>

              <div
                role="status"
                className="mb-7 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0" />
                <p>
                  Your email address has been verified. You can now sign in to
                  your account.
                </p>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3267d6] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(50,103,214,0.28)] transition hover:bg-[#2957c0] focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                Continue to sign in
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
