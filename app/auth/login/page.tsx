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
  Mail,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from "lucide-react";

// Service Functions
import {
  listTenantMembershipChoices,
  loginUser,
  selectTenantMembership,
} from "../../../services/auth/auth.service";

import { getTenant } from "../../../services/tenancy/tenant.service";

// Route Protection Middleware
import { getRoleHomePath } from "../../../route_protection/ProtectedRoute";

import { ApiError } from "../../../lib/api";

type DashboardChoice = {
  membershipId: string;
  branchId: string | null;
  roleCode: string;
  roleName: string;
  roleDescription: string | null;
  tenantName: string;
  tenantLegalName: string;
  tenantAddress: string | null;
  membershipStatus: string;
  joinedAt: string | null;
  homePath: string | null;
};

function formatMembershipDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export default function LoginPage() {
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardChoices, setDashboardChoices] = useState<DashboardChoice[]>(
    [],
  );
  const maskedEmail = email.replace(/^(.)(.*)(@.*)$/, "$1•••$3");

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
    setDashboardChoices([]);
    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email,
        password,
        ...(mfaCode ? { mfaCode } : {}),
      });

      const roleCode = response.globalRoleCode;
      const roleHome =
        typeof roleCode === "string" ? getRoleHomePath(roleCode) : null;

      if (response.user.globalRoleId !== null && roleCode === "guest") {
        window.location.assign("/guest");
        return;
      }

      if (response.user.globalRoleId === null) {
        const { memberships } = await listTenantMembershipChoices();
        if (memberships.length === 0) {
          window.location.assign("/guest");
          return;
        }

        const choices = await Promise.all(
          memberships.map(async (membership) => {
            const { tenant } = await getTenant(membership.tenantId);
            return {
              membershipId: membership.id,
              branchId: membership.branchId,
              roleCode: membership.roleCode,
              roleName: membership.roleName,
              roleDescription: membership.roleDescription,
              tenantId: membership.tenantId,
              tenantName: tenant.displayName,
              tenantLegalName: tenant.legalName,
              tenantAddress: tenant.address,
              membershipStatus: membership.status,
              joinedAt: membership.joinedAt,
              homePath:
                membership.roleScope !== "platform"
                  ? getRoleHomePath(membership.roleCode)
                  : null,
            };
          }),
        );

        setDashboardChoices(choices);
        return;
      }

      if (typeof roleCode === "string") {
        if (roleHome) {
          window.location.assign(roleHome);
          return;
        }
      }

      if (typeof roleCode === "string") {
        setError(
          `The ${roleCode} role does not have a login destination configured.`,
        );
        return;
      }

      setError(
        "Your account does not have a role assigned. Contact your administrator.",
      );
    } catch (loginError) {
      if (
        loginError instanceof ApiError &&
        (loginError.code === "MFA_REQUIRED" ||
          loginError.code === "MFA_INVALID")
      ) {
        setMfaRequired(true);
        if (loginError.code === "MFA_INVALID") setMfaCode("");
      }
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendMfaCode = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginUser({ email, password });
    } catch (resendError) {
      if (
        resendError instanceof ApiError &&
        resendError.code === "MFA_REQUIRED"
      ) {
        setMfaRequired(true);
        setMfaCode("");
        setError(resendError.message);
      } else {
        setError(
          resendError instanceof Error
            ? resendError.message
            : "Unable to resend the verification code.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDashboardSelection = async (choice: DashboardChoice) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await selectTenantMembership(choice.membershipId);
      const redirectPath =
        choice.homePath ??
        getRoleHomePath(choice.roleCode) ??
        `/${choice.roleCode.trim().replace(/[\s-]+/g, "_")}`;
      window.location.assign(redirectPath);
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : "Unable to select this tenant dashboard. Please try again.",
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
                School control center
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
                Keep every classroom, team, and decision in sync.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-200/80">
                Manage admissions, attendance, learning, and operations from one
                clear workspace built for modern schools.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              "Secure role-based access",
              "Live school operations dashboard",
              "Modern tools for staff, students, and parents",
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
              href="/"
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
              <div>
                <div className="text-lg font-semibold tracking-tight">
                  Xenon
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,41,77,0.10)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-[0_24px_80px_rgba(2,6,23,0.52)] sm:p-7 lg:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                    {dashboardChoices.length > 0
                      ? "Account verified"
                      : mfaRequired
                        ? "Two-step verification"
                        : "Welcome back"}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
                    {dashboardChoices.length > 0
                      ? "Choose a workspace"
                      : mfaRequired
                        ? "Check your email"
                        : "Sign in"}
                  </h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
                  {mfaRequired ? <Mail size={22} /> : <ShieldCheck size={22} />}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {error}
                  </p>
                )}

                {dashboardChoices.length > 0 ? (
                  <section
                    className="space-y-5"
                    aria-label="Choose a workspace membership"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        Choose a workspace
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Select the school, branch, and role you want to use for
                        this session.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {dashboardChoices.map((choice) => (
                        <button
                          key={choice.membershipId}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => {
                            void handleDashboardSelection(choice);
                          }}
                          className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-900/5 focus:outline-none focus:ring-4 focus:ring-cyan-500/15 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/70 dark:hover:border-cyan-500 dark:hover:shadow-cyan-950/30 sm:p-5"
                        >
                          <span className="flex items-start justify-between gap-4">
                            <span className="flex min-w-0 items-start gap-3">
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white dark:bg-cyan-500/10 dark:text-cyan-300 dark:group-hover:bg-cyan-500 dark:group-hover:text-white">
                                <ShieldCheck size={20} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-base font-semibold text-slate-900 dark:text-white">
                                  {choice.tenantName}
                                </span>
                                {choice.tenantLegalName !==
                                  choice.tenantName && (
                                  <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                                    {choice.tenantLegalName}
                                  </span>
                                )}
                                <span className="mt-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                  Membership role: {choice.roleName}
                                </span>
                                {choice.branchId && (
                                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                                    Branch workspace ·{" "}
                                    {choice.branchId.slice(0, 8)}
                                  </span>
                                )}
                                {!choice.branchId && (
                                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                                    School-wide workspace
                                  </span>
                                )}
                                {choice.roleDescription && (
                                  <span className="mt-1 block text-sm leading-5 text-slate-500 dark:text-slate-400">
                                    {choice.roleDescription}
                                  </span>
                                )}
                              </span>
                            </span>
                            <span className="mt-1 shrink-0 text-cyan-600 transition group-hover:translate-x-0.5 dark:text-cyan-300">
                              <ArrowRight size={18} />
                            </span>
                          </span>

                          {choice.tenantAddress && (
                            <span className="mt-4 block border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                              {choice.tenantAddress}
                            </span>
                          )}

                          <span className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                              <CheckCircle2 size={13} />
                              {choice.membershipStatus}
                            </span>
                            {choice.joinedAt && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Member since{" "}
                                {formatMembershipDate(choice.joinedAt)}
                              </span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDashboardChoices([]);
                        setError(null);
                      }}
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                    >
                      <ArrowLeft size={15} />
                      Sign in with a different account
                    </button>
                  </section>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="name@school.edu"
                          autoComplete="email"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                          Password
                        </label>
                        <Link
                          href="/auth/forgot_password"
                          className="text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Enter your password"
                          autoComplete="current-password"
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

                    {mfaRequired && (
                      <section
                        className="space-y-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/25 sm:p-5"
                        aria-labelledby="mfa-code-label"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100 dark:bg-slate-900 dark:text-cyan-300 dark:ring-cyan-900">
                            <Mail size={18} />
                          </span>
                          <div className="min-w-0">
                            <h3
                              id="mfa-code-label"
                              className="text-sm font-semibold text-slate-900 dark:text-white"
                            >
                              Enter your sign-in code
                            </h3>
                            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                              We sent a 6-digit code to{" "}
                              <span className="font-medium text-slate-800 dark:text-slate-100">
                                {maskedEmail}
                              </span>
                              . It expires in 10 minutes.
                            </p>
                          </div>
                        </div>

                        <label
                          htmlFor="mfa-code"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                        >
                          Email verification code
                        </label>
                        <div className="relative mx-auto w-full max-w-sm rounded-xl outline-none transition focus-within:ring-4 focus-within:ring-cyan-500/15">
                          <div
                            aria-hidden="true"
                            className="pointer-events-none flex justify-center gap-2 sm:gap-3"
                          >
                            {Array.from({ length: 6 }, (_, index) => (
                              <span
                                key={index}
                                className={`grid h-12 min-w-0 flex-1 place-items-center rounded-lg border bg-white text-xl font-semibold tabular-nums text-slate-900 shadow-sm transition dark:bg-slate-950 dark:text-white sm:h-14 ${
                                  mfaCode.length === index
                                    ? "border-cyan-500 ring-2 ring-cyan-500/20 dark:border-cyan-400"
                                    : "border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                {mfaCode[index] ?? ""}
                              </span>
                            ))}
                          </div>
                          <input
                            id="mfa-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]*"
                            maxLength={6}
                            autoFocus
                            value={mfaCode}
                            onChange={(event) =>
                              setMfaCode(
                                event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              )
                            }
                            aria-label="Six-digit email verification code"
                            className="absolute inset-0 h-full w-full cursor-text opacity-0"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-cyan-200/80 pt-3 text-xs dark:border-cyan-900/70">
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void resendMfaCode()}
                            className="font-semibold text-cyan-700 transition hover:text-cyan-800 disabled:cursor-wait disabled:opacity-60 dark:text-cyan-300 dark:hover:text-cyan-200"
                          >
                            {isSubmitting ? "Sending code…" : "Resend code"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMfaRequired(false);
                              setMfaCode("");
                              setError(null);
                            }}
                            className="inline-flex items-center gap-1 font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                          >
                            <ArrowLeft size={13} />
                            Use a different account
                          </button>
                        </div>
                      </section>
                    )}

                    {!mfaRequired && (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                              setRememberMe(event.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-900"
                          />
                          Remember me
                        </label>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Secure session
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        isSubmitting || (mfaRequired && mfaCode.length !== 6)
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3267d6] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(50,103,214,0.28)] transition hover:bg-[#2957c0] focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                    >
                      {isSubmitting
                        ? "Signing in..."
                        : mfaRequired
                          ? "Verify and continue"
                          : "Sign in"}
                      {!isSubmitting && <ArrowRight size={16} />}
                    </button>
                  </>
                )}
              </form>

              {dashboardChoices.length === 0 && !mfaRequired && (
                <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  New to Xenon?{" "}
                  <Link
                    href="/auth/register"
                    className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
                  >
                    Create an account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
