"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  KeyRound,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";

import { Footer } from "../../../components/ui/footer";

import {
  createTenantMembership,
  deleteTenantMembership,
  listTenantMembershipRoles,
  listTenantMemberships,
  updateTenantMembership,
} from "../../../services/auth/ten_mem.service";

import type {
  CreateTenantMembershipInput,
  TenantMembership,
  TenantMembershipRole,
  TenantMembershipStatus,
  UpdateTenantMembershipInput,
} from "../../../services/auth/ten_mem.service";

import { listBranches } from "../../../services/tenancy/branch.service";

import type { Branch } from "../../../services/tenancy/branch.service";

import { listTenants } from "../../../services/tenancy/tenant.service";

import type { Tenant } from "../../../services/tenancy/tenant.service";

import { listUsers } from "../../../services/auth/user.service";

import type { User } from "../../../services/auth/user.service";

import styles from "./page.module.css";

const statuses: TenantMembershipStatus[] = [
  "invited",
  "active",
  "suspended",
  "revoked",
];

type MembershipForm = {
  userId: string;
  tenantId: string;
  roleId: string;
  branchId: string;
  status: TenantMembershipStatus;
  billingEligible: boolean;
};

const emptyForm: MembershipForm = {
  userId: "",
  tenantId: "",
  roleId: "",
  branchId: "",
  status: "invited",
  billingEligible: true,
};

const inputClass =
  "w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2.5 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15";

