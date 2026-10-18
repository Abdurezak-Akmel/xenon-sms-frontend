"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import {
  getAuthenticatedTenantId,
  getCurrentUser,
} from "@/services/auth/user.service";
import type { User } from "@/services/auth/user.service";
import { getTenant } from "@/services/tenancy/tenant.service";
import type { Tenant } from "@/services/tenancy/tenant.service";
import styles from "./page.module.css";

export default function TeacherPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWorkspace() {
      try {
        const [userResult, tenantResult] = await Promise.all([
          getCurrentUser(),
          getTenant(getAuthenticatedTenantId()),
        ]);

        if (active) {
          setUser(userResult.user);
          setTenant(tenantResult.tenant);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load teacher workspace data.",
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

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.dashboardContent}>
      <DashboardHeader
        title="Teacher Dashboard"
        subtitle={`Welcome${tenant ? ` to ${tenant.displayName}` : ""}.`}
        action={{
          href: "/teacher/profile",
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
        title="Your teacher account"
        subtitle="Your account and assigned school"
        action={
          <Link href="/teacher/profile" className={styles.textLink}>
            Profile <ArrowRight size={14} />
          </Link>
        }
      >
        <div className={styles.membershipTotal}>
          <strong>
            {loading || loadError ? "—" : fullName || "Teacher"}
          </strong>
          <span>{user?.email ?? "Teacher account"}</span>
        </div>
        <div className={styles.membershipRows}>
          <div className={styles.membershipRow}>
            <span>Role</span>
            <strong>Teacher</strong>
          </div>
          <div className={styles.membershipRow}>
            <span>School</span>
            <strong>
              {tenant?.displayName ?? (loading ? "Loading…" : "—")}
            </strong>
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
