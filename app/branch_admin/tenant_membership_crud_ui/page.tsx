"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  KeyRound,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Footer } from "../../../components/ui/footer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
} from "../../../components/forms/Form";
import { Header } from "../../../components/ui/header";

const roles = [
  {
    code: "teacher",
    label: "Teacher",
    scope: "branch",
  },
  {
    code: "cashier-receptionist",
    label: "Cashier / Receptionist",
    scope: "branch",
  },
  {
    code: "parent-guardian",
    label: "Parent / Guardian",
    scope: "linked",
  },
] as const;

const membershipStatuses = [
  "invited",
  "active",
  "suspended",
  "revoked",
] as const;
type MembershipStatus = (typeof membershipStatuses)[number];
type RoleCode = (typeof roles)[number]["code"];

type Membership = {
  id: string;
  tenantId: string;
  tenantName: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleCode: RoleCode;
  branchId: string;
  branchName: string;
  billingEligible: boolean;
  status: MembershipStatus;
  updatedAt: string;
};

type MembershipForm = Omit<
  Membership,
  "id" | "tenantName" | "userName" | "userEmail" | "branchName" | "updatedAt"
>;

const tenants = [
  { id: "tenant-adams-hill", name: "Adams Hill Academy" },
  { id: "tenant-northfield", name: "Northfield Prep" },
  { id: "tenant-lakeside", name: "Lakeside International" },
];

const users = [
  { id: "user-jordan", name: "Jordan Miller", email: "jordan@adamshill.edu" },
  { id: "user-sarah", name: "Sarah Johnson", email: "sarah@adamshill.edu" },
  { id: "user-daniel", name: "Daniel Okafor", email: "daniel@northfield.edu" },
  { id: "user-maya", name: "Maya Chen", email: "maya@lakeside.edu" },
];

const branches = [
  {
    id: "branch-adams-main",
    tenantId: "tenant-adams-hill",
    name: "Main Campus",
  },
  {
    id: "branch-adams-junior",
    tenantId: "tenant-adams-hill",
    name: "Junior Campus",
  },
  {
    id: "branch-northfield-main",
    tenantId: "tenant-northfield",
    name: "Northfield Campus",
  },
  {
    id: "branch-lakeside-main",
    tenantId: "tenant-lakeside",
    name: "Lakeside Campus",
  },
];

const emptyMembership: MembershipForm = {
  tenantId: tenants[0].id,
  userId: users[0].id,
  roleCode: "teacher",
  branchId: "",
  billingEligible: true,
  status: "invited",
};

const demoMemberships: Membership[] = [
  {
    id: "membership-1",
    tenantId: "tenant-adams-hill",
    tenantName: "Adams Hill Academy",
    userId: "user-jordan",
    userName: "Jordan Miller",
    userEmail: "jordan@adamshill.edu",
    roleCode: "teacher",
    branchId: "",
    branchName: "All branches",
    billingEligible: true,
    status: "active",
    updatedAt: "Today, 09:20",
  },
  {
    id: "membership-2",
    tenantId: "tenant-adams-hill",
    tenantName: "Adams Hill Academy",
    userId: "user-sarah",
    userName: "Sarah Johnson",
    userEmail: "sarah@adamshill.edu",
    roleCode: "teacher",
    branchId: "branch-adams-main",
    branchName: "Main Campus",
    billingEligible: true,
    status: "active",
    updatedAt: "Yesterday, 14:35",
  },
  {
    id: "membership-3",
    tenantId: "tenant-northfield",
    tenantName: "Northfield Prep",
    userId: "user-daniel",
    userName: "Daniel Okafor",
    userEmail: "daniel@northfield.edu",
    roleCode: "teacher",
    branchId: "branch-northfield-main",
    branchName: "Northfield Campus",
    billingEligible: true,
    status: "invited",
    updatedAt: "Sep 09, 2026",
  },
  {
    id: "membership-4",
    tenantId: "tenant-lakeside",
    tenantName: "Lakeside International",
    userId: "user-maya",
    userName: "Maya Chen",
    userEmail: "maya@lakeside.edu",
    roleCode: "parent-guardian",
    branchId: "",
    branchName: "All branches",
    billingEligible: false,
    status: "suspended",
    updatedAt: "Sep 04, 2026",
  },
];

const inputClass =
  "w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2.5 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15";

function roleLabel(code: RoleCode) {
  return roles.find((role) => role.code === code)?.label ?? code;
}

