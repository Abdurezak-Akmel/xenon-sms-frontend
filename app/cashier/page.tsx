"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock3,
  CreditCard,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  getAuthenticatedTenantId,
  getCurrentUser,
} from "@/services/auth/user.service";
import type { User } from "@/services/auth/user.service";
import { getTenant } from "@/services/tenancy/tenant.service";
import type { Tenant } from "@/services/tenancy/tenant.service";
import styles from "./page.module.css";

export default function CashierPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setLoadError(null);
      try {
        const tenantId = getAuthenticatedTenantId();
        const [userResult, tenantResult] = await Promise.all([
          getCurrentUser(),
          getTenant(tenantId),
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
              : "Unable to load cashier workspace data.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.dashboardContent}>
      <DashboardHeader
        title="Cashier Dashboard"
        subtitle={`Your cashier workspace${tenant ? ` for ${tenant.displayName}` : ""}.`}
        action={{
          href: "/cashier/profile",
          label: "View profile",
        }}
        styles={styles}
      />

      {loadError && (
        <p className={styles.dashboardError} role="alert">
          {loadError}
        </p>
      )}

      <section
        className={styles.statsGrid}
        aria-label="Cashier workspace summary"
      >
        <StatsCard
          title="Cashier access"
          value={loadError ? "—" : user ? "Ready" : "—"}
          icon={WalletCards}
          tone="blue"
          description="Authenticated cashier workspace"
          loading={loading}
        />
        <StatsCard
          title="Account status"
          value={loadError ? "—" : user?.status ?? "—"}
          icon={ShieldCheck}
          tone="green"
          description="Your account access status"
          loading={loading}
        />
        <StatsCard
          title="Workspace"
          value={loadError ? "—" : tenant ? "Connected" : "—"}
          icon={UserRoundCheck}
          tone="violet"
          description={tenant?.displayName ?? "Your assigned school"}
          loading={loading}
        />
        <StatsCard
          title="Financial activity"
          value="Unavailable"
          icon={Clock3}
          tone="orange"
          description="Payment services are not connected"
        />
      </section>

      <section className={styles.analyticsGrid}>
        <DashboardPanel
          className={`${styles.contentPanel} ${styles.trendPanel}`}
          headingClassName={styles.panelHeading}
          title="Cashier services"
          subtitle="Financial operations available in this workspace"
        >
          <div className={styles.trendSummary}>
            <strong>{tenant?.currencyCode ?? "—"}</strong>
            <span>{tenant?.displayName ?? "Assigned school"}</span>
          </div>
          <div className={styles.membershipRows}>
            {[
              { label: "Payment collection", icon: CreditCard },
              { label: "Receipt management", icon: ReceiptText },
              { label: "Cash drawer", icon: WalletCards },
            ].map(({ label, icon: Icon }) => (
              <div className={styles.membershipRow} key={label}>
                <span>
                  <Icon size={15} />
                  {label}
                </span>
                <strong>Not connected</strong>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          className={`${styles.contentPanel} ${styles.membershipPanel}`}
          headingClassName={styles.panelHeading}
          title="Workspace details"
          subtitle="Your authenticated cashier account and school"
          action={
            <Link href="/cashier/profile" className={styles.textLink}>
              Profile <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.membershipTotal}>
            <strong>
              {loading || loadError
                ? "—"
                : user
                  ? [user.firstName, user.lastName].filter(Boolean).join(" ")
                  : "—"}
            </strong>
            <span>{user?.email ?? "Cashier account"}</span>
          </div>
          <div className={styles.membershipRows}>
            <div className={styles.membershipRow}>
              <span>Role</span>
              <strong>Cashier</strong>
            </div>
            <div className={styles.membershipRow}>
              <span>School</span>
              <strong>
                {tenant?.displayName ?? (loading ? "Loading…" : "—")}
              </strong>
            </div>
            <div className={styles.membershipRow}>
              <span>Currency</span>
              <strong>
                {tenant?.currencyCode ?? (loading ? "Loading…" : "—")}
              </strong>
            </div>
          </div>
        </DashboardPanel>
      </section>

      <section className={styles.bottomGrid}>
        <DashboardPanel
          className={styles.contentPanel}
          headingClassName={styles.panelHeading}
          title="Cashier activity"
          subtitle="Recent collections and receipts"
          action={
            <Link href="/cashier/profile" className={styles.textLink}>
              Account settings <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.tableScroll}>
            <table className={styles.schoolTable}>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Today</th>
                  <th>Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && !loadError && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      No financial activity is available. Cashier transaction
                      services are not connected yet.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      Loading cashier activity…
                    </td>
                  </tr>
                )}
                {loadError && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      Cashier workspace data is unavailable.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DashboardPanel>

        <DashboardPanel
          className={styles.contentPanel}
          headingClassName={styles.panelHeading}
          id="activity"
          title="Cashier workspace status"
          subtitle="Your access context and service availability"
          action={
            <Link href="/cashier/profile" className={styles.textLink}>
              View profile <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.activityList}>
            <div className={styles.activityRow}>
              <span className={`${styles.activityIcon} ${styles.green}`}>
                <ShieldCheck size={16} />
              </span>
              <span className={styles.activityDetails}>
                <strong>Account access</strong>
                <small>{user?.status ?? "Awaiting account details"}</small>
              </span>
            </div>
            <div className={styles.activityRow}>
              <span className={`${styles.activityIcon} ${styles.blue}`}>
                <WalletCards size={16} />
              </span>
              <span className={styles.activityDetails}>
                <strong>Cashier transactions</strong>
                <small>Payment and receipt services are not connected</small>
              </span>
            </div>
            {loadError && (
              <p className={styles.activityEmpty} role="alert">
                {loadError}
              </p>
            )}
          </div>
          <div className={styles.activityFooter}>
            <span>
              <Activity size={15} /> Cashier operations at a glance
            </span>
          </div>
        </DashboardPanel>
      </section>

      <footer className={styles.footer}>
        <span>Cashier workspace</span>
        <span>Review financial operations for your assigned school</span>
      </footer>
    </div>
  );
}
