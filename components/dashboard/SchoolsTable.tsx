"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardPanel } from "./DashboardPanel";

type DashboardStyles = Record<string, string>;

export type SchoolRow = {
  id: string;
  displayName: string;
  legalName: string;
  code: string;
  address: string | null;
  countryCode: string | null;
  status: string;
};

function schoolInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SchoolsTable({
  tenants,
  loading,
  error,
  styles,
}: {
  tenants: SchoolRow[];
  loading: boolean;
  error: string | null;
  styles: DashboardStyles;
}) {
  return (
    <DashboardPanel
      className={styles.contentPanel}
      headingClassName={styles.panelHeading}
      title="Schools"
      subtitle="A quick look at your school workspaces"
      action={
        <Link href="/super_admin/tenants" className={styles.textLink}>
          View all <ArrowRight size={14} />
        </Link>
      }
    >
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
    </DashboardPanel>
  );
}
