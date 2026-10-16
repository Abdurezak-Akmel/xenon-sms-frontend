"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export type RoleOption =
  | "school_admin"
  | "super_admin"
  | "teacher"
  | "student"
  | "parent"
  | "cashier";

export interface LoginFormProps {
  onSuccess?: (role: RoleOption, email: string) => void;
  defaultRole?: RoleOption;
  className?: string;
}

const demoCredentials: Record<RoleOption, { email: string; roleLabel: string; requiresMfa: boolean }> = {
  school_admin: {
    email: "admin@school1.com",
    roleLabel: "School Admin",
    requiresMfa: true,
  },
  super_admin: {
    email: "super-admin@xenon.com",
    roleLabel: "Platform Super-Admin",
    requiresMfa: true,
  },
  teacher: {
    email: "teacher@school1.com",
    roleLabel: "Teacher",
    requiresMfa: false,
  },
  student: {
    email: "student@school1.com",
    roleLabel: "Student",
    requiresMfa: false,
  },
  parent: {
    email: "parent@school1.com",
    roleLabel: "Parent / Guardian",
    requiresMfa: false,
  },
  cashier: {
    email: "cashier@school1.com",
    roleLabel: "Cashier / Bursar",
    requiresMfa: false,
  },
};

export function LoginForm({
  onSuccess,
  defaultRole = "school_admin",
  className,
}: LoginFormProps) {
  const [selectedRole, setSelectedRole] = React.useState<RoleOption>(defaultRole);
  const [email, setEmail] = React.useState(demoCredentials[defaultRole].email);
  const [password, setPassword] = React.useState("password123");
  const [mfaCode, setMfaCode] = React.useState("");
  const [mfaStep, setMfaStep] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRoleChange = (role: RoleOption) => {
    setSelectedRole(role);
    setEmail(demoCredentials[role].email);
    setPassword("password123");
    setError(null);
    setMfaStep(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // If role requires MFA and we're not yet on MFA step:
      if (demoCredentials[selectedRole].requiresMfa && !mfaStep) {
        setMfaStep(true);
        return;
      }

      if (mfaStep && mfaCode.trim().length < 6) {
        setError("Please enter the 6-digit authentication token (e.g. 123456).");
        return;
      }

      // Success
      if (onSuccess) {
        onSuccess(selectedRole, email);
      } else {
        // Default redirect demo
        if (selectedRole === "super_admin") {
          window.location.href = "/super_admin/tenants_crud_ui";
        } else {
          window.location.href = "/school_admin/branches_crud_ui";
        }
      }
    }, 600);
  };

  return (
    <Card className={className} variant="default" padding="default">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-(--blue) text-white shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-(--foreground)">
            Xenon<span className="text-(--blue)">SMS</span> Portal
          </span>
        </div>
        <CardTitle className="text-xl">
          {mfaStep ? "Two-Factor Verification" : "Sign in to your account"}
        </CardTitle>
        <CardDescription>
          {mfaStep
            ? "Enter the six-digit verification code sent to your email address."
            : "Select your role and enter credentials to access your dedicated workspace."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Role Selection Tabs */}
        {!mfaStep && (
          <div className="mb-5">
            <label className="text-[11px] font-semibold text-(--muted) uppercase tracking-wider block mb-2">
              Select User Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg border border-(--line) bg-(--background)/70">
              {(Object.keys(demoCredentials) as RoleOption[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`px-2 py-1.5 rounded-md text-[11px] font-semibold transition truncate text-center ${
                    selectedRole === role
                      ? "bg-(--card) text-(--blue) shadow-sm border border-(--line)"
                      : "text-(--muted) hover:text-(--foreground)"
                  }`}
                >
                  {demoCredentials[role].roleLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-[#fdeaea] dark:bg-[#3d1818] border border-(--red)/30 p-3 text-xs text-(--red) flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!mfaStep ? (
            <>
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startIcon={<Mail className="size-4" />}
                placeholder="name@school.edu"
              />

              <Input
                label="Password"
                type="password"
                required
                showPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startIcon={<Lock className="size-4" />}
                placeholder="Enter password"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-(--muted)">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-(--line) text-(--blue) focus:ring-(--blue)"
                  />
                  <span>Remember me for 30 days</span>
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-(--blue) hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-(--blue)/30 bg-(--blue-soft) p-3 text-xs text-(--blue) flex items-start gap-2">
                <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Email verification:</strong>
                  <p className="mt-0.5 opacity-80">
                    Check your inbox for a one-time sign-in code.
                  </p>
                </div>
              </div>

              <Input
                label="6-Digit Email Verification Code"
                type="text"
                autoFocus
                maxLength={6}
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                startIcon={<Mail className="size-4" />}
              />

              <button
                type="button"
                onClick={() => setMfaStep(false)}
                className="text-xs text-(--muted) hover:text-(--foreground) block mt-1"
              >
                &larr; Back to credential entry
              </button>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full gap-2 mt-2">
            {loading ? (
              <span>Authenticating...</span>
            ) : mfaStep ? (
              <>
                <span>Verify Token & Access</span>
                <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                <span>Sign in as {demoCredentials[selectedRole].roleLabel}</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-(--line) text-center text-xs text-(--muted)">
          <span>New educational institution? </span>
          <Link href="/auth/register" className="font-semibold text-(--blue) hover:underline">
            Register your school
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
