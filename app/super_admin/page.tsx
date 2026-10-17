"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  CreditCard,
  GraduationCap,
  Users,
  Wallet,
} from "lucide-react";

// Dashboard Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

import { DashboardFooter } from "@/components/dashboard/DashboardFooter";

import { PlatformGrowth } from "@/components/dashboard/PlatformGrowth";

import type { PlatformGrowthData } from "@/components/dashboard/PlatformGrowth";

import { PlatformStats } from "@/components/dashboard/PlatformStats";

import type { PlatformStat } from "@/components/dashboard/PlatformStats";

import { RecentActivity } from "@/components/dashboard/RecentActivity";

import type { ActivityItem } from "@/components/dashboard/RecentActivity";

import { SchoolsTable } from "@/components/dashboard/SchoolsTable";

import { SubscriptionOverview } from "@/components/dashboard/SubscriptionOverview";

import type { SubscriptionPlan } from "@/components/dashboard/SubscriptionOverview";

// Service Functions
import { listTenants } from "@/services/tenancy/tenant.service";

import type { Tenant } from "@/services/tenancy/tenant.service";

import {
  listTenantMembershipRoles,
  listTenantMemberships,
} from "@/services/auth/ten_mem.service";

import styles from "./page.module.css";

const platformStats: PlatformStat[] = [
  {
    title: "Schools",
    value: "",
    icon: Building2,
    tone: "blue",
    trend: "up",
    change: "12%",
    changeLabel: "vs last month",
  },
  {
    title: "Active students",
    value: "",
    icon: GraduationCap,
    tone: "violet",
    trend: "up",
    change: "8.4%",
    changeLabel: "vs last month",
  },
  {
    title: "Monthly revenue",
    value: "30,000 ETB",
    icon: Wallet,
    tone: "orange",
    trend: "down",
    change: "2.1%",
    changeLabel: "vs last month",
  },
  {
    title: " System Up-time",
    value: "99.99%",
    icon: Users,
    tone: "green",
    trend: "up",
    change: "0.01%",
    changeLabel: "vs last month",
  },
];

const platformGrowth: PlatformGrowthData = {
  title: "Platform growth",
  subtitle: "Active students across all schools",
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  data: [35, 39, 37, 46, 44, 53],
  currentValue: "18,492",
  currentChange: "+8.4%",
};

const subscriptionPlans: SubscriptionPlan[] = [
  { name: "Enterprise", count: 13, percentage: 54, styleKey: "enterprise" },
  { name: "Growth", count: 8, percentage: 33, styleKey: "growth" },
  { name: "Starter", count: 3, percentage: 13, styleKey: "starter" },
];

const recentActivity: ActivityItem[] = [
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

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState<string | null>(null);
  const [activeStudentCount, setActiveStudentCount] = useState<number | null>(
    null,
  );
  const [studentsError, setStudentsError] = useState<string | null>(null);

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

  useEffect(() => {
    let active = true;
    Promise.all([
      listTenantMemberships({ status: "active" }),
      listTenantMembershipRoles(),
    ])
      .then(([{ memberships }, { roles }]) => {
        const studentRole = roles.find((role) => role.code === "student");
        if (!studentRole) {
          throw new Error("Student role was not found.");
        }
        if (active) {
          setActiveStudentCount(
            memberships.filter(
              (membership) => membership.roleId === studentRole.id,
            ).length,
          );
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStudentsError(
            error instanceof Error
              ? error.message
              : "Unable to load active student memberships.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.dashboardContent}>
      <DashboardHeader
        title="Super Admin Dashboard"
        subtitle="Here's what’s happening across your platform today."
        action={{
          href: "/super_admin/tenants?create=1",
          label: "Add a school",
        }}
        styles={styles}
      />

      <PlatformStats
        stats={platformStats.map((stat) =>
          stat.title === "Schools"
            ? {
                ...stat,
                value: tenantsLoading ? "—" : String(tenants.length),
              }
            : stat.title === "Active students"
              ? {
                  ...stat,
                  value:
                    activeStudentCount === null
                      ? "—"
                      : String(activeStudentCount),
                }
            : stat,
        )}
        styles={styles}
      />
      {studentsError && (
        <p className={styles.statsError} role="alert">
          Unable to load active students: {studentsError}
        </p>
      )}

      <section className={styles.analyticsGrid} id="analytics">
        <PlatformGrowth
          className={styles.growthChart}
          growth={platformGrowth}
        />

        <SubscriptionOverview
          total={subscriptionPlans.reduce(
            (total, plan) => total + plan.count,
            0,
          )}
          plans={subscriptionPlans}
          styles={styles}
        />
      </section>

      <section className={styles.bottomGrid}>
        <SchoolsTable
          tenants={tenants}
          loading={tenantsLoading}
          error={tenantsError}
          styles={styles}
        />

        <RecentActivity activities={recentActivity} styles={styles} />
      </section>

      <DashboardFooter styles={styles} />
    </div>
  );
}
