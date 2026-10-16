"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CircleAlert,
  Clock3,
  GitBranch,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { TenantPageHeader } from "@/components/tenants/TenantPageHeader";
import { TenantStatsCards } from "@/components/tenants/TenantStatsCards";
import { getAuthenticatedTenantId } from "@/services/auth/user.service";
import { getBranch } from "@/services/tenancy/branch.service";
import type { Branch, BranchStatus } from "@/services/tenancy/branch.service";

import styles from "./page.module.css";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function statusClass(status: BranchStatus) {
  return `${styles.status} ${styles[`status_${status}`]}`;
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null;
  icon?: LucideIcon;
}) {
  return (
    <div className={styles.detailItem}>
      {Icon && (
        <span className={styles.detailIcon}>
          <Icon size={15} />
        </span>
      )}
      <span className={styles.detailCopy}>
        <small>{label}</small>
        <strong>{value?.trim() || "Not provided"}</strong>
      </span>
    </div>
  );
}

function SettingsPanel({ branch }: { branch: Branch }) {
  const settings = Object.entries(branch.settings ?? {});

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}>
          <ShieldCheck size={17} />
        </span>
        <div>
          <h2>Branch settings</h2>
          <p>Custom preferences configured for this branch</p>
        </div>
      </div>
      {settings.length ? (
        <dl className={styles.dataList}>
          {settings.map(([key, value]) => (
            <div className={styles.dataRow} key={key}>
              <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
              <dd>
                {typeof value === "string"
                  ? value
                  : (JSON.stringify(value) ?? "—")}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={styles.emptyData}>No custom settings configured.</p>
      )}
    </section>
  );
}

export default function BranchOverviewPage() {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const branchId = params.get("branchId");
    const requestedTenantId = params.get("tenantId");

    try {
      const tenantId = getAuthenticatedTenantId();
      if (!branchId || !requestedTenantId) {
        setError("Choose a branch from your school’s directory to view its overview.");
        setLoading(false);
        return () => {
          active = false;
        };
      }
      if (requestedTenantId !== tenantId) {
        setError("This branch does not belong to your signed-in school.");
        setLoading(false);
        return () => {
          active = false;
        };
      }

      getBranch(branchId, tenantId)
        .then(({ branch: record }) => {
          if (!active) return;
          if (record.tenantId !== tenantId) {
            setError("This branch does not belong to your signed-in school.");
            return;
          }
          setBranch(record);
        })
        .catch((requestError: unknown) => {
          if (active) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "Unable to load this branch.",
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to identify your signed-in school.",
      );
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/school_admin/branches" className={styles.backLink}>
          <ArrowLeft size={15} />
          School branches
        </Link>

        {loading ? (
          <div className={styles.statePanel} role="status">
            <span className={styles.loader} />
            <strong>Loading branch overview…</strong>
            <p>Fetching branch details.</p>
          </div>
        ) : error || !branch ? (
          <div className={styles.statePanel} role="alert">
            <span className={styles.errorIcon}>
              <CircleAlert size={20} />
            </span>
            <strong>Branch overview unavailable</strong>
            <p>{error ?? "This branch could not be found."}</p>
            <Link href="/school_admin/branches" className={styles.backButton}>
              Back to school branches
            </Link>
          </div>
        ) : (
          <>
            <TenantPageHeader
              styles={styles}
              className={styles.hero}
              contentClassName={styles.heroContent}
              eyebrowClassName={styles.eyebrow}
              eyebrow="School administration / Branches / Overview"
              icon={GitBranch}
              title={branch.name}
              subtitle={branch.address || "Branch details and contact information"}
              details={
                <div className={styles.heroMeta}>
                  <span className={styles.codeBadge}>{branch.code}</span>
                  <span className={statusClass(branch.status)}>
                    <i />
                    {branch.status}
                  </span>
                </div>
              }
              action={
                <Link
                  href="/school_admin/branches"
                  className={styles.branchesButton}
                >
                  <GitBranch size={15} />
                  Manage branches
                  <ArrowRight size={14} />
                </Link>
              }
              decoration={
                <div className={styles.heroMark} aria-hidden="true">
                  <Building2 size={98} strokeWidth={1} />
                </div>
              }
            />

            <TenantStatsCards
              className={styles.summaryGrid}
              loading={false}
              ariaLabel="Branch summary"
              stats={[
                {
                  label: "Branch status",
                  value: branch.status,
                  helper: "Current operating state",
                  tone: branch.status === "active" ? "green" : "orange",
                  icon: GitBranch,
                },
                {
                  label: "Timezone",
                  value: branch.timezone || "Not set",
                  helper: "Local branch timezone",
                  tone: "blue",
                  icon: Globe2,
                },
                {
                  label: "Created",
                  value: formatDate(branch.createdAt),
                  helper: "Branch created",
                  tone: "orange",
                  icon: CalendarDays,
                },
                {
                  label: "Last updated",
                  value: formatDate(branch.updatedAt),
                  helper: "Most recent change",
                  tone: "blue",
                  icon: Clock3,
                },
              ]}
            />

            <div className={styles.detailsGrid}>
              <section className={styles.panel}>
                <div className={styles.panelHeading}>
                  <span className={styles.panelIcon}>
                    <Building2 size={17} />
                  </span>
                  <div>
                    <h2>Branch details</h2>
                    <p>Identity, location, and contact information</p>
                  </div>
                </div>
                <div className={styles.detailList}>
                  <DetailItem label="Branch name" value={branch.name} />
                  <DetailItem label="Branch code" value={branch.code} />
                  <DetailItem
                    label="Email address"
                    value={branch.email}
                    icon={Mail}
                  />
                  <DetailItem
                    label="Phone number"
                    value={branch.phone}
                    icon={Phone}
                  />
                  <DetailItem
                    label="Address"
                    value={branch.address}
                    icon={MapPin}
                  />
                  <DetailItem
                    label="Timezone"
                    value={branch.timezone}
                    icon={Clock3}
                  />
                </div>
              </section>
              <SettingsPanel branch={branch} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
