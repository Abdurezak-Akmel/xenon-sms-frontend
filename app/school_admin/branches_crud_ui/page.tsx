"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Pencil,
  Plus,
  Search,
  Trash2,
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

const statuses = ["active", "inactive", "archived"] as const;
type BranchStatus = (typeof statuses)[number];

type Branch = {
  id: string;
  tenantId: string;
  tenantName: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  status: BranchStatus;
  updatedAt: string;
};

type BranchForm = Omit<Branch, "id" | "tenantName" | "updatedAt">;

const tenants = [
  { id: "tenant-adams-hill", name: "Adams Hill Academy" },
  { id: "tenant-northfield", name: "Northfield Prep" },
  { id: "tenant-lakeside", name: "Lakeside International" },
];

const emptyBranch: BranchForm = {
  tenantId: tenants[0].id,
  code: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  timezone: "Africa/Addis_Ababa",
  status: "active",
};

const demoBranches: Branch[] = [
  {
    id: "branch-adams-main",
    tenantId: "tenant-adams-hill",
    tenantName: "Adams Hill Academy",
    code: "MAIN",
    name: "Main Campus",
    address: "Bole, Addis Ababa",
    phone: "+251 11 555 0184",
    email: "main@adamshill.edu",
    timezone: "Africa/Addis_Ababa",
    status: "active",
    updatedAt: "Today, 10:14",
  },
  {
    id: "branch-adams-junior",
    tenantId: "tenant-adams-hill",
    tenantName: "Adams Hill Academy",
    code: "JUNIOR",
    name: "Junior Campus",
    address: "Yeka, Addis Ababa",
    phone: "+251 11 555 0198",
    email: "junior@adamshill.edu",
    timezone: "Africa/Addis_Ababa",
    status: "active",
    updatedAt: "Yesterday, 15:42",
  },
  {
    id: "branch-northfield-main",
    tenantId: "tenant-northfield",
    tenantName: "Northfield Prep",
    code: "NORTH",
    name: "Northfield Campus",
    address: "Kirkos, Addis Ababa",
    phone: "+251 11 555 0231",
    email: "campus@northfield.edu",
    timezone: "Africa/Addis_Ababa",
    status: "inactive",
    updatedAt: "Sep 08, 2026",
  },
];

const inputClass =
  "w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2.5 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15";

function statusClass(status: BranchStatus) {
  return `status ${status === "active" ? "paid" : status === "inactive" ? "pending" : "neutral"}`;
}

