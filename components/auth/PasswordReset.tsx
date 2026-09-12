"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export interface PasswordResetProps {
  onSuccess?: () => void;
  className?: string;
}

export function PasswordReset({ onSuccess, className }: PasswordResetProps) {
  const [step, setStep] = React.useState<"request" | "reset" | "success">("request");
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Password strength check
  const passwordStrength = React.useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("reset");
      setToken("849201"); // Auto-fill token for demo convenience
    }, 700);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      onSuccess?.();
    }, 800);
  };

  return (
    <Card className={className} variant="default" padding="default">
      <CardHeader>
        <CardTitle className="text-xl">
          {step === "request" && "Reset your password"}
          {step === "reset" && "Enter new password"}
          {step === "success" && "Password reset complete"}
        </CardTitle>
        <CardDescription>
          {step === "request" &&
            "Enter your institutional email to receive a secure, time-limited reset code."}
          {step === "reset" &&
            "A verification code has been dispatched. Enter the token and your new password."}
          {step === "success" &&
            "Your credentials have been securely updated. You can now sign in to your workspace."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-[#fdeaea] dark:bg-[#3d1818] border border-(--red)/30 p-3 text-xs text-(--red) flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startIcon={<Mail className="size-4" />}
              placeholder="e.g. admin@school1.com"
              helperText="Must match the registered tenant account"
            />

            <Button type="submit" disabled={loading} className="w-full gap-2 mt-2">
              {loading ? "Dispatching reset token..." : "Send Reset Code"}
              <ArrowRight className="size-4" />
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="text-xs text-(--muted) hover:text-(--foreground) inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="size-3.5" /> Back to sign in
              </Link>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="rounded-lg bg-(--blue-soft) border border-(--blue)/20 p-2.5 text-xs text-(--blue) flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Reset code dispatched to <strong>{email || "your email"}</strong></span>
            </div>

            <Input
              label="6-Digit Reset Token"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. 849201"
              startIcon={<KeyRound className="size-4" />}
            />

            <div className="space-y-1.5">
              <Input
                label="New Password"
                type="password"
                required
                showPasswordToggle
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                startIcon={<Lock className="size-4" />}
                placeholder="At least 8 characters"
              />

              {/* Password strength visualizer */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors ${
                          passwordStrength >= i
                            ? passwordStrength <= 2
                              ? "bg-(--orange)"
                              : "bg-(--green)"
                            : "bg-(--line)"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-(--muted) block">
                    Strength: {passwordStrength <= 2 ? "Moderate" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              required
              showPasswordToggle
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startIcon={<Lock className="size-4" />}
              placeholder="Re-enter password"
            />

            <Button type="submit" disabled={loading} className="w-full gap-2 mt-2">
              {loading ? "Updating credentials..." : "Update Password & Sign In"}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8f6ee] text-(--green)">
              <CheckCircle2 className="size-6" />
            </div>

            <p className="text-xs text-(--muted)">
              Your account password has been successfully renewed. Your sessions across active devices have been verified.
            </p>

            <Link href="/auth/login" className="block">
              <Button className="w-full">Sign in with New Password</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
