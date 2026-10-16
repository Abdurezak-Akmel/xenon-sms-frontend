"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  Clock3,
  GitBranch,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { listTenantMemberships } from "@/services/auth/ten_mem.service";
import type { TenantMembership } from "@/services/auth/ten_mem.service";
import { getAuthenticatedTenantId } from "@/services/auth/user.service";
import { listBranches } from "@/services/tenancy/branch.service";
import type { Branch } from "@/services/tenancy/branch.service";
import styles from "./page.module.css";

const membershipStatuses = [
  { status: "active", label: "Active", className: "statusActive" },
  { status: "invited", label: "Invited", className: "statusReview" },
  { status: "suspended", label: "Suspended", className: "statusSuspended" },
  { status: "revoked", label: "Revoked", className: "statusRevoked" },
] as const;

function getBranchTrend(branches: Branch[]) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    return {
      date,
      label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(
        date,
      ),
      count: 0,
    };
  });

  for (const branch of branches) {
    const createdAt = new Date(branch.createdAt);
    if (Number.isNaN(createdAt.getTime())) continue;
    const month = months.find(
      ({ date }) =>
        date.getFullYear() === createdAt.getFullYear() &&
        date.getMonth() === createdAt.getMonth(),
    );
    if (month) month.count += 1;
  }

  return months;
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Recently";

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 30) return `${elapsedDays} days ago`;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function branchInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function SchoolAdminPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setLoadError(null);
      try {
        const tenantId = getAuthenticatedTenantId();
        const [branchResult, membershipResult] = await Promise.all([
          listBranches({ tenantId }),
          listTenantMemberships({ tenantId }),
        ]);
        if (branchResult.branches.some((branch) => branch.tenantId !== tenantId)) {
          throw new Error("The server returned branch data outside your school.");
        }
        if (
          membershipResult.memberships.some(
            (membership) => membership.tenantId !== tenantId,
          )
        ) {
          throw new Error(
            "The server returned membership data outside your school.",
          );
        }

        if (active) {
          setBranches(
            branchResult.branches
              .sort(
                (first, second) =>
                  new Date(second.createdAt).getTime() -
                  new Date(first.createdAt).getTime(),
              ),
          );
          setMemberships(membershipResult.memberships);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load school dashboard data.",
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

  const activeBranches = branches.filter(
    (branch) => branch.status === "active",
  ).length;
  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active",
  ).length;
  const invitedMemberships = memberships.filter(
    (membership) => membership.status === "invited",
  ).length;
  const branchTrend = useMemo(() => getBranchTrend(branches), [branches]);
  const maxTrendCount = Math.max(...branchTrend.map(({ count }) => count), 1);

  const recentActivity = useMemo(
    () =>
      [
        ...branches.map((branch) => ({
          key: `branch-${branch.id}`,
          title: "Branch added",
          detail: `${branch.name} · ${branch.code}`,
          time: branch.createdAt,
          icon: GitBranch,
          tone: "blue",
        })),
        ...memberships.map((membership) => {
          const branch = branches.find(
            (item) => item.id === membership.branchId,
          );
          return {
            key: `membership-${membership.id}`,
            title: `Membership ${membership.status}`,
            detail: branch?.name ?? "School-wide membership",
            time: membership.updatedAt,
            icon: Users,
            tone:
              membership.status === "active"
                ? "green"
                : membership.status === "invited"
                  ? "orange"
                  : "violet",
          };
        }),
      ]
        .sort(
          (first, second) =>
            new Date(second.time).getTime() - new Date(first.time).getTime(),
        )
        .slice(0, 4),
    [branches, memberships],
  );

  return (
    <div className={styles.dashboardContent}>
      <DashboardHeader
        title="School Admin Dashboard"
        subtitle="A snapshot of branches and staff access across your school."
        action={{
          href: "/school_admin/branches",
          label: "Add a branch",
        }}
        styles={styles}
      />

      {loadError && (
        <p className={styles.dashboardError} role="alert">
          {loadError}
        </p>
      )}

      <section className={styles.statsGrid} aria-label="School statistics">
        <StatsCard
          title="Total branches"
          value={loadError ? "—" : branches.length}
          icon={Building2}
          tone="blue"
          description="Across your school"
          loading={loading}
        />
        <StatsCard
          title="Active branches"
          value={loadError ? "—" : activeBranches}
          icon={GitBranch}
          tone="green"
          description="Currently operating"
          loading={loading}
        />
        <StatsCard
          title="Active memberships"
          value={loadError ? "—" : activeMemberships}
          icon={UserRoundCheck}
          tone="violet"
          description="Staff and school users"
          loading={loading}
        />
        <StatsCard
          title="Invitations"
          value={loadError ? "—" : invitedMemberships}
          icon={Clock3}
          tone="orange"
          description="Awaiting acceptance"
          loading={loading}
        />
      </section>

      <section className={styles.analyticsGrid}>
        <DashboardPanel
          className={`${styles.contentPanel} ${styles.trendPanel}`}
          headingClassName={styles.panelHeading}
          title="Branch activity"
          subtitle="New branches added over the last six months"
        >
          <div className={styles.trendSummary}>
            <strong>{loading || loadError ? "—" : branches.length}</strong>
            <span>total branches</span>
          </div>
          <div
            className={styles.trendBars}
            role="img"
            aria-label={`Branches added by month: ${branchTrend
              .map(({ label, count }) => `${label}: ${count}`)
              .join(", ")}`}
          >
            {branchTrend.map(({ label, count }) => (
              <div className={styles.trendColumn} key={label}>
                <span>{count || ""}</span>
                <div className={styles.trendBarTrack}>
                  <i
                    className={styles.trendBar}
                    style={{
                      height: `${Math.max((count / maxTrendCount) * 100, 4)}%`,
                    }}
                  />
                </div>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          className={`${styles.contentPanel} ${styles.membershipPanel}`}
          headingClassName={styles.panelHeading}
          title="Membership overview"
          subtitle="User access across your school"
          action={
            <Link href="/school_admin/memberships" className={styles.textLink}>
              Manage <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.membershipTotal}>
            <strong>{loading || loadError ? "—" : memberships.length}</strong>
            <span>total memberships</span>
          </div>
          <div className={styles.membershipRows}>
            {membershipStatuses.map(({ status, label, className }) => {
              const count = memberships.filter(
                (membership) => membership.status === status,
              ).length;
              return (
                <div className={styles.membershipRow} key={status}>
                  <span>
                    <i className={styles[className]} />
                    {label}
                  </span>
                  <strong>{loading || loadError ? "—" : count}</strong>
                </div>
              );
            })}
          </div>
        </DashboardPanel>
      </section>

      <section className={styles.bottomGrid}>
        <DashboardPanel
          className={styles.contentPanel}
          headingClassName={styles.panelHeading}
          title="Branches"
          subtitle="A quick look at your school branches"
          action={
            <Link href="/school_admin/branches" className={styles.textLink}>
              View all <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.tableScroll}>
            <table className={styles.schoolTable}>
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Code</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {branches.slice(0, 5).map((branch) => (
                  <tr key={branch.id}>
                    <td>
                      <div className={styles.schoolIdentity}>
                        <span
                          className={`${styles.schoolAvatar} ${styles.blue}`}
                        >
                          {branchInitials(branch.name)}
                        </span>
                        <span>
                          <strong>{branch.name}</strong>
                          <small>
                            {branch.email ?? branch.phone ?? "Branch"}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.planBadge}>{branch.code}</span>
                    </td>
                    <td>{branch.address || "Not set"}</td>
                    <td>
                      <span
                        className={`${styles.schoolStatus} ${
                          branch.status === "active"
                            ? styles.statusActive
                            : styles.statusReview
                        }`}
                      >
                        <i />
                        {branch.status[0].toUpperCase() + branch.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      Loading branches…
                    </td>
                  </tr>
                )}
                {!loading && !loadError && branches.length === 0 && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      No branches yet.{" "}
                      <Link
                        href="/school_admin/branches"
                        className={styles.textLink}
                      >
                        Add a branch
                      </Link>
                    </td>
                  </tr>
                )}
                {!loading && loadError && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      Branch data is unavailable.
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
          title="Recent activity"
          subtitle="Latest branch and membership updates"
          action={
            <Link href="/school_admin/memberships" className={styles.textLink}>
              View memberships <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.activityList}>
            {recentActivity.map(
              ({ key, title, detail, time, icon: Icon, tone }) => (
                <div className={styles.activityRow} key={key}>
                  <span className={`${styles.activityIcon} ${styles[tone]}`}>
                    <Icon size={16} />
                  </span>
                  <span className={styles.activityDetails}>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </span>
                  <time>{formatRelativeTime(time)}</time>
                </div>
              ),
            )}
            {!loading && !loadError && recentActivity.length === 0 && (
              <p className={styles.activityEmpty}>
                No branch or membership activity yet.
              </p>
            )}
            {loading && (
              <p className={styles.activityEmpty} role="status">
                Loading school activity…
              </p>
            )}
            {loadError && (
              <p className={styles.activityEmpty}>
                School activity is unavailable.
              </p>
            )}
          </div>
          <div className={styles.activityFooter}>
            <span>
              <Activity size={15} /> School operations at a glance
            </span>
          </div>
        </DashboardPanel>
      </section>

      <footer className={styles.footer}>
        <span>School administration</span>
        <span>Manage your branches and school memberships</span>
      </footer>
    </div>
  );
}