function membershipStatusClass(status: TenantMembershipStatus) {
  return `status ${status === "active" ? "paid" : status === "invited" ? "pending" : "neutral"}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function userLabel(user: User) {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");
}

export default function TenantMembershipCrudPage() {
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<TenantMembershipRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | TenantMembershipStatus
  >("all");
  const [tenantFilter, setTenantFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MembershipForm>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MembershipForm, string>>
  >({});
  const [deleteTarget, setDeleteTarget] = useState<TenantMembership | null>(
    null,
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [membershipResult, userResult, tenantResult, roleResult] =
        await Promise.all([
          listTenantMemberships(),
          listUsers(),
          listTenants(),
          listTenantMembershipRoles(),
        ]);
      const branchResults = await Promise.all(
        tenantResult.tenants.map((tenant) =>
          listBranches({ tenantId: tenant.id }),
        ),
      );
      setMemberships(membershipResult.memberships);
      setUsers(userResult.users);
      setTenants(tenantResult.tenants);
      setBranches(branchResults.flatMap((result) => result.branches));
      setRoles(roleResult.roles.filter((role) => role.scope !== "platform"));
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load tenant memberships.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const visibleMemberships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return memberships.filter((membership) => {
      const user = users.find((item) => item.id === membership.userId);
      const tenant = tenants.find((item) => item.id === membership.tenantId);
      const branch = branches.find((item) => item.id === membership.branchId);
      const role = roles.find((item) => item.id === membership.roleId);
      const matchesTenant =
        tenantFilter === "all" || membership.tenantId === tenantFilter;
      const matchesStatus =
        statusFilter === "all" || membership.status === statusFilter;
      const searchable = [
        user ? userLabel(user) : membership.userId,
        user?.email ?? "",
        tenant?.displayName ?? membership.tenantId,
        branch?.name ?? "",
        role?.name ?? role?.code ?? membership.roleId,
      ];
      const matchesQuery =
        !normalizedQuery ||
        searchable.some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      return matchesTenant && matchesStatus && matchesQuery;
    });
  }, [
    branches,
    memberships,
    query,
    roles,
    statusFilter,
    tenantFilter,
    tenants,
    users,
  ]);

  const visibleUsers = useMemo(() => {
    const normalizedQuery = userQuery.trim().toLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) =>
      [userLabel(user), user.email, user.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [userQuery, users]);

  const activeCount = memberships.filter(
    (item) => item.status === "active",
  ).length;
  const invitedCount = memberships.filter(
    (item) => item.status === "invited",
  ).length;
  const branchScopedCount = memberships.filter(
    (item) => item.branchId !== null,
  ).length;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  }

  function openCreate(userId: string) {
    setEditingId(null);
    setErrors({});
    setForm({
      ...emptyForm,
      tenantId: tenants[0]?.id ?? "",
      userId,
      roleId:
        roles.find((role) => role.scope === "tenant")?.id ??
        roles.find((role) => role.scope === "branch")?.id ??
        "",
    });
    setFormOpen(true);
  }

  function openEdit(membership: TenantMembership) {
    setEditingId(membership.id);
    setErrors({});
    setForm({
      userId: membership.userId,
      tenantId: membership.tenantId,
      roleId: membership.roleId,
      branchId: membership.branchId ?? "",
      status: membership.status,
      billingEligible: membership.billingEligible,
    });
    setFormOpen(true);
  }

  function updateForm<Key extends keyof MembershipForm>(
    key: Key,
    value: MembershipForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof MembershipForm, string>> = {};
    const selectedRole = roles.find((role) => role.id === form.roleId);
    if (!form.userId) nextErrors.userId = "Select a user.";
    if (!form.tenantId) nextErrors.tenantId = "Select a tenant.";
    if (!selectedRole) nextErrors.roleId = "Select a role.";
    if (selectedRole?.scope === "branch" && !form.branchId) {
      nextErrors.branchId = "This role requires a branch assignment.";
    }
    if (selectedRole && selectedRole.scope !== "branch" && form.branchId) {
      nextErrors.branchId = "This role must be assigned at tenant level.";
    }
    const duplicate = memberships.some(
      (membership) =>
        membership.id !== editingId &&
        membership.userId === form.userId &&
        membership.tenantId === form.tenantId &&
        membership.roleId === form.roleId &&
        (membership.branchId ?? "") === form.branchId,
    );
    if (duplicate)
      nextErrors.userId = "This user already has this role assignment.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setLoadError(null);
    const input: CreateTenantMembershipInput = {
      userId: form.userId,
      tenantId: form.tenantId,
      roleId: form.roleId,
      branchId: form.branchId || null,
      status: form.status,
      billingEligible: form.billingEligible,
    };

    try {
      if (editingId) {
        const changes: UpdateTenantMembershipInput = input;
        await updateTenantMembership(editingId, changes);
        showNotice("Membership updated.");
      } else {
        await createTenantMembership(input);
        showNotice("Membership added.");
      }
      setFormOpen(false);
      await loadData();
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to save this membership.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setLoadError(null);
    try {
      await deleteTenantMembership(deleteTarget.id);
      setMemberships((current) =>
        current.filter((membership) => membership.id !== deleteTarget.id),
      );
      showNotice("Membership removed.");
      setDeleteTarget(null);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to delete this membership.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const selectedRole = roles.find((role) => role.id === form.roleId);
  const availableBranches = branches.filter(
    (branch) => branch.tenantId === form.tenantId,
  );
  const deleteUser = deleteTarget
    ? users.find((user) => user.id === deleteTarget.userId)
    : undefined;

  return (
    <div className={styles.membershipPage}>
      <div className="content">
        <header className={`page-heading ${styles.pageHeading}`}>
          <div>
            <p className={`eyebrow ${styles.pageEyebrow}`}>
              <ShieldCheck size={13} />
              Platform administration <span>/</span> Access control
            </p>
            <h1>Tenant memberships</h1>
            <p className="subheading">
              Assign users to school workspaces and, where their role requires
              it, to a specific branch.
            </p>
          </div>
        </header>

        {loadError && (
          <div className={styles.errorBanner} role="alert">
            <span>{loadError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              className={styles.retryButton}
            >
              <RefreshCw size={14} /> Retry
            </Button>
          </div>
        )}

        <section className={`metrics-grid mb-4 ${styles.metricsGrid}`}>
          <article className="metric-card">
            <div className="metric-icon blue">
              <UserRound size={18} />
            </div>
            <div className="metric-copy">
              <span>Total assignments</span>
              <strong>{loading ? "—" : memberships.length}</strong>
              <small>Users connected to tenants</small>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon green">
              <Check size={18} />
            </div>
            <div className="metric-copy">
              <span>Active memberships</span>
              <strong>{loading ? "—" : activeCount}</strong>
              <small>Access currently enabled</small>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon orange">
              <Clock3 size={18} />
            </div>
            <div className="metric-copy">
              <span>Invitations</span>
              <strong>{loading ? "—" : invitedCount}</strong>
              <small>Awaiting acceptance</small>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon red">
              <KeyRound size={18} />
            </div>
            <div className="metric-copy">
              <span>Branch assignments</span>
              <strong>{loading ? "—" : branchScopedCount}</strong>
              <small>Limited to a campus</small>
            </div>
          </article>
        </section>

        <section className={`panel ${styles.directoryPanel}`}>
          <div className={`panel-heading ${styles.panelHeading}`}>
            <div>
              <h2>
                Membership directory
                <span className={styles.directoryCount}>
                  {loading ? "…" : memberships.length}
                </span>
              </h2>
              <p>
                People, workspace, branch access, role, and membership status.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              disabled={loading}
              className={styles.refreshButton}
            >
              <RefreshCw size={14} className={loading ? styles.spinning : ""} />
              Refresh
            </Button>
          </div>

          <div className={styles.toolbar}>
            <label className={styles.searchControl}>
              <Search size={16} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search user, school, branch, or role"
                aria-label="Search memberships"
              />
            </label>
            <select
              className={styles.filterSelect}
              aria-label="Filter by tenant"
              value={tenantFilter}
              onChange={(event) => setTenantFilter(event.target.value)}
            >
              <option value="all">All tenants</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.displayName}
                </option>
              ))}
            </select>
            <select
              className={styles.filterSelect}
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | TenantMembershipStatus,
                )
              }
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status[0].toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Tenant</th>
                  <th>Branch</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Billing</th>
                  <th>Updated</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyState}>
                      <LoaderCircle size={20} className={styles.spinning} />
                      Loading membership records…
                    </td>
                  </tr>
                ) : visibleMemberships.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <UserRound size={20} />
                      </div>
                      <strong>
                        {memberships.length
                          ? "No matching assignments"
                          : "No memberships yet"}
                      </strong>
                      <span>
                        {memberships.length
                          ? "Try changing the search or filters."
                          : "Add a user to a tenant to get started."}
                      </span>
                    </td>
                  </tr>
                ) : (
                  visibleMemberships.map((membership) => {
                    const user = users.find(
                      (item) => item.id === membership.userId,
                    );
                    const tenant = tenants.find(
                      (item) => item.id === membership.tenantId,
                    );
                    const branch = branches.find(
                      (item) => item.id === membership.branchId,
                    );
                    const role = roles.find(
                      (item) => item.id === membership.roleId,
                    );
                    const displayName = user ? userLabel(user) : "Unknown user";
                    return (
                      <tr key={membership.id}>
                        <td>
                          <div className={styles.userCell}>
                            <span className={styles.avatar}>
                              {displayName
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                            <span className={styles.cellCopy}>
                              <strong>{displayName}</strong>
                              <small>{user?.email ?? membership.userId}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.primaryCell}>
                            {tenant?.displayName ?? "Unknown tenant"}
                          </span>
                          <span className={styles.secondaryCell}>
                            {tenant?.code ?? membership.tenantId}
                          </span>
                        </td>
                        <td>
                          <span className={styles.primaryCell}>
                            {branch?.name ??
                              (membership.branchId
                                ? "Unknown branch"
                                : "All branches")}
                          </span>
                          {branch && (
                            <span className={styles.secondaryCell}>
                              {branch.code}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={styles.rolePill}>
                            <ShieldCheck size={13} />
                            {role?.name ?? role?.code ?? "Unknown role"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={membershipStatusClass(membership.status)}
                          >
                            {membership.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              membership.billingEligible
                                ? styles.billingOn
                                : styles.billingOff
                            }
                          >
                            {membership.billingEligible ? "Eligible" : "Exempt"}
                          </span>
                        </td>
                        <td className={styles.dateCell}>
                          {formatDate(membership.updatedAt)}
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Edit ${displayName}'s membership`}
                              title="Edit membership"
                              onClick={() => openEdit(membership)}
                            >
                              <Pencil size={15} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Remove ${displayName}'s membership`}
                              title="Remove membership"
                              onClick={() => setDeleteTarget(membership)}
                              className={styles.deleteIcon}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.tableFooter}>
            <span>
              Showing {loading ? "—" : visibleMemberships.length} of{" "}
              {loading ? "—" : memberships.length} assignments
            </span>
            <span>
              Membership status and scope are enforced by the platform.
            </span>
          </div>
        </section>

        <section className={`panel ${styles.usersPanel}`}>
          <div className={`panel-heading ${styles.panelHeading}`}>
            <div>
              <h2>
                User directory
                <span className={styles.directoryCount}>
                  {loading ? "…" : users.length}
                </span>
              </h2>
              <p>Select a user to assign them tenant or branch access.</p>
            </div>
            <label className={styles.searchControl}>
              <Search size={16} aria-hidden="true" />
              <input
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                placeholder="Search users"
                aria-label="Search users"
              />
            </label>
          </div>

          {loading ? (
            <div className={styles.userListMessage}>
              <LoaderCircle size={18} className={styles.spinning} />
              Loading users…
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className={styles.userListMessage}>
              {users.length ? "No users match your search." : "No users found."}
            </div>
          ) : (
            <div className={styles.userList}>
              {visibleUsers.map((user) => {
                const displayName = userLabel(user) || user.email;
                return (
                  <button
                    key={user.id}
                    type="button"
                    className={styles.userOption}
                    onClick={() => openCreate(user.id)}
                    aria-label={`Add a membership for ${displayName}`}
                    disabled={!tenants.length || !roles.length}
                  >
                    <span className={styles.avatar}>
                      {displayName
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                    <span className={styles.cellCopy}>
                      <strong>{displayName}</strong>
                      <small>{user.email}</small>
                    </span>
                    <span className={styles.userStatus}>{user.status}</span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Footer />

      {notice && (
        <div className={styles.toast} role="status">
          <Check size={16} /> {notice}
        </div>
      )}

      {formOpen && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setFormOpen(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-form-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>
                  {editingId
                    ? "Update access assignment"
                    : "New access assignment"}
                </p>
                <h2 id="membership-form-title">
                  {editingId ? "Edit membership" : "Add membership"}
                </h2>
                <p>
                  Choose a tenant and grant the appropriate tenant-wide or
                  branch role for this user.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close dialog"
                onClick={() => setFormOpen(false)}
                disabled={saving}
              >
                <X size={18} />
              </Button>
            </header>
            <form className={styles.membershipForm} onSubmit={submitForm}>
              <div className={styles.formSection}>
                <h3>
                  <UserRound size={15} /> Who receives access?
                </h3>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span>User</span>
                    <select
                      className={inputClass}
                      value={form.userId}
                      onChange={(event) =>
                        updateForm("userId", event.target.value)
                      }
                      aria-invalid={Boolean(errors.userId)}
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {userLabel(user)} · {user.email}
                        </option>
                      ))}
                    </select>
                    {errors.userId && (
                      <small className={styles.fieldError}>
                        {errors.userId}
                      </small>
                    )}
                  </label>
                  <label className={styles.field}>
                    <span>Tenant / school</span>
                    <select
                      className={inputClass}
                      value={form.tenantId}
                      onChange={(event) => {
                        updateForm("tenantId", event.target.value);
                        updateForm("branchId", "");
                      }}
                      aria-invalid={Boolean(errors.tenantId)}
                    >
                      <option value="">Select a tenant</option>
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.displayName} · {tenant.code}
                        </option>
                      ))}
                    </select>
                    {errors.tenantId && (
                      <small className={styles.fieldError}>
                        {errors.tenantId}
                      </small>
                    )}
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>
                  <KeyRound size={15} /> Define access scope
                </h3>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span>Role</span>
                    <select
                      className={inputClass}
                      value={form.roleId}
                      onChange={(event) => {
                        const nextRole = roles.find(
                          (role) => role.id === event.target.value,
                        );
                        updateForm("roleId", event.target.value);
                        if (nextRole?.scope !== "branch")
                          updateForm("branchId", "");
                      }}
                      aria-invalid={Boolean(errors.roleId)}
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} · {role.scope}
                        </option>
                      ))}
                    </select>
                    {errors.roleId && (
                      <small className={styles.fieldError}>
                        {errors.roleId}
                      </small>
                    )}
                  </label>
                  <label className={styles.field}>
                    <span>
                      Branch{" "}
                      {selectedRole?.scope === "branch"
                        ? "(required)"
                        : "(not applicable)"}
                    </span>
                    <select
                      className={inputClass}
                      value={form.branchId}
                      onChange={(event) =>
                        updateForm("branchId", event.target.value)
                      }
                      disabled={
                        selectedRole?.scope !== "branch" || !form.tenantId
                      }
                      aria-invalid={Boolean(errors.branchId)}
                    >
                      <option value="">
                        {selectedRole?.scope === "branch"
                          ? "Select a branch"
                          : "Tenant-wide access"}
                      </option>
                      {availableBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} · {branch.code}
                        </option>
                      ))}
                    </select>
                    {errors.branchId && (
                      <small className={styles.fieldError}>
                        {errors.branchId}
                      </small>
                    )}
                  </label>
                </div>
                {selectedRole && (
                  <p className={styles.scopeHint}>
                    <ShieldCheck size={14} />
                    {selectedRole.description ||
                      (selectedRole.scope === "branch"
                        ? "This role is limited to the selected branch."
                        : "This role applies across the tenant and has no branch assignment.")}
                  </p>
                )}
              </div>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Membership status</span>
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value as TenantMembershipStatus,
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.billingToggle}>
                  <input
                    type="checkbox"
                    checked={form.billingEligible}
                    onChange={(event) =>
                      updateForm("billingEligible", event.target.checked)
                    }
                  />
                  <span>
                    <strong>Billing eligible</strong>
                    <small>Include this user in billable seat counts.</small>
                  </span>
                </label>
              </div>

              {loadError && (
                <p className={styles.formError} role="alert">
                  {loadError}
                </p>
              )}

              <footer className={styles.modalFooter}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    saving || !users.length || !tenants.length || !roles.length
                  }
                >
                  {saving ? (
                    <LoaderCircle size={15} className={styles.spinning} />
                  ) : (
                    <Check size={15} />
                  )}
                  {saving
                    ? "Saving…"
                    : editingId
                      ? "Save changes"
                      : "Create membership"}
                </Button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className={styles.modalBackdrop}>
          <section
            className={`${styles.modal} ${styles.confirmModal}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-membership-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Remove access</p>
                <h2 id="delete-membership-title">Delete membership?</h2>
                <p>
                  This will remove{" "}
                  {deleteUser ? userLabel(deleteUser) : "this user"}&apos;s
                  assignment from{" "}
                  {tenants.find((tenant) => tenant.id === deleteTarget.tenantId)
                    ?.displayName ?? "this tenant"}
                  .
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close dialog"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                <X size={18} />
              </Button>
            </header>
            {loadError && (
              <p className={styles.formError} role="alert">
                {loadError}
              </p>
            )}
            <footer className={styles.modalFooter}>
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => void confirmDelete()}
                disabled={deleting}
              >
                {deleting ? (
                  <LoaderCircle size={15} className={styles.spinning} />
                ) : (
                  <Trash2 size={15} />
                )}
                {deleting ? "Removing…" : "Remove membership"}
              </Button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