function BranchFormFields({
  form,
  errors,
  onChange,
}: {
  form: BranchForm;
  errors: Partial<Record<keyof BranchForm, string>>;
  onChange: <Key extends keyof BranchForm>(
    key: Key,
    value: BranchForm[Key],
  ) => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="School / tenant"
          htmlFor="branch-tenant"
          error={errors.tenantId}
        >
          <FormControl>
            <select
              id="branch-tenant"
              className={inputClass}
              value={form.tenantId}
              onChange={(event) => onChange("tenantId", event.target.value)}
            >
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </FormControl>
        </FormField>
        <FormField label="Status" htmlFor="branch-status">
          <FormControl>
            <select
              id="branch-status"
              className={inputClass}
              value={form.status}
              onChange={(event) =>
                onChange("status", event.target.value as BranchStatus)
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status[0].toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </FormControl>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Branch code"
          htmlFor="branch-code"
          error={errors.code}
          description="Unique within the selected school."
        >
          <FormControl>
            <input
              id="branch-code"
              className={inputClass}
              value={form.code}
              onChange={(event) =>
                onChange("code", event.target.value.toUpperCase())
              }
              placeholder="e.g. MAIN"
              autoComplete="off"
            />
          </FormControl>
        </FormField>
        <FormField
          label="Branch name"
          htmlFor="branch-name"
          error={errors.name}
        >
          <FormControl>
            <input
              id="branch-name"
              className={inputClass}
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="e.g. Main Campus"
            />
          </FormControl>
        </FormField>
      </div>

      <FormField label="Address" htmlFor="branch-address">
        <FormControl>
          <textarea
            id="branch-address"
            className={`${inputClass} min-h-20 resize-y`}
            value={form.address}
            onChange={(event) => onChange("address", event.target.value)}
            placeholder="City, neighborhood, street"
          />
        </FormControl>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="branch-phone">
          <FormControl>
            <input
              id="branch-phone"
              className={inputClass}
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              placeholder="+251 ..."
            />
          </FormControl>
        </FormField>
        <FormField label="Email" htmlFor="branch-email">
          <FormControl>
            <input
              id="branch-email"
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="branch@school.edu"
            />
          </FormControl>
        </FormField>
      </div>

      <FormField
        label="Timezone"
        htmlFor="branch-timezone"
        description="Defaults to the tenant timezone when omitted by the backend."
      >
        <FormControl>
          <input
            id="branch-timezone"
            className={inputClass}
            value={form.timezone}
            onChange={(event) => onChange("timezone", event.target.value)}
          />
        </FormControl>
      </FormField>
    </div>
  );
}

export default function BranchesCrudPage() {
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>(demoBranches);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BranchStatus>("all");
  const [tenantFilter, setTenantFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BranchForm>(emptyBranch);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BranchForm, string>>
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

  const filteredBranches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return branches.filter((branch) => {
      const matchesTenant =
        tenantFilter === "all" || branch.tenantId === tenantFilter;
      const matchesStatus =
        statusFilter === "all" || branch.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          branch.code,
          branch.name,
          branch.tenantName,
          branch.email,
          branch.address,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesTenant && matchesStatus && matchesQuery;
    });
  }, [branches, query, statusFilter, tenantFilter]);

  function action(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2800);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyBranch);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(branch: Branch) {
    const {
      id: _id,
      tenantName: _tenantName,
      updatedAt: _updatedAt,
      ...editableFields
    } = branch;
    setEditingId(branch.id);
    setForm(editableFields);
    setErrors({});
    setFormOpen(true);
  }

  function updateForm<Key extends keyof BranchForm>(
    key: Key,
    value: BranchForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof BranchForm, string>> = {};
    if (!form.tenantId) nextErrors.tenantId = "Select a school.";
    if (!form.code.trim()) nextErrors.code = "Branch code is required.";
    if (!form.name.trim()) nextErrors.name = "Branch name is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    const duplicate = branches.some(
      (branch) =>
        branch.id !== editingId &&
        branch.tenantId === form.tenantId &&
        branch.code.toLowerCase() === form.code.trim().toLowerCase(),
    );
    if (duplicate)
      nextErrors.code = "This code already exists for the selected school.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    const tenantName =
      tenants.find((tenant) => tenant.id === form.tenantId)?.name ??
      "Unknown school";
    const nextBranch = {
      ...form,
      id: editingId ?? `branch-${Date.now()}`,
      tenantName,
      updatedAt: "Just now",
    };
    if (editingId) {
      setBranches((current) =>
        current.map((branch) =>
          branch.id === editingId ? nextBranch : branch,
        ),
      );
      action(`${form.name} updated`);
    } else {
      setBranches((current) => [nextBranch, ...current]);
      action(`${form.name} created`);
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleteId) return;
    const branch = branches.find((item) => item.id === deleteId);
    setBranches((current) => current.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    if (branch) action(`${branch.name} deleted`);
  }

  const deleteTarget = branches.find((branch) => branch.id === deleteId);

  return (
    <main className={dark ? "app dark" : "app"}>
      <section className="workspace">
        <Header
          activeSection="Branches"
          dark={dark}
          profileOpen={profileOpen}
          onAction={action}
          onMenuToggle={() =>
            action("Navigation is available from the main dashboard")
          }
          onProfileToggle={() => setProfileOpen((current) => !current)}
          onSearchOpen={() => setSearchOpen(true)}
          onThemeToggle={() => setDark((current) => !current)}
        />
        <div className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Organization administration</p>
              <h1>Branch directory</h1>
              <p className="subheading">
                Manage school locations, contacts, and operational status.
              </p>
            </div>
            <Button onClick={openCreate}>
              <Plus size={16} /> New branch
            </Button>
          </div>

          <section className="metrics-grid mb-4">
            <article className="metric-card">
              <div className="metric-icon blue">
                <Building2 size={18} />
              </div>
              <div className="metric-copy">
                <span>Total branches</span>
                <strong>{branches.length}</strong>
                <small className="positive">
                  <Check size={12} /> Directory records
                </small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon green">
                <Check size={18} />
              </div>
              <div className="metric-copy">
                <span>Active</span>
                <strong>
                  {
                    branches.filter((branch) => branch.status === "active")
                      .length
                  }
                </strong>
                <small className="positive">Open for operations</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon orange">
                <Clock3 size={18} />
              </div>
              <div className="metric-copy">
                <span>Inactive</span>
                <strong>
                  {
                    branches.filter((branch) => branch.status === "inactive")
                      .length
                  }
                </strong>
                <small className="negative">Needs review</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon red">
                <CircleAlert size={18} />
              </div>
              <div className="metric-copy">
                <span>Archived</span>
                <strong>
                  {
                    branches.filter((branch) => branch.status === "archived")
                      .length
                  }
                </strong>
                <small className="negative">Historical records</small>
              </div>
            </article>
          </section>

          <section className="panel">
            <div className="panel-heading mb-5">
              <div>
                <h2>All branches</h2>
                <p>Location records grouped by school organization.</p>
              </div>
              <span className="text-xs text-(--muted)">
                {filteredBranches.length} of {branches.length} shown
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
                  placeholder="Search branches, schools, or email"
                  aria-label="Search branches"
                />
              </label>
              <label className="relative">
                <select
                  className={`${inputClass} appearance-none pr-9`}
                  value={tenantFilter}
                  onChange={(event) => setTenantFilter(event.target.value)}
                  aria-label="Filter branches by school"
                >
                  <option value="all">All schools</option>
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
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
                />
              </label>
            </div>

            {filteredBranches.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th>School</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBranches.map((branch) => (
                      <tr key={branch.id}>
                        <td>
                          <div className="person">
                            <div className="person-avatar teal">
                              {branch.code.slice(0, 2)}
                            </div>
                            <div>
                              <strong>{branch.name}</strong>
                              <span>
                                {branch.code} · {branch.address || "No address"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{branch.tenantName}</span>
                        </td>
                        <td>
                          <div className="grid gap-1">
                            <span>{branch.email || "No email"}</span>
                            <span className="text-xs text-(--muted)">
                              {branch.phone || "No phone"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={statusClass(branch.status)}>
                            {branch.status}
                          </span>
                        </td>
                        <td className="text-xs text-(--muted)">
                          {branch.updatedAt}
                        </td>
                        <td>
                          <div className="flex justify-end gap-1">
                            <button
                              className="icon-button subtle"
                              onClick={() => openEdit(branch)}
                              aria-label={`Edit ${branch.name}`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className="icon-button subtle text-(--red)"
                              onClick={() => setDeleteId(branch.id)}
                              aria-label={`Delete ${branch.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
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
                <h3 className="text-sm font-semibold">No branches found</h3>
                <p className="max-w-sm text-xs text-(--muted)">
                  Try another filter or create a new branch record.
                </p>
                <button className="text-button" onClick={openCreate}>
                  Create branch <ChevronRight size={15} />
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
                  {editingId ? "Edit branch" : "Create branch"}
                </h2>
                <p className="mt-1 text-xs text-(--muted)">
                  Branch codes must be unique within a school.
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
              <BranchFormFields
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
                  {editingId ? "Save changes" : "Create branch"}
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
              Delete {deleteTarget.name}?
            </h2>
            <p className="mt-2 text-sm text-(--muted)">
              This removes the branch from the current workspace. Archive a
              branch when you need to preserve its operational history.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete branch
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
                placeholder="Search branches..."
              />
              <kbd>ESC</kbd>
            </div>
            <div className="search-results">
              <p>Branch actions</p>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  openCreate();
                }}
              >
                <Plus size={16} />
                Create branch
                <ChevronRight size={15} />
              </button>
              <button onClick={() => setSearchOpen(false)}>
                <Building2 size={16} />
                View directory
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
