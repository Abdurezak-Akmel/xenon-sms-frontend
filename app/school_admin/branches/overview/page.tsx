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

import { TenantPageHeader } from "@/components/tenants/TenantPageHeader";

import { TenantStatsCards } from "@/components/tenants/TenantStatsCards";

import { TenantOverviewPanels } from "@/components/tenants/TenantOverviewPanels";

import { getTenant } from "@/services/tenancy/tenant.service";

import type { Tenant } from "@/services/tenancy/tenant.service";

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

function statusClass(status: Tenant["status"]) {
  return `${styles.status} ${styles[`status_${status}`]}`;
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
            <TenantPageHeader
              styles={styles}
              className={styles.hero}
              contentClassName={styles.heroContent}
              eyebrowClassName={styles.eyebrow}
              eyebrow="Platform administration / Schools / Workspace overview"
              icon={Building2}
              title={tenant.displayName}
              subtitle={tenant.legalName}
              details={
                <div className={styles.heroMeta}>
                  <span className={styles.codeBadge}>{tenant.code}</span>
                  <span className={statusClass(tenant.status)}>
                    <i />
                    {tenant.status}
                  </span>
                </div>
              }
              action={
                <Link
                  href={`/super_admin/tenants/overview/branches?tenantId=${encodeURIComponent(tenant.id)}`}
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
              stats={[
                {
                  label: "Country",
                  value: tenant.countryCode || "Not set",
                  helper: "Workspace location",
                  tone: "blue",
                  helperTone: "positive",
                  icon: Globe2,
                },
                {
                  label: "Currency",
                  value: tenant.currencyCode,
                  helper: "Default currency",
                  tone: "green",
                  helperTone: "positive",
                  icon: Wallet,
                },
                {
                  label: "Created",
                  value: formatDate(tenant.createdAt),
                  helper: "Workspace created",
                  tone: "orange",
                  helperTone: "positive",
                  icon: CalendarDays,
                },
                {
                  label: "Last updated",
                  value: formatDate(tenant.updatedAt),
                  helper: "Most recent change",
                  tone: "blue",
                  helperTone: "positive",
                  icon: Clock3,
                },
              ]}
            />

            <TenantOverviewPanels
              tenant={tenant}
              styles={styles}
              icons={{
                organization: Building2,
                regional: Globe2,
                email: Mail,
                phone: Phone,
                address: MapPin,
                country: MapPin,
                timezone: Clock3,
                currency: Wallet,
                settings: Globe2,
                retention: ShieldCheck,
              }}
            />
          </>
        )}
      </div>
    </main>
  );
}
