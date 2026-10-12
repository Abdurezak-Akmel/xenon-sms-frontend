"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

type DashboardStyles = Record<string, string>;

export function SuperAdminDashboardHeader({
  styles,
}: {
  styles: DashboardStyles;
}) {
  return (
    <header className={styles.pageHeading}>
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
    </header>
  );
}
