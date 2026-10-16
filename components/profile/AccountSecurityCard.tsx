"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  KeyRound,
  LoaderCircle,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import styles from "../../app/super_admin/profile/page.module.css";

export interface AccountSecurityCardProps {
  mfaEnabled: boolean;
  mfaBusy: boolean;
  setupPending: boolean;
  error: string | null;
  lastLoginAt: string | null;
  onBeginSetup: () => Promise<void>;
  onBeginDisable: () => Promise<void>;
  onEnable: (code: string) => Promise<void>;
  onDisable: (code: string) => Promise<void>;
}

export function AccountSecurityCard({
  mfaEnabled,
  mfaBusy,
  setupPending,
  error,
  lastLoginAt,
  onBeginSetup,
  onBeginDisable,
  onEnable,
  onDisable,
}: AccountSecurityCardProps) {
  const [code, setCode] = useState("");
  const [confirmingDisable, setConfirmingDisable] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const showCodeEntry =
    (setupPending && !mfaEnabled) || (confirmingDisable && mfaEnabled);
  const formattedLastLogin = lastLoginAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastLoginAt))
    : "No sign-in recorded";

  useEffect(() => {
    if (showCodeEntry) codeInputRef.current?.focus();
  }, [showCodeEntry]);

  const resendCode = () => {
    setCode("");
    if (mfaEnabled) {
      void onBeginDisable();
    } else {
      void onBeginSetup();
    }
  };

  return (
    <Card
      id="account-security"
      className={styles.securityCard}
      variant="default"
      padding="default"
    >
      <CardHeader>
        <span className={styles.securityIcon}>
          <ShieldCheck size={19} />
        </span>
        <CardTitle>Account security</CardTitle>
        <CardDescription>
          Security status associated with your account.
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.securityList}>
        <div className={styles.securityItem}>
          <span className={styles.securityItemIcon}>
            <KeyRound size={16} />
          </span>
          <span>
            <strong>Two-factor authentication</strong>
            <small>
              {mfaEnabled
                ? "A one-time code will be emailed for each sign-in."
                : "Require an email verification code at sign-in."}
            </small>
          </span>
          <span
            className={`${styles.mfaStatus} ${mfaEnabled ? styles.mfaStatusOn : ""}`}
          >
            {mfaEnabled ? <Check size={12} /> : null}
            {mfaEnabled ? "On" : "Off"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={mfaEnabled}
            aria-label="Toggle two-factor authentication"
            className={`${styles.mfaSwitch} ${mfaEnabled ? styles.mfaSwitchOn : ""}`}
            disabled={mfaBusy}
            onClick={() => {
              setCode("");
              if (mfaEnabled) {
                setConfirmingDisable(true);
                void onBeginDisable();
              } else {
                setConfirmingDisable(false);
                void onBeginSetup();
              }
            }}
          >
            <span />
          </button>
        </div>
        {showCodeEntry && (
          <section className={styles.mfaSetup} aria-labelledby="mfa-code-title">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                <Mail size={18} />
              </span>
              <div>
                <h3
                  id="mfa-code-title"
                  className="text-sm font-semibold text-(--foreground)"
                >
                  {mfaEnabled ? "Confirm it’s you" : "Verify your email"}
                </h3>
                <p className="mt-1 text-xs leading-5 text-(--muted)">
                  Enter the 6-digit code sent to your email. It expires in 10
                  minutes.
                </p>
              </div>
            </div>

            <label
              htmlFor="profile-mfa-code"
              className="block text-xs font-semibold text-(--foreground)"
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
                    className={`grid h-12 min-w-0 flex-1 place-items-center rounded-lg border bg-(--card) text-xl font-semibold tabular-nums text-(--foreground) shadow-sm transition ${
                      code.length === index
                        ? "border-cyan-500 ring-2 ring-cyan-500/20"
                        : "border-(--line)"
                    }`}
                  >
                    {code[index] ?? ""}
                  </span>
                ))}
              </div>
              <input
                ref={codeInputRef}
                id="profile-mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                aria-label="Six-digit email verification code"
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--line) pt-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={mfaBusy}
                onClick={resendCode}
                className="h-9 gap-2 rounded-lg border-(--line) px-3 font-semibold shadow-sm transition hover:-translate-y-px hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                {mfaBusy ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                {mfaBusy ? "Sending code…" : "Resend code"}
              </Button>
              <div className={styles.mfaActions}>
                {mfaEnabled && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={mfaBusy}
                    className="h-9 rounded-lg px-3 font-semibold"
                    onClick={() => {
                      setConfirmingDisable(false);
                      setCode("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  disabled={mfaBusy || code.length !== 6}
                  className="h-9 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 font-semibold text-white shadow-md shadow-cyan-900/15 transition hover:-translate-y-px hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg focus-visible:ring-cyan-500/30"
                  onClick={() =>
                    void (mfaEnabled ? onDisable(code) : onEnable(code))
                  }
                >
                  {mfaBusy ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Verifying…
                    </>
                  ) : mfaEnabled ? (
                    <>
                      Verify and disable
                      <ArrowRight />
                    </>
                  ) : (
                    <>
                      Verify and enable
                      <ArrowRight />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>
        )}
        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}
        <div className={styles.securityItem}>
          <span className={styles.securityItemIcon}>
            <Clock3 size={16} />
          </span>
          <span>
            <strong>Last sign-in</strong>
            <small>{formattedLastLogin}</small>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
