"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { loginUser } from "../../../services/auth/auth.service";
import { getRoleHomePath } from "../../../route_protection/ProtectedRoute";
import { ApiError } from "../../../lib/api";
import {
  listTenantMembershipRoles,
  listTenantMemberships,
} from "../../../services/auth/ten_mem.service";
import { selectTenantMembership } from "../../../services/auth/auth.service";

type DashboardChoice = {
  membershipId: string;
  roleName: string;
  tenantId: string;
  branchId: string | null;
  homePath: string;
};

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

      if (response.user.globalRoleId === null) {
        const [{ memberships }, { roles }] = await Promise.all([
          listTenantMemberships({
            userId: response.user.id,
            status: "active",
          }),
          listTenantMembershipRoles(),
        ]);
        const rolesById = new Map(roles.map((role) => [role.id, role]));
        const choices = memberships.flatMap((membership) => {
          const role = rolesById.get(membership.roleId);
          const homePath =
            role && role.scope !== "platform"
              ? getRoleHomePath(role.code)
              : null;

          return role && homePath
            ? [
                {
                  membershipId: membership.id,
                  roleName: role.name,
                  tenantId: membership.tenantId,
                  branchId: membership.branchId,
                  homePath,
                },
              ]
            : [];
        });

        if (choices.length === 1) {
          await selectTenantMembership(choices[0].membershipId);
          window.location.assign(choices[0].homePath);
          return;
        }
        if (choices.length > 1) {
          setDashboardChoices(choices);
          return;
        }

        setError(
          "Your account does not have an active tenant membership with a configured role. Contact your administrator.",
        );
        return;
      }

      const roleCode = response.user.metadata?.roleCode;

      if (typeof roleCode === "string") {
        const roleHome = getRoleHomePath(roleCode);
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

  const handleDashboardSelection = async (choice: DashboardChoice) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await selectTenantMembership(choice.membershipId);
      window.location.assign(choice.homePath);
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
                    Welcome back
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2rem]">
                    Sign in
                  </h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
                  <ShieldCheck size={22} />
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

                {dashboardChoices.length > 0 && (
                  <div
                    className="space-y-3 rounded-xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/30"
                    aria-label="Choose a tenant dashboard"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      Choose a role and tenant to continue
                    </p>
                    {dashboardChoices.map((choice) => (
                      <button
                        key={choice.membershipId}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          void handleDashboardSelection(choice);
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {choice.roleName}
                        </span>
                        <span className="max-w-[60%] truncate text-xs text-slate-500 dark:text-slate-400">
                          Tenant {choice.tenantId}
                          {choice.branchId && ` · Branch ${choice.branchId}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

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
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {mfaRequired && (
                  <div className="space-y-2">
                    <label
                      htmlFor="mfa-code"
                      className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Authenticator code
                    </label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input
                        id="mfa-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        required
                        value={mfaCode}
                        onChange={(event) =>
                          setMfaCode(
                            event.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        placeholder="Enter the 6-digit code"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-3 text-sm tracking-[0.25em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMfaRequired(false);
                        setMfaCode("");
                        setError(null);
                      }}
                      className="text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-300"
                    >
                      Use a different account
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-900"
                    />
                    Remember me
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Secure session
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3267d6] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(50,103,214,0.28)] transition hover:bg-[#2957c0] focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                New to Xenon?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
