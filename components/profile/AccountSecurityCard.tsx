"use client";

import { useState } from "react";
import { Clock3, KeyRound, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import styles from "../../app/super_admin/profile/page.module.css";

export interface AccountSecurityCardProps {
  mfaEnabled: boolean;
  mfaBusy: boolean;
  setupUri: string | null;
  error: string | null;
  lastLoginAt: string | null;
  onBeginSetup: () => Promise<void>;
  onEnable: (code: string) => Promise<void>;
  onDisable: (code: string) => Promise<void>;
}

export function AccountSecurityCard({
  mfaEnabled,
  mfaBusy,
  setupUri,
  error,
  lastLoginAt,
  onBeginSetup,
  onEnable,
  onDisable,
}: AccountSecurityCardProps) {
  const [code, setCode] = useState("");
  const [confirmingDisable, setConfirmingDisable] = useState(false);
  const formattedLastLogin = lastLoginAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastLoginAt))
    : "No sign-in recorded";

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
                ? "Authenticator verification is required at sign-in."
                : "Add an authenticator app as a second sign-in step."}
            </small>
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
              } else {
                setConfirmingDisable(false);
                void onBeginSetup();
              }
            }}
          >
            <span />
          </button>
        </div>
        {setupUri && !mfaEnabled && (
          <div className={styles.mfaSetup}>
            <p>
              Enter this key manually in your authenticator app, then provide
              its current six-digit code to verify setup.
            </p>
            <code>{new URL(setupUri).searchParams.get("secret")}</code>
            <Input
              label="Authenticator code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            <Button
              type="button"
              size="sm"
              disabled={mfaBusy || code.length !== 6}
              onClick={() => void onEnable(code)}
            >
              {mfaBusy ? "Verifying…" : "Verify and enable"}
            </Button>
          </div>
        )}
        {confirmingDisable && mfaEnabled && (
          <div className={styles.mfaSetup}>
            <p>
              Enter a current authenticator code to turn off two-factor
              verification.
            </p>
            <Input
              label="Authenticator code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            <div className={styles.mfaActions}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={mfaBusy}
                onClick={() => setConfirmingDisable(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={mfaBusy || code.length !== 6}
                onClick={() => void onDisable(code)}
              >
                {mfaBusy ? "Verifying…" : "Verify and disable"}
              </Button>
            </div>
          </div>
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
