"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  GraduationCap,
  Plus,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Chart } from "@/components/dashboard/Chart";
import { StatsCard } from "@/components/dashboard/StatsCard";

import { listTenants } from "@/services/tenancy/tenant.service";
import type { Tenant } from "@/services/tenancy/tenant.service";

import styles from "./page.module.css";

const recentActivity = [
  {
    icon: Building2,
    tone: "blue",
    title: "New school workspace created",
    detail: "Lakeview School · Kisumu, Kenya",
    time: "12 min ago",
  },
  {
    icon: CreditCard,
    tone: "green",
    title: "Annual plan renewed",
    detail: "Northwood Academy · Enterprise",
    time: "48 min ago",
  },
];

function SubscriptionOverview() {
  return (
    <section className={`panel ${styles.subscriptionPanel}`} id="subscriptions">
      <div className={styles.panelHeading}>
        <div>
          <h2>Subscription overview</h2>
          <p>Plan distribution across schools</p>
        </div>
        <button
          type="button"
          className={styles.moreButton}
          aria-label="More subscription options"
        >
          •••
        </button>
      </div>
      <div className={styles.subscriptionTotal}>
        <strong>24</strong>
        <span>total subscriptions</span>
      </div>
      <div
        className={styles.planBar}
        aria-label="13 Enterprise, 8 Growth, 3 Starter"
      >
        <span className={styles.enterpriseSegment} />
        <span className={styles.growthSegment} />
        <span className={styles.starterSegment} />
      </div>
      <div className={styles.planRows}>
        <div>
          <span>
            <i className={styles.enterpriseDot} />
            Enterprise
          </span>
          <strong>
            13 <small>54%</small>
          </strong>
        </div>
        <div>
          <span>
            <i className={styles.growthDot} />
            Growth
          </span>
          <strong>
            8 <small>33%</small>
          </strong>
        </div>
        <div>
          <span>
            <i className={styles.starterDot} />
            Starter
          </span>
          <strong>
            3 <small>13%</small>
          </strong>
        </div>
      </div>
      <Link href="/super_admin/tenants" className={styles.textLink}>
        View subscriptions <ArrowRight size={14} />
      </Link>
    </section>
  );
}

function schoolInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SchoolsTable({
  tenants,
  loading,
  error,
}: {
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <section className={`panel ${styles.contentPanel}`}>
      <div className={styles.panelHeading}>
        <div>
          <h2>Schools</h2>
          <p>A quick look at your school workspaces</p>
        </div>
        <Link href="/super_admin/tenants" className={styles.textLink}>
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.schoolTable}>
          <thead>
            <tr>
              <th>School</th>
              <th>Code</th>
              <th>Region</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>
                  <div className={styles.schoolIdentity}>
                    <span className={`${styles.schoolAvatar} ${styles.blue}`}>
                      {schoolInitials(tenant.displayName)}
                    </span>
                    <span>
                      <strong>{tenant.displayName}</strong>
                      <small>{tenant.legalName}</small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className={styles.planBadge}>{tenant.code}</span>
                </td>
                <td>{tenant.address || tenant.countryCode || "Not set"}</td>
                <td>
                  <span
                    className={`${styles.schoolStatus} ${tenant.status === "active" ? styles.statusActive : styles.statusReview}`}
                  >
                    <i />
                    {tenant.status[0].toUpperCase() + tenant.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={4} className={styles.schoolTableMessage}>
                  Loading school workspaces…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={4} className={styles.schoolTableMessage}>
                  {error}{" "}
                  <Link href="/super_admin/tenants" className={styles.textLink}>
                    Open directory
                  </Link>
                </td>
              </tr>
            )}
            {!loading && !error && tenants.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.schoolTableMessage}>
                  No school workspaces yet.{" "}
                  <Link href="/super_admin/tenants" className={styles.textLink}>
                    Add a school
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecentActivity() {
  return (
    <section className={`panel ${styles.contentPanel}`} id="activity">
      <div className={styles.panelHeading}>
        <div>
          <h2>Recent activity</h2>
          <p>Latest updates across your platform</p>
        </div>
        <Link href="/super_admin/tenant_membership" className={styles.textLink}>
          View log <ArrowRight size={14} />
        </Link>
      </div>
      <div className={styles.activityList}>
        {recentActivity.map(({ icon: Icon, tone, title, detail, time }) => (
          <div className={styles.activityRow} key={title}>
            <span className={`${styles.activityIcon} ${styles[tone]}`}>
              <Icon size={16} />
            </span>
            <span className={styles.activityDetails}>
              <strong>{title}</strong>
              <small>{detail}</small>
            </span>
            <time>{time}</time>
          </div>
        ))}
      </div>
      <div className={styles.activityFooter}>
        <span>
          <Check size={15} /> Platform activity is up to date
        </span>
        <Activity size={15} />
      </div>
    </section>
  );
}

function DashboardContent() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listTenants()
      .then(({ tenants: records }) => {
        if (active) setTenants(records);
      })
      .catch((error: unknown) => {
        if (active) {
          setTenantsError(
            error instanceof Error
              ? error.message
              : "Unable to load school workspaces.",
          );
        }
      })
      .finally(() => {
        if (active) setTenantsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>TUESDAY, OCTOBER 6, 2026</p>
          <h1>
            Good morning, Jordan <span>✦</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Here&apos;s what&apos;s happening across your platform today.
          </p>
        </div>
        <Link
          href="/super_admin/tenants?create=1"
          className={styles.primaryButton}
        >
          <Plus size={16} /> Add a school
        </Link>
      </div>

      <section className={styles.statsGrid} aria-label="Platform statistics">
        <StatsCard
          title="Schools"
          value={tenantsLoading ? "—" : String(tenants.length)}
          icon={Building2}
          tone="blue"
          trend="up"
          change="12%"
          changeLabel="vs last month"
        />
        <StatsCard
          title="Active students"
          value="18,492"
          icon={GraduationCap}
          tone="violet"
          trend="up"
          change="8.4%"
          changeLabel="vs last month"
        />
        <StatsCard
          title="Platform members"
          value="2,840"
          icon={Users}
          tone="green"
          trend="up"
          change="6.2%"
          changeLabel="vs last month"
        />
        <StatsCard
          title="Monthly revenue"
          value="$42,680"
          icon={Wallet}
          tone="orange"
          trend="down"
          change="2.1%"
          changeLabel="vs last month"
        />
      </section>

      <section className={styles.analyticsGrid} id="analytics">
        <Chart
          className={styles.growthChart}
          title="Platform growth"
          subtitle="Active students across all schools"
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          data={[35, 39, 37, 46, 44, 53]}
          currentValue="18,492"
          currentChange="+8.4%"
        />
        <SubscriptionOverview />
      </section>

      <section className={styles.bottomGrid}>
        <SchoolsTable
          tenants={tenants}
          loading={tenantsLoading}
          error={tenantsError}
        />
        <RecentActivity />
      </section>

      <footer className={styles.footer}>
        <span>Xenon Platform Administration</span>
        <span>
          <ArrowDownRight size={13} /> School operations, all in one place
        </span>
      </footer>
    </div>
  );
}

export default function SuperAdminPage() {
  return <DashboardContent />;
}
