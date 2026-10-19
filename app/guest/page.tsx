"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { getCurrentUser } from "@/services/auth/user.service";
import type { User } from "@/services/auth/user.service";
import styles from "./page.module.css";

export default function GuestPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWorkspace() {
      try {
        const userResult = await getCurrentUser();

        if (active) {
          setUser(userResult.user);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load guest workspace data.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadWorkspace();
    return () => {
      active = false;
    };
  }, []);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <div className={styles.dashboardContent}>
      <DashboardHeader
        title="Guest Dashboard"
        subtitle="Welcome to your guest workspace."
        action={{
          href: "/guest/profile",
          label: "View profile",
        }}
        styles={styles}
      />

      {loadError && (
        <p className={styles.dashboardError} role="alert">
          {loadError}
        </p>
      )}

      <DashboardPanel
        className={styles.contentPanel}
        headingClassName={styles.panelHeading}
        title="Your guest account"
        subtitle="Your account details"
        action={
          <Link href="/guest/profile" className={styles.textLink}>
            Profile <ArrowRight size={14} />
          </Link>
        }
      >
        <div className={styles.membershipTotal}>
          <strong>{loading || loadError ? "—" : fullName || "Guest"}</strong>
          <span>{user?.email ?? "Guest account"}</span>
        </div>
        <div className={styles.membershipRows}>
          <div className={styles.membershipRow}>
            <span>Role</span>
            <strong>Guest</strong>
          </div>
          <div className={styles.membershipRow}>
            <span>Account status</span>
            <strong>
              {user?.status ?? (loading ? "Loading…" : "Unavailable")}
            </strong>
          </div>
        </div>
      </DashboardPanel>
    </div>
  );
}
