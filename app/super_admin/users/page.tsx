"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { FormEvent } from "react";

import {
  Check,
  LockKeyhole,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  ConfirmModal,
  Modal,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";

import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Footer } from "@/components/ui/footer";


import {
  listTenantMembershipRoles,
  listTenantMemberships,
} from "@/services/auth/ten_mem.service";
import type {
  TenantMembership,
  TenantMembershipRole,
} from "@/services/auth/ten_mem.service";

import {
  deleteUser,
  listUsers,
  updateUser,
} from "@/services/auth/user.service";

import type { User, UserStatus } from "@/services/auth/user.service";

import { listBranches } from "@/services/tenancy/branch.service";

import type { Branch } from "@/services/tenancy/branch.service";

import { listTenants } from "@/services/tenancy/tenant.service";

import type { Tenant } from "@/services/tenancy/tenant.service";

import styles from "./page.module.css";

const userStatuses: UserStatus[] = [
  "pending",
  "active",
  "inactive",
  "locked",
  "archived",
];

type UserForm = {
  globalRoleId: string;
  status: UserStatus;
};

function userName(user: User) {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function statusClass(status: string) {
  return `${styles.status} ${styles[`status_${status}`] ?? ""}`;
}

function isSuperAdmin(user: User, rolesById: Map<string, TenantMembershipRole>) {
  const roleCode = rolesById
    .get(user.globalRoleId ?? "")
    ?.code.toLowerCase()
    .replace(/[-_]/g, "");
  const metadataRoleCode =
    typeof user.metadata.roleCode === "string"
      ? user.metadata.roleCode.toLowerCase().replace(/[-_]/g, "")
      : "";
  return roleCode === "superadmin" || metadataRoleCode === "superadmin";
}

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<TenantMembershipRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({
    globalRoleId: "",
    status: "active",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [userResult, membershipResult, tenantResult, roleResult] =
        await Promise.all([
          listUsers(),
          listTenantMemberships(),
          listTenants(),
          listTenantMembershipRoles(),
        ]);
      const branchResults = await Promise.all(
        tenantResult.tenants.map((tenant) =>
          listBranches({ tenantId: tenant.id }),
        ),
      );

      setUsers(userResult.users);
      setMemberships(membershipResult.memberships);
      setTenants(tenantResult.tenants);
      setBranches(branchResults.flatMap((result) => result.branches));
      setRoles(roleResult.roles);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const rolesById = useMemo(
    () => new Map(roles.map((role) => [role.id, role])),
    [roles],
  );
  const tenantsById = useMemo(
    () => new Map(tenants.map((tenant) => [tenant.id, tenant])),
    [tenants],
  );
  const branchesById = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch])),
    [branches],
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (!normalizedQuery) return true;
      const userMemberships = memberships.filter(
        (membership) => membership.userId === user.id,
      );
      const searchable = [
        userName(user),
        user.email,
        user.phone ?? "",
        user.id,
        rolesById.get(user.globalRoleId ?? "")?.name ?? "",
        ...userMemberships.flatMap((membership) => [
          tenantsById.get(membership.tenantId)?.displayName ?? "",
          branchesById.get(membership.branchId ?? "")?.name ?? "",
          rolesById.get(membership.roleId)?.name ?? "",
          membership.status,
        ]),
      ];
      return searchable.some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [
    branchesById,
    memberships,
    query,
    rolesById,
    statusFilter,
    tenantsById,
    users,
  ]);

  const activeUsers = users.filter((user) => user.status === "active").length;
  const usersWithMemberships = new Set(
    memberships.map((membership) => membership.userId),
  ).size;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  }

  function openEdit(user: User) {
    if (isSuperAdmin(user, rolesById)) return;
    setEditingUser(user);
    setForm({
      globalRoleId: user.globalRoleId ?? "",
      status: user.status,
    });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingUser || isSuperAdmin(editingUser, rolesById)) return;
    setSaving(true);
    setLoadError(null);
    try {
      const response = await updateUser(editingUser.id, {
        globalRoleId: form.globalRoleId || null,
        status: form.status,
      });
      setUsers((current) =>
        current.map((user) =>
          user.id === response.user.id ? response.user : user,
        ),
      );
      setEditingUser(null);
      showNotice(`${userName(response.user)} updated.`);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to update this user.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deletingUser || isSuperAdmin(deletingUser, rolesById)) return;
    setDeleting(true);
    setLoadError(null);
    try {
      await deleteUser(deletingUser.id);
      setUsers((current) =>
        current.filter((user) => user.id !== deletingUser.id),
      );
      setMemberships((current) =>
        current.filter((membership) => membership.userId !== deletingUser.id),
      );
      showNotice(`${userName(deletingUser) || deletingUser.email} deleted.`);
      setDeletingUser(null);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to delete this user.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const assignableRoles = roles.filter(
    (role) => role.scope === "platform" || role.scope === "self",
  );
  const currentRoleIsAssignable = assignableRoles.some(
    (role) => role.id === form.globalRoleId,
  );
  const currentRole =
    editingUser?.globalRoleId && rolesById.get(editingUser.globalRoleId);

  return (
    <div className={styles.usersPage}>
      <div className="content">
        <header className={`page-heading ${styles.pageHeading}`}>
          <div>
            <p className={`eyebrow ${styles.pageEyebrow}`}>
              <ShieldCheck size={13} />
              Platform administration <span>/</span> User management
            </p>
            <h1>Users</h1>
            <p className="subheading">
              Review platform accounts, global access, and tenant or branch
              memberships in one place.
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
              <UsersRound size={18} />
            </div>
            <div className="metric-copy">
              <span>Total users</span>
              <strong>{loading ? "—" : users.length}</strong>
              <small>All platform accounts</small>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon green">
              <Check size={18} />
            </div>
            <div className="metric-copy">
              <span>Active users</span>
              <strong>{loading ? "—" : activeUsers}</strong>
              <small>Currently enabled accounts</small>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon violet">
              <UserRound size={18} />
            </div>
            <div className="metric-copy">
              <span>With memberships</span>
              <strong>{loading ? "—" : usersWithMemberships}</strong>
              <small>Connected to a tenant</small>
            </div>
          </article>
        </section>

        <section className={`panel ${styles.directoryPanel}`}>
          <div className={`panel-heading ${styles.panelHeading}`}>
            <div>
              <h2>
                User directory
                <span className={styles.directoryCount}>
                  {loading ? "…" : filteredUsers.length}
                </span>
              </h2>
              <p>
                Super-admin accounts are protected. For other users, update
                global role or status, or remove the account.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              disabled={loading}
              className={styles.refreshButton}
            >
              <RefreshCw
                size={14}
                className={loading ? styles.spinning : ""}
              />
              Refresh
            </Button>
          </div>

          <div className={styles.toolbar}>
            <label className={styles.searchControl}>
              <Search size={16} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, tenant, or branch"
                aria-label="Search users"
              />
            </label>
            <select
              className={styles.filterSelect}
              aria-label="Filter users by status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | UserStatus)
              }
            >
              <option value="all">All statuses</option>
              {userStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <Table className={styles.usersTable}>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Global role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Memberships / tenant / branch</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableEmpty
                  colSpan={6}
                  title="Loading users"
                  description="Retrieving users and their access assignments."
                />
              ) : filteredUsers.length === 0 ? (
                <TableEmpty
                  colSpan={6}
                  title="No users found"
                  description="Try changing your search or status filter."
                  icon={<UsersRound size={24} />}
                />
              ) : (
                filteredUsers.map((user) => {
                  const userMemberships = memberships.filter(
                    (membership) => membership.userId === user.id,
                  );
                  const globalRole = rolesById.get(user.globalRoleId ?? "");
                  const protectedUser = isSuperAdmin(user, rolesById);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className={styles.userCell}>
                        <strong>{userName(user) || "Unnamed user"}</strong>
                        <span>{user.email}</span>
                        {user.phone && <span>{user.phone}</span>}
                      </TableCell>
                      <TableCell>
                        {globalRole ? (
                          <span className={styles.roleBadge}>
                            {globalRole.name}
                          </span>
                        ) : (
                          <span className={styles.mutedValue}>No global role</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={statusClass(user.status)}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className={styles.membershipCell}>
                        {userMemberships.length ? (
                          userMemberships.map((membership) => {
                            const tenant = tenantsById.get(membership.tenantId);
                            const branch = branchesById.get(
                              membership.branchId ?? "",
                            );
                            const role = rolesById.get(membership.roleId);
                            return (
                              <div
                                className={styles.membershipItem}
                                key={membership.id}
                              >
                                <strong>
                                  {tenant?.displayName ?? "Unknown tenant"}
                                </strong>
                                <span>
                                  {role?.name ?? "Unknown role"}
                                  {branch ? ` · ${branch.name}` : " · All branches"}
                                </span>
                                <span className={statusClass(membership.status)}>
                                  {membership.status}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <span className={styles.mutedValue}>
                            No tenant membership
                          </span>
                        )}
                      </TableCell>
                      <TableCell className={styles.dateCell}>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={styles.rowActions}>
                          {protectedUser ? (
                            <span className={styles.protectedLabel}>
                              <LockKeyhole size={13} />
                              Protected
                            </span>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className={styles.editButton}
                                onClick={() => openEdit(user)}
                                aria-label={`Edit ${userName(user) || user.email}`}
                              >
                                <Pencil size={13} />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className={styles.deleteButton}
                                onClick={() => setDeletingUser(user)}
                                aria-label={`Delete ${userName(user) || user.email}`}
                              >
                                <Trash2 size={13} />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </section>
        <Footer year={2026} />
      </div>

      <Modal
        isOpen={editingUser !== null}
        onClose={() => {
          if (!saving) setEditingUser(null);
        }}
        size="lg"
        title="Edit user access"
        description="Only global role and account status are editable here. Super-admin accounts are protected."
        closeOnBackdropClick={!saving}
        closeOnEscape={!saving}
      >
        {editingUser && !isSuperAdmin(editingUser, rolesById) && (
          <form onSubmit={submitForm}>
            <ModalBody className={styles.formBody}>
              <div className={styles.readOnlySummary}>
                <div className={styles.avatar}>
                  {userName(editingUser).slice(0, 1).toUpperCase() || "U"}
                </div>
                <div>
                  <strong>{userName(editingUser)}</strong>
                  <span>{editingUser.email}</span>
                  <small>Other profile fields cannot be changed here.</small>
                </div>
              </div>

              <label className={styles.formField}>
                <span>Global role</span>
                <select
                  value={form.globalRoleId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      globalRoleId: event.target.value,
                    }))
                  }
                >
                  <option value="">No global role</option>
                  {!currentRoleIsAssignable && currentRole && (
                    <option value={currentRole.id}>
                      {currentRole.name} (current assignment)
                    </option>
                  )}
                  {assignableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <small>Platform-level or general account access.</small>
              </label>

              <label className={styles.formField}>
                <span>Account status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as UserStatus,
                    }))
                  }
                >
                  {userStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
                disabled={saving}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? (
                  <>
                    <RefreshCw size={14} className={styles.spinning} />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Save changes
                  </>
                )}
              </Button>
            </ModalFooter>
          </form>
        )}
      </Modal>

      <ConfirmModal
        isOpen={deletingUser !== null}
        onClose={() => {
          if (!deleting) setDeletingUser(null);
        }}
        onConfirm={() => void confirmDelete()}
        title={`Delete ${deletingUser ? userName(deletingUser) || deletingUser.email : "user"}?`}
        description="This permanently deletes the user account. This action cannot be undone."
        confirmText="Delete user"
        isLoading={deleting}
      />

      {notice && (
        <div className="toast" role="status">
          <Check size={16} />
          {notice}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
          >
            <X size={15} />
          </Button>
        </div>
      )}
    </div>
  );
}