function statusClass(status: MembershipStatus) {
  return `status ${status === "active" ? "paid" : status === "invited" ? "pending" : "neutral"}`;
}

function MembershipFormFields({
  form,
  errors,
  onChange,
}: {
  form: MembershipForm;
  errors: Partial<Record<keyof MembershipForm, string>>;
  onChange: <Key extends keyof MembershipForm>(
    key: Key,
    value: MembershipForm[Key],
  ) => void;
}) {
  const role = roles.find((item) => item.code === form.roleCode);
  const availableBranches = branches.filter(
    (branch) => branch.tenantId === form.tenantId,
  );

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Tenant"
          htmlFor="membership-tenant"
          error={errors.tenantId}
        >
          <FormControl>
            <select
              id="membership-tenant"
              className={inputClass}
              value={form.tenantId}
              onChange={(event) => {
                onChange("tenantId", event.target.value);
                onChange("branchId", "");
              }}
            >
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </FormControl>
        </FormField>
        <FormField label="User" htmlFor="membership-user" error={errors.userId}>
          <FormControl>
            <select
              id="membership-user"
              className={inputClass}
              value={form.userId}
              onChange={(event) => onChange("userId", event.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.email}
                </option>
              ))}
            </select>
          </FormControl>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Role"
          htmlFor="membership-role"
          error={errors.roleCode}
          description={role ? `Scope: ${role.scope}` : undefined}
        >
          <FormControl>
            <select
              id="membership-role"
              className={inputClass}
              value={form.roleCode}
              onChange={(event) => {
                onChange("roleCode", event.target.value as RoleCode);
                if (
                  roles.find((item) => item.code === event.target.value)
                    ?.scope !== "branch"
                )
                  onChange("branchId", "");
              }}
            >
              {roles.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </FormControl>
        </FormField>
        <FormField label="Membership status" htmlFor="membership-status">
          <FormControl>
            <select
              id="membership-status"
              className={inputClass}
              value={form.status}
              onChange={(event) =>
                onChange("status", event.target.value as MembershipStatus)
              }
            >
              {membershipStatuses.map((status) => (
                <option key={status} value={status}>
                  {status[0].toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </FormControl>
        </FormField>
      </div>

      <FormField
        label="Branch"
        htmlFor="membership-branch"
        error={errors.branchId}
        description={
          role?.scope === "branch"
            ? "Required for branch-scoped roles."
            : "Not used for tenant, platform, self, or linked roles."
        }
      >
        <FormControl>
          <select
            id="membership-branch"
            className={inputClass}
            value={form.branchId}
            disabled={role?.scope !== "branch"}
            onChange={(event) => onChange("branchId", event.target.value)}
          >
            <option value="">All branches / no branch</option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </FormControl>
      </FormField>

      <label className="flex items-start gap-3 rounded-xl border border-(--line) p-3">
        <input
          type="checkbox"
          checked={form.billingEligible}
          onChange={(event) =>
            onChange("billingEligible", event.target.checked)
          }
          className="mt-0.5 size-4 accent-(--blue)"
        />
        <span>
          <strong className="block text-sm font-medium">
            Billing eligible
          </strong>
          <span className="mt-1 block text-xs text-(--muted)">
            Include this membership in billable active-user counts.
          </span>
        </span>
      </label>
    </div>
  );
}

export default function TenantMembershipCrudPage() {
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>(demoMemberships);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MembershipStatus>(
    "all",
  );
  const [tenantFilter, setTenantFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MembershipForm>(emptyMembership);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MembershipForm, string>>
  >({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const filteredMemberships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return memberships.filter((membership) => {
      const matchesTenant =
        tenantFilter === "all" || membership.tenantId === tenantFilter;
      const matchesStatus =
        statusFilter === "all" || membership.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          membership.userName,
          membership.userEmail,
          membership.tenantName,
          roleLabel(membership.roleCode),
          membership.branchName,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesTenant && matchesStatus && matchesQuery;
    });
  }, [memberships, query, statusFilter, tenantFilter]);

  function action(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2800);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyMembership);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(membership: Membership) {
    const {
      id: _id,
      tenantName: _tenantName,
      userName: _userName,
      userEmail: _userEmail,
      branchName: _branchName,
      updatedAt: _updatedAt,
      ...editableFields
    } = membership;
    setEditingId(membership.id);
    setForm(editableFields);
    setErrors({});
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
    const role = roles.find((item) => item.code === form.roleCode);
    if (!form.tenantId) nextErrors.tenantId = "Select a tenant.";
    if (!form.userId) nextErrors.userId = "Select a user.";
    if (role?.scope === "branch" && !form.branchId)
      nextErrors.branchId = "A branch is required for this role.";
    if (role?.scope !== "branch" && form.branchId)
      nextErrors.branchId = "This role cannot be assigned to a branch.";
    const duplicate = memberships.some(
      (membership) =>
        membership.id !== editingId &&
        membership.tenantId === form.tenantId &&
        membership.userId === form.userId &&
        membership.roleCode === form.roleCode &&
        membership.branchId === form.branchId,
    );
    if (duplicate) nextErrors.userId = "This membership already exists.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    const tenant = tenants.find((item) => item.id === form.tenantId);
    const user = users.find((item) => item.id === form.userId);
    const branch = branches.find((item) => item.id === form.branchId);
    const nextMembership = {
      ...form,
      id: editingId ?? `membership-${Date.now()}`,
      tenantName: tenant?.name ?? "Unknown tenant",
      userName: user?.name ?? "Unknown user",
      userEmail: user?.email ?? "",
      branchName: branch?.name ?? "All branches",
      updatedAt: "Just now",
    };
    if (editingId) {
      setMemberships((current) =>
        current.map((membership) =>
          membership.id === editingId ? nextMembership : membership,
        ),
      );
      action(`${user?.name ?? "Membership"} updated`);
    } else {
      setMemberships((current) => [nextMembership, ...current]);
      action(`${user?.name ?? "Membership"} added`);
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleteId) return;
    const membership = memberships.find((item) => item.id === deleteId);
    setMemberships((current) => current.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    if (membership) action(`${membership.userName}'s membership removed`);
  }

  const deleteTarget = memberships.find(
    (membership) => membership.id === deleteId,
  );

  return (
    <main className={dark ? "app dark" : "app"}>
      <section className="workspace">
        <Header
          activeSection="Tenant memberships"
          dark={dark}
          profileOpen={profileOpen}
          schoolName="Xenon Platform"
          onAction={action}
          onMenuToggle={() =>
            action("Navigation is available from the platform dashboard")
          }
          onProfileToggle={() => setProfileOpen((current) => !current)}
          onSearchOpen={() => setSearchOpen(true)}
          onThemeToggle={() => setDark((current) => !current)}
        />
        <div className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Super admin · Access control</p>
              <h1>Tenant memberships</h1>
              <p className="subheading">
                Assign users to schools, roles, and branches across the Xenon
                platform.
              </p>
            </div>
            <Button onClick={openCreate}>
              <Plus size={16} /> New membership
            </Button>
          </div>

          <section className="metrics-grid mb-4">
            <article className="metric-card">
              <div className="metric-icon blue">
                <UserRound size={18} />
              </div>
              <div className="metric-copy">
                <span>Total memberships</span>
                <strong>{memberships.length}</strong>
                <small className="positive">
                  <Check size={12} /> Access records
                </small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon green">
                <KeyRound size={18} />
              </div>
              <div className="metric-copy">
                <span>Active access</span>
                <strong>
                  {
                    memberships.filter((item) => item.status === "active")
                      .length
                  }
                </strong>
                <small className="positive">Currently enabled</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon orange">
                <Clock3 size={18} />
              </div>
              <div className="metric-copy">
                <span>Invitations</span>
                <strong>
                  {
                    memberships.filter((item) => item.status === "invited")
                      .length
                  }
                </strong>
                <small className="negative">Awaiting acceptance</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon red">
                <CircleAlert size={18} />
              </div>
              <div className="metric-copy">
                <span>Restricted</span>
                <strong>
                  {
                    memberships.filter(
                      (item) =>
                        item.status === "suspended" ||
                        item.status === "revoked",
                    ).length
                  }
                </strong>
                <small className="negative">Review access</small>
              </div>
            </article>
          </section>

          <section className="panel">
            <div className="panel-heading mb-5">
              <div>
                <h2>All memberships</h2>
                <p>User access grouped by tenant and role scope.</p>
              </div>
              <span className="text-xs text-(--muted)">
                {filteredMemberships.length} of {memberships.length} shown
              </span>
            </div>
            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_12rem_12rem]">
              <label className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
                />
                <input
                  className={`${inputClass} pl-9`}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search users, tenants, roles"
                  aria-label="Search memberships"
                />
              </label>
              <label className="relative">
                <select
                  className={`${inputClass} appearance-none pr-9`}
                  value={tenantFilter}
                  onChange={(event) => setTenantFilter(event.target.value)}
                  aria-label="Filter by tenant"
                >
                  <option value="all">All tenants</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
                />
              </label>
              <label className="relative">
                <select
                  className={`${inputClass} appearance-none pr-9`}
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "all" | MembershipStatus,
                    )
                  }
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  {membershipStatuses.map((status) => (
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
            {filteredMemberships.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Tenant</th>
                      <th>Role / scope</th>
                      <th>Branch</th>
                      <th>Status</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMemberships.map((membership) => {
                      const role = roles.find(
                        (item) => item.code === membership.roleCode,
                      );
                      return (
                        <tr key={membership.id}>
                          <td>
                            <div className="person">
                              <div className="person-avatar teal">
                                {membership.userName
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <strong>{membership.userName}</strong>
                                <span>{membership.userEmail}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>{membership.tenantName}</span>
                          </td>
                          <td>
                            <div className="grid gap-1">
                              <span>{roleLabel(membership.roleCode)}</span>
                              <span className="text-xs text-(--muted)">
                                {role?.scope} scope
                                {membership.billingEligible
                                  ? " · billable"
                                  : ""}
                              </span>
                            </div>
                          </td>
                          <td className="text-xs text-(--muted)">
                            {membership.branchName}
                          </td>
                          <td>
                            <span className={statusClass(membership.status)}>
                              {membership.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex justify-end gap-1">
                              <button
                                className="icon-button subtle"
                                onClick={() => openEdit(membership)}
                                aria-label={`Edit ${membership.userName} membership`}
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                className="icon-button subtle text-(--red)"
                                onClick={() => setDeleteId(membership.id)}
                                aria-label={`Delete ${membership.userName} membership`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid justify-items-center gap-2 py-14 text-center">
                <div className="metric-icon blue">
                  <Search size={18} />
                </div>
                <h3 className="text-sm font-semibold">No memberships found</h3>
                <p className="max-w-sm text-xs text-(--muted)">
                  Try another filter or create a new access record.
                </p>
                <button className="text-button" onClick={openCreate}>
                  Create membership <ChevronRight size={15} />
                </button>
              </div>
            )}
          </section>
          <Footer year={2026} />
        </div>
      </section>

      {formOpen && (
        <div className="modal-backdrop" onClick={() => setFormOpen(false)}>
          <div
            className="search-modal max-w-2xl! p-0!"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-(--line) p-5">
              <div>
                <p className="eyebrow">
                  {editingId ? "Update record" : "New record"}
                </p>
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit membership" : "Create membership"}
                </h2>
                <p className="mt-1 text-xs text-(--muted)">
                  Role scope rules are checked before saving.
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <Form
              className="max-h-[70vh] overflow-y-auto p-5"
              onSubmit={submitForm}
            >
              <MembershipFormFields
                form={form}
                errors={errors}
                onChange={updateForm}
              />
              {Object.keys(errors).length > 0 && (
                <FormMessage>
                  Please correct the highlighted fields before saving.
                </FormMessage>
              )}
              <div className="flex justify-end gap-2 border-t border-(--line) pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Save changes" : "Create membership"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div
            className="search-modal max-w-md!"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="metric-icon red mb-4">
              <Trash2 size={18} />
            </div>
            <h2 className="text-lg font-semibold">
              Remove {deleteTarget.userName}&apos;s membership?
            </h2>
            <p className="mt-2 text-sm text-(--muted)">
              This revokes the access record from the current workspace. Use
              suspended or revoked status when you need an audit trail.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Remove membership
              </Button>
            </div>
          </div>
        </div>
      )}
      {searchOpen && (
        <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div
            className="search-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-search">
              <Search size={19} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search memberships..."
              />
              <kbd>ESC</kbd>
            </div>
            <div className="search-results">
              <p>Membership actions</p>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  openCreate();
                }}
              >
                <Plus size={16} />
                Create membership
                <ChevronRight size={15} />
              </button>
              <button onClick={() => setSearchOpen(false)}>
                <KeyRound size={16} />
                View access directory
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
          <button onClick={() => setNotice(null)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
    </main>
  );
}
