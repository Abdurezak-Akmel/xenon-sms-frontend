"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock3,
  ShieldAlert,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  listTenantMembershipRoles,
  listTenantMemberships,
} from "@/services/auth/ten_mem.service";
import type {
  TenantMembership,
  TenantMembershipRole,
} from "@/services/auth/ten_mem.service";
import {
  getAuthenticatedBranchId,
  getAuthenticatedTenantId,
} from "@/services/auth/user.service";
import styles from "./page.module.css";

const membershipStatuses = [
  { status: "active", label: "Active", className: "statusActive" },
  { status: "invited", label: "Invited", className: "statusReview" },
  { status: "suspended", label: "Suspended", className: "statusSuspended" },
  { status: "revoked", label: "Revoked", className: "statusRevoked" },
] as const;

function getMembershipTrend(memberships: TenantMembership[]) {
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

  for (const membership of memberships) {
    const createdAt = new Date(membership.createdAt);
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

function membershipUserName(membership: TenantMembership) {
  return [
    membership.user?.firstName,
    membership.user?.middleName,
    membership.user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function BranchAdminPage() {
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [roles, setRoles] = useState<TenantMembershipRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setLoadError(null);
      try {
        const tenantId = getAuthenticatedTenantId();
        const branchId = getAuthenticatedBranchId();
        const [membershipResult, roleResult] = await Promise.all([
          listTenantMemberships({ tenantId, branchId }),
          listTenantMembershipRoles(),
        ]);
        if (
          membershipResult.memberships.some(
            (membership) =>
              membership.tenantId !== tenantId ||
              membership.branchId !== branchId,
          )
        ) {
          throw new Error(
            "The server returned membership data outside your branch.",
          );
        }

        if (active) {
          setMemberships(membershipResult.memberships);
          setRoles(roleResult.roles);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load branch dashboard data.",
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

  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active",
  ).length;
  const invitedMemberships = memberships.filter(
    (membership) => membership.status === "invited",
  ).length;
  const suspendedMemberships = memberships.filter(
    (membership) => membership.status === "suspended",
  ).length;
  const recentMemberships = useMemo(
    () =>
      [...memberships].sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime(),
      ),
    [memberships],
  );
  const membershipTrend = useMemo(
    () => getMembershipTrend(memberships),
    [memberships],
  );
  const maxTrendCount = Math.max(
    ...membershipTrend.map(({ count }) => count),
    1,
  );

  const recentActivity = useMemo(
    () =>
      memberships
        .map((membership) => ({
          key: membership.id,
          title: `Membership ${membership.status}`,
          detail:
            membershipUserName(membership) ||
            membership.user?.email ||
            "Branch member",
          time: membership.updatedAt,
          icon: Users,
          tone:
            membership.status === "active"
              ? "green"
              : membership.status === "invited"
                ? "orange"
                : "violet",
        }))
        .sort(
          (first, second) =>
            new Date(second.time).getTime() - new Date(first.time).getTime(),
        )
        .slice(0, 4),
    [memberships],
  );

  return (
    <div className={styles.dashboardContent}>
      <DashboardHeader
        title="Branch Admin Dashboard"
        subtitle="A snapshot of staff access and membership activity for your branch."
        action={{
          href: "/branch_admin/memberships",
          label: "Manage memberships",
        }}
        styles={styles}
      />

      {loadError && (
        <p className={styles.dashboardError} role="alert">
          {loadError}
        </p>
      )}

      <section className={styles.statsGrid} aria-label="Branch statistics">
        <StatsCard
          title="Branch members"
          value={loadError ? "—" : memberships.length}
          icon={Users}
          tone="blue"
          description="Memberships assigned to your branch"
          loading={loading}
        />
        <StatsCard
          title="Active memberships"
          value={loadError ? "—" : activeMemberships}
          icon={UserRoundCheck}
          tone="violet"
          description="Currently active branch access"
          loading={loading}
        />
        <StatsCard
          title="Pending invitations"
          value={loadError ? "—" : invitedMemberships}
          icon={Clock3}
          tone="orange"
          description="Awaiting branch access acceptance"
          loading={loading}
        />
        <StatsCard
          title="Suspended memberships"
          value={loadError ? "—" : suspendedMemberships}
          icon={ShieldAlert}
          tone="red"
          description="Branch access currently suspended"
          loading={loading}
        />
      </section>

      <section className={styles.analyticsGrid}>
        <DashboardPanel
          className={`${styles.contentPanel} ${styles.trendPanel}`}
          headingClassName={styles.panelHeading}
          title="Membership activity"
          subtitle="Memberships created over the last six months"
        >
          <div className={styles.trendSummary}>
            <strong>{loading || loadError ? "—" : memberships.length}</strong>
            <span>total memberships</span>
          </div>
          <div
            className={styles.trendBars}
            role="img"
            aria-label={`Memberships created by month: ${membershipTrend
              .map(({ label, count }) => `${label}: ${count}`)
              .join(", ")}`}
          >
            {membershipTrend.map(({ label, count }) => (
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
          subtitle="Access assigned to this branch"
          action={
            <Link href="/branch_admin/memberships" className={styles.textLink}>
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
          title="Branch membership"
          subtitle="A quick look at your branch roster"
          action={
            <Link href="/branch_admin/memberships" className={styles.textLink}>
              View memberships <ArrowRight size={14} />
            </Link>
          }
        >
          <div className={styles.tableScroll}>
            <table className={styles.schoolTable}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Updated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMemberships.slice(0, 5).map((membership) => {
                  const role = roles.find(
                    (item) => item.id === membership.roleId,
                  );
                  const name =
                    membershipUserName(membership) ||
                    membership.user?.email ||
                    "Branch member";
                  const statusClass =
                    membership.status === "active"
                      ? styles.statusActive
                      : membership.status === "invited"
                        ? styles.statusReview
                        : membership.status === "suspended"
                          ? styles.statusSuspended
                          : styles.statusRevoked;
                  return (
                    <tr key={membership.id}>
                      <td>
                        <div className={styles.schoolIdentity}>
                          <span
                            className={`${styles.schoolAvatar} ${styles.blue}`}
                          >
                            {name
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                          <span>
                            <strong>{name}</strong>
                            <small>
                              {membership.user?.email ?? "Branch member"}
                            </small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.planBadge}>
                          {role?.name ?? role?.code ?? "Membership"}
                        </span>
                      </td>
                      <td>{formatRelativeTime(membership.updatedAt)}</td>
                      <td>
                        <span
                          className={`${styles.schoolStatus} ${statusClass}`}
                        >
                          <i />
                          {membership.status[0].toUpperCase() +
                            membership.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {loading && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      Loading branch memberships…
                    </td>
                  </tr>
                )}
                {!loading && !loadError && memberships.length === 0 && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      No memberships assigned to this branch yet.{" "}
                      <Link href="/branch_admin/memberships" className={styles.textLink}>
                        Manage memberships
                      </Link>
                    </td>
                  </tr>
                )}
                {!loading && loadError && (
                  <tr>
                    <td colSpan={4} className={styles.schoolTableMessage}>
                      Branch membership data is unavailable.
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
          subtitle="Latest membership updates for this branch"
          action={
            <Link href="/branch_admin/memberships" className={styles.textLink}>
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
                No membership activity yet.
              </p>
            )}
            {loading && (
              <p className={styles.activityEmpty} role="status">
                Loading branch activity…
              </p>
            )}
            {loadError && (
              <p className={styles.activityEmpty}>
                Branch activity is unavailable.
              </p>
            )}
          </div>
          <div className={styles.activityFooter}>
            <span>
              <Activity size={15} /> Branch operations at a glance
            </span>
          </div>
        </DashboardPanel>
      </section>

      <footer className={styles.footer}>
        <span>Branch administration</span>
        <span>Manage access and membership activity for your branch</span>
      </footer>
    </div>
  );
}
