"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  GitBranch,
  LoaderCircle,
  MapPin,
  Pencil,
  Phone,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Branch, BranchStatus } from "@/services/tenancy/branch.service";

const statuses: BranchStatus[] = ["active", "inactive", "archived"];

const inputClass =
  "w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2.5 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15";

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function initials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function statusClass(status: BranchStatus, styles: Record<string, string>) {
  return `${styles.branchStatus} ${styles[`branchStatus_${status}`]}`;
}

export function TenantBranchDirectory({
  branches,
  loading,
  error,
  styles,
  onCreate,
  onEdit,
  onDelete,
  onRetry,
  onView,
}: {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  styles: Record<string, string>;
  onCreate: () => void;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onRetry: () => void;
  onView?: (branch: Branch) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BranchStatus>("all");
  const filteredBranches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return branches.filter((branch) => {
      const matchesStatus =
        statusFilter === "all" || branch.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          branch.name,
          branch.code,
          branch.email,
          branch.phone,
          branch.address,
          branch.timezone,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [branches, query, statusFilter]);

  return (
    <section className={`panel ${styles.directoryPanel}`}>
      <div className="panel-heading mb-5">
        <div>
          <h2>
            Branch directory
            <span className={styles.directoryCount}>
              {loading ? "…" : branches.length}
            </span>
          </h2>
          <p>Branch details, contact information, and status.</p>
        </div>
        <span className="text-xs text-(--muted)">
          {filteredBranches.length} of {branches.length} shown
        </span>
      </div>

      {error && (
        <div className={styles.directoryError} role="alert">
          <span>{error}</span>
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            disabled={loading}
          >
            {loading ? "Loading…" : "Try again"}
          </Button>
        </div>
      )}

      <div className={styles.directoryControls}>
        <label className={styles.searchControl}>
          <Search
            size={16}
            aria-hidden="true"
            className={styles.searchIcon}
          />
          <input
            className={inputClass}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by branch name, code, or contact"
            aria-label="Search branches"
          />
        </label>
        <label className={styles.filterControl}>
          <select
            className={inputClass}
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | BranchStatus)
            }
            aria-label="Filter branches by status"
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
            aria-hidden="true"
            className={styles.filterIcon}
          />
        </label>
      </div>

      {loading ? (
        <div className={styles.directoryLoading} role="status">
          <LoaderCircle size={22} className="animate-spin" />
          Loading branches…
        </div>
      ) : filteredBranches.length > 0 ? (
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th>Updated</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr
                  key={branch.id}
                  className={onView ? styles.branchRowInteractive : undefined}
                  onClick={(event) => {
                    if (
                      onView &&
                      !(event.target as HTMLElement).closest("button")
                    ) {
                      onView(branch);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (
                      onView &&
                      !(event.target as HTMLElement).closest("button") &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      onView(branch);
                    }
                  }}
                  tabIndex={onView ? 0 : undefined}
                  role={onView ? "link" : undefined}
                  aria-label={
                    onView ? `View ${branch.name} branch overview` : undefined
                  }
                >
                  <td>
                    <div className={styles.branchIdentity}>
                      <div className={styles.branchAvatar} aria-hidden="true">
                        {initials(branch.name)}
                      </div>
                      <div>
                        <strong>{branch.name}</strong>
                        <span>{branch.code}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.cellDetails}>
                      <span>{branch.email || "No email"}</span>
                      <span>
                        {branch.phone ? (
                          <>
                            <Phone size={12} aria-hidden="true" />
                            {branch.phone}
                          </>
                        ) : (
                          "No phone"
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.cellDetails}>
                      <span>{branch.address || "No address"}</span>
                      <span>
                        {branch.timezone ? (
                          <>
                            <MapPin size={12} aria-hidden="true" />
                            {branch.timezone}
                          </>
                        ) : (
                          "Timezone not set"
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={statusClass(branch.status, styles)}>
                      <i />
                      {branch.status}
                    </span>
                  </td>
                  <td className={styles.updatedCell}>
                    {formatUpdatedAt(branch.updatedAt)}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={styles.rowActionButton}
                        onClick={() => onEdit(branch)}
                        aria-label={`Edit ${branch.name}`}
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`${styles.rowActionButton} ${styles.rowActionDanger}`}
                        onClick={() => onDelete(branch)}
                        aria-label={`Delete ${branch.name}`}
                      >
                        <Trash2 size={15} />
                      </Button>
                      <ArrowRight
                        size={15}
                        className={styles.rowArrow}
                        aria-hidden="true"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.directoryEmpty}>
          <div className="metric-icon blue">
            <Search size={18} />
          </div>
          <h3>
            {branches.length === 0 ? "No branches yet" : "No branches found"}
          </h3>
          <p>
            {branches.length === 0
              ? "Create the first branch to start organizing this school into campuses and locations."
              : "Try another search or status filter."}
          </p>
          {branches.length === 0 && (
            <Button
              type="button"
              variant="link"
              className={styles.createFirstBranch}
              onClick={onCreate}
            >
              Create a branch <GitBranch size={15} />
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
