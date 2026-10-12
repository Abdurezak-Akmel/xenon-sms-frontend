"use client";

import Link from "next/link";
import { Activity, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DashboardPanel } from "./DashboardPanel";

type DashboardStyles = Record<string, string>;

export type ActivityItem = {
  icon: LucideIcon;
  tone: "blue" | "green" | "orange" | "red" | "violet" | "teal";
  title: string;
  detail: string;
  time: string;
};

export function RecentActivity({
  activities,
  styles,
}: {
  activities: ActivityItem[];
  styles: DashboardStyles;
}) {
  return (
    <DashboardPanel
      className={styles.contentPanel}
      headingClassName={styles.panelHeading}
      id="activity"
      title="Recent activity"
      subtitle="Latest updates across your platform"
      action={
        <Link href="/super_admin/tenant_membership" className={styles.textLink}>
          View log <ArrowRight size={14} />
        </Link>
      }
    >
      <div className={styles.activityList}>
        {activities.map(({ icon: Icon, tone, title, detail, time }) => (
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
    </DashboardPanel>
  );
}
