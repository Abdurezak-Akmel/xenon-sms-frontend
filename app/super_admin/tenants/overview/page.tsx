"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CircleAlert,
  Clock3,
  Globe2,
  GitBranch,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { getTenant } from "@/services/tenant.service";
import type { Tenant } from "@/services/tenant.service";
import styles from "./page.module.css";

function initials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function statusClass(status: Tenant["status"]) {
  return `${styles.status} ${styles[`status_${status}`]}`;
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  icon?: typeof Mail;
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

function DataPanel({
  title,
  description,
  data,
  icon: Icon,
}: {
  title: string;
  description: string;
  data: Record<string, unknown>;
  icon: typeof ShieldCheck;
}) {
  const entries = Object.entries(data);
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}>
          <Icon size={17} />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {entries.length ? (
        <dl className={styles.dataList}>
          {entries.map(([key, value]) => (
            <div className={styles.dataRow} key={key}>
              <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
              <dd>
                {typeof value === "string"
                  ? value
                  : JSON.stringify(value) ?? "—"}
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

export default function TenantOverviewPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const tenantId = new URLSearchParams(window.location.search).get(
      "tenantId",
    );

    if (!tenantId) {
      setError("Choose a school from the directory to view its overview.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    getTenant(tenantId)
      .then(({ tenant: record }) => {
        if (active) setTenant(record);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load this school.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/super_admin/tenants" className={styles.backLink}>
          <ArrowLeft size={15} />
          Schools &amp; tenants
        </Link>

        {loading ? (
          <div className={styles.statePanel} role="status">
            <span className={styles.loader} />
            <strong>Loading school overview…</strong>
            <p>Fetching workspace details.</p>
          </div>
        ) : error || !tenant ? (
          <div className={styles.statePanel} role="alert">
            <span className={styles.errorIcon}>
              <CircleAlert size={20} />
            </span>
            <strong>School overview unavailable</strong>
            <p>{error ?? "This school could not be found."}</p>
            <Link href="/super_admin/tenants" className={styles.backButton}>
              Back to school directory
            </Link>
          </div>
        ) : (
          <>
            <header className={styles.hero}>
              <div className={styles.heroContent}>
                <p className={styles.eyebrow}>
                  <Building2 size={13} />
                  Workspace overview
                </p>
                <div className={styles.schoolHeading}>
                  <span className={styles.avatar}>
                    {initials(tenant.displayName)}
                  </span>
                  <div>
                    <h1>{tenant.displayName}</h1>
                    <p>{tenant.legalName}</p>
                  </div>
                </div>
                <div className={styles.heroMeta}>
                  <span className={styles.codeBadge}>{tenant.code}</span>
                  <span className={statusClass(tenant.status)}>
                    <i />
                    {tenant.status}
                  </span>
                </div>
                <Link
                  href={`/super_admin/tenants/overview/branches?tenantId=${encodeURIComponent(tenant.id)}`}
                  className={styles.branchesButton}
                >
                  <GitBranch size={15} />
                  Manage branches
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className={styles.heroMark} aria-hidden="true">
                <Building2 size={98} strokeWidth={1} />
              </div>
            </header>

            <section className={styles.summaryGrid} aria-label="School summary">
              <article className={styles.summaryCard}>
                <span className={`${styles.summaryIcon} ${styles.blue}`}>
                  <Globe2 size={18} />
                </span>
                <span>
                  <small>Country</small>
                  <strong>{tenant.countryCode || "Not set"}</strong>
                </span>
              </article>
              <article className={styles.summaryCard}>
                <span className={`${styles.summaryIcon} ${styles.green}`}>
                  <Wallet size={18} />
                </span>
                <span>
                  <small>Currency</small>
                  <strong>{tenant.currencyCode}</strong>
                </span>
              </article>
              <article className={styles.summaryCard}>
                <span className={`${styles.summaryIcon} ${styles.violet}`}>
                  <CalendarDays size={18} />
                </span>
                <span>
                  <small>Created</small>
                  <strong>{formatDate(tenant.createdAt)}</strong>
                </span>
              </article>
              <article className={styles.summaryCard}>
                <span className={`${styles.summaryIcon} ${styles.orange}`}>
                  <Clock3 size={18} />
                </span>
                <span>
                  <small>Last updated</small>
                  <strong>{formatDate(tenant.updatedAt)}</strong>
                </span>
              </article>
            </section>

            <div className={styles.detailsGrid}>
              <section className={styles.panel}>
                <div className={styles.panelHeading}>
                  <span className={styles.panelIcon}>
                    <Building2 size={17} />
                  </span>
                  <div>
                    <h2>Organization details</h2>
                    <p>Identity and contact information</p>
                  </div>
                </div>
                <div className={styles.detailList}>
                  <DetailItem label="Display name" value={tenant.displayName} />
                  <DetailItem label="Legal name" value={tenant.legalName} />
                  <DetailItem label="Tenant code" value={tenant.code} />
                  <DetailItem label="Email address" value={tenant.email} icon={Mail} />
                  <DetailItem label="Phone number" value={tenant.phone} icon={Phone} />
                  <DetailItem label="Address" value={tenant.address} icon={MapPin} />
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeading}>
                  <span className={styles.panelIcon}>
                    <Globe2 size={17} />
                  </span>
                  <div>
                    <h2>Regional settings</h2>
                    <p>Localization used across this workspace</p>
                  </div>
                </div>
                <div className={styles.detailList}>
                  <DetailItem
                    label="Country code"
                    value={tenant.countryCode}
                    icon={MapPin}
                  />
                  <DetailItem
                    label="Timezone"
                    value={tenant.timezone}
                    icon={Clock3}
                  />
                  <DetailItem
                    label="Currency"
                    value={tenant.currencyCode}
                    icon={Wallet}
                  />
                </div>
              </section>
            </div>

            <div className={styles.detailsGrid}>
              <DataPanel
                title="Workspace settings"
                description="Custom preferences configured for this school"
                data={tenant.settings}
                icon={Globe2}
              />
              <DataPanel
                title="Data retention"
                description="Retention policy configured for this workspace"
                data={tenant.retentionPolicy}
                icon={ShieldCheck}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}