"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  LoaderCircle,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Tenant, TenantStatus } from "@/services/tenancy/tenant.service";

const statuses: TenantStatus[] = [
  "pending",
  "active",
  "suspended",
  "closed",
  "archived",
];

const inputClass =
  "w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2.5 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15";

function statusClass(status: TenantStatus) {
  return `status ${status === "active" ? "paid" : status === "pending" ? "pending" : "neutral"}`;
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export function TenantDirectory({
  tenants,
  filteredTenants,
  loading,
  loadError,
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
  onRetry,
  onEdit,
  onDelete,
  onCreate,
  styles,
}: {
  tenants: Tenant[];
  filteredTenants: Tenant[];
  loading: boolean;
  loadError: string | null;
  query: string;
  statusFilter: "all" | TenantStatus;
  onQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | TenantStatus) => void;
  onRetry: () => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  styles: Record<string, string>;
}) {
  return (
    <section className={`panel ${styles.directoryPanel}`}>
      <div className="panel-heading mb-5">
        <div>
          <h2>
            School directory
            <span className={styles.directoryCount}>
              {loading ? "…" : tenants.length}
            </span>
          </h2>
          <p>Organization details, contact information, and status.</p>
        </div>
        <span className="text-xs text-(--muted)">
          {filteredTenants.length} of {tenants.length} shown
        </span>
      </div>

      {loadError && (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--red)/25 bg-(--red)/5 px-4 py-3 text-sm text-(--red)"
          role="alert"
        >
          <span>{loadError}</span>
          <Button
            type="button"
            variant="outline"
            className={styles.retryButton}
            onClick={onRetry}
            disabled={loading}
          >
            {loading ? "Loading…" : "Try again"}
          </Button>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <label className={`relative flex-1 ${styles.searchControl}`}>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
          />
          <input
            className={`${inputClass} pl-9`}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by code, name, or email"
            aria-label="Search tenants"
          />
        </label>
        <label className={`relative md:w-48 ${styles.filterControl}`}>
          <select
            className={`${inputClass} appearance-none pr-9`}
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as "all" | TenantStatus)
            }
            aria-label="Filter tenants by status"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status[0].toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
          />
        </label>
      </div>

      {loading ? (
        <div
          className="grid justify-items-center gap-3 py-16 text-center text-sm text-(--muted)"
          role="status"
        >
          <LoaderCircle size={22} className="animate-spin text-(--blue)" />
          Loading school workspaces…
        </div>
      ) : filteredTenants.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Contact</th>
                <th>Region</th>
                <th>Status</th>
                <th>Updated</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>
                    <Link
                      href={`/super_admin/tenants/overview?tenantId=${encodeURIComponent(tenant.id)}`}
                      className={styles.tenantIdentityLink}
                      aria-label={`View ${tenant.displayName} overview`}
                    >
                      <div className="person">
                        <div className="person-avatar teal">
                          {tenant.code.slice(0, 2)}
                        </div>
                        <div>
                          <strong>{tenant.displayName}</strong>
                          <span>
                            {tenant.code} · {tenant.legalName}
                          </span>
                        </div>
                        <ArrowRight
                          size={15}
                          className={styles.identityArrow}
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div className="grid gap-1">
                      <span>{tenant.email || "No email"}</span>
                      <span className="text-xs text-(--muted)">
                        {tenant.phone || "No phone"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="grid gap-1">
                      <span>
                        {tenant.countryCode || "No country"} ·{" "}
                        {tenant.currencyCode}
                      </span>
                      <span className="text-xs text-(--muted)">
                        {tenant.timezone}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={statusClass(tenant.status)}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="text-xs text-(--muted)">
                    {formatUpdatedAt(tenant.updatedAt)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="icon-button subtle"
                        onClick={() => onEdit(tenant)}
                        aria-label={`Edit ${tenant.displayName}`}
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="icon-button subtle text-(--red)"
                        onClick={() => onDelete(tenant.id)}
                        aria-label={`Delete ${tenant.displayName}`}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid justify-items-center gap-2 py-14 text-center">
          <div className="metric-icon blue">
            <Search size={18} />
          </div>
          <h3 className="text-sm font-semibold">
            {tenants.length === 0 ? "No schools yet" : "No schools found"}
          </h3>
          <p className="max-w-sm text-xs text-(--muted)">
            {tenants.length === 0
              ? "Add your first school workspace to start building your platform directory."
              : "Try another search or status filter."}
          </p>
          {tenants.length === 0 && (
            <Button
              type="button"
              variant="link"
              className="gap-1 text-(--blue)"
              onClick={onCreate}
            >
              Add a school <ArrowRight size={15} />
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
