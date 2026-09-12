"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Globe2,
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
  FormLabel,
  FormMessage,
} from "../../../components/forms/Form";
import { Header } from "../../../components/ui/header";

const statuses = [
  "pending",
  "active",
  "suspended",
  "closed",
  "archived",
] as const;
type TenantStatus = (typeof statuses)[number];

type Tenant = {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  countryCode: string;
  timezone: string;
  currencyCode: string;
  dateFormat: string;
  numberFormat: string;
  status: TenantStatus;
  updatedAt: string;
};

type TenantForm = Omit<Tenant, "id" | "updatedAt">;

const emptyTenant: TenantForm = {
  code: "",
  legalName: "",
  displayName: "",
  email: "",
  phone: "",
  address: "",
  countryCode: "ET",
  timezone: "Africa/Addis_Ababa",
  currencyCode: "ETB",
  dateFormat: "YYYY-MM-DD",
  numberFormat: "#,##0.00",
  status: "active",
};

const demoTenants: Tenant[] = [
  {
    id: "tenant-adams-hill",
    code: "ADAMS-HILL",
    legalName: "Adams Hill Education Foundation",
    displayName: "Adams Hill Academy",
    email: "admin@adamshill.edu",
    phone: "+251 11 555 0184",
    address: "Bole, Addis Ababa",
    countryCode: "ET",
    timezone: "Africa/Addis_Ababa",
    currencyCode: "ETB",
    dateFormat: "YYYY-MM-DD",
    numberFormat: "#,##0.00",
    status: "active",
    updatedAt: "Today, 09:42",
  },
  {
    id: "tenant-northfield",
    code: "NORTHFIELD",
    legalName: "Northfield Preparatory School PLC",
    displayName: "Northfield Prep",
    email: "office@northfield.edu",
    phone: "+251 11 555 0231",
    address: "Kirkos, Addis Ababa",
    countryCode: "ET",
    timezone: "Africa/Addis_Ababa",
    currencyCode: "ETB",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "#,##0.00",
    status: "pending",
    updatedAt: "Yesterday, 16:18",
  },
  {
    id: "tenant-lakeside",
    code: "LAKESIDE",
    legalName: "Lakeside International School",
    displayName: "Lakeside International",
    email: "hello@lakeside.edu",
    phone: "+251 11 555 0310",
    address: "Yeka, Addis Ababa",
    countryCode: "ET",
    timezone: "Africa/Addis_Ababa",
    currencyCode: "ETB",
    dateFormat: "YYYY-MM-DD",
    numberFormat: "#,##0.00",
    status: "suspended",
    updatedAt: "Sep 08, 2026",
  },
];

const inputClass =
  "w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2.5 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15";

function statusClass(status: TenantStatus) {
  return `status ${status === "active" ? "paid" : status === "pending" ? "pending" : "neutral"}`;
}

function TenantFormFields({
  form,
  errors,
  onChange,
}: {
  form: TenantForm;
  errors: Partial<Record<keyof TenantForm, string>>;
  onChange: <Key extends keyof TenantForm>(
    key: Key,
    value: TenantForm[Key],
  ) => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Tenant code"
          htmlFor="tenant-code"
          error={errors.code}
        >
          <FormControl>
            <input
              id="tenant-code"
              className={inputClass}
              value={form.code}
              onChange={(event) =>
                onChange("code", event.target.value.toUpperCase())
              }
              placeholder="e.g. NORTHFIELD"
              autoComplete="off"
            />
          </FormControl>
        </FormField>
        <FormField label="Status" htmlFor="tenant-status">
          <FormControl>
            <select
              id="tenant-status"
              className={inputClass}
              value={form.status}
              onChange={(event) =>
                onChange("status", event.target.value as TenantStatus)
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
          label="Display name"
          htmlFor="tenant-display-name"
          error={errors.displayName}
        >
          <FormControl>
            <input
              id="tenant-display-name"
              className={inputClass}
              value={form.displayName}
              onChange={(event) => onChange("displayName", event.target.value)}
              placeholder="Name shown across Xenon"
            />
          </FormControl>
        </FormField>
        <FormField
          label="Legal name"
          htmlFor="tenant-legal-name"
          error={errors.legalName}
        >
          <FormControl>
            <input
              id="tenant-legal-name"
              className={inputClass}
              value={form.legalName}
              onChange={(event) => onChange("legalName", event.target.value)}
              placeholder="Registered organization name"
            />
          </FormControl>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Email" htmlFor="tenant-email">
          <FormControl>
            <input
              id="tenant-email"
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="admin@school.edu"
            />
          </FormControl>
        </FormField>
        <FormField label="Phone" htmlFor="tenant-phone">
          <FormControl>
            <input
              id="tenant-phone"
              className={inputClass}
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              placeholder="+251 ..."
            />
          </FormControl>
        </FormField>
      </div>

      <FormField
        label="Address"
        htmlFor="tenant-address"
        description="The primary address for this school organization."
      >
        <FormControl>
          <textarea
            id="tenant-address"
            className={`${inputClass} min-h-20 resize-y`}
            value={form.address}
            onChange={(event) => onChange("address", event.target.value)}
            placeholder="City, neighborhood, street"
          />
        </FormControl>
      </FormField>

      <div className="border-t border-(--line) pt-5">
        <div className="mb-4 flex items-center gap-2">
          <Globe2 size={16} className="text-(--blue)" />
          <div>
            <h3 className="text-sm font-semibold">Regional settings</h3>
            <p className="mt-1 text-xs text-(--muted)">
              Used for dates, amounts, and school-wide defaults.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Country code" htmlFor="tenant-country">
            <FormControl>
              <input
                id="tenant-country"
                maxLength={2}
                className={inputClass}
                value={form.countryCode}
                onChange={(event) =>
                  onChange("countryCode", event.target.value.toUpperCase())
                }
              />
            </FormControl>
          </FormField>
          <FormField label="Timezone" htmlFor="tenant-timezone">
            <FormControl>
              <input
                id="tenant-timezone"
                className={inputClass}
                value={form.timezone}
                onChange={(event) => onChange("timezone", event.target.value)}
              />
            </FormControl>
          </FormField>
          <FormField label="Currency" htmlFor="tenant-currency">
            <FormControl>
              <input
                id="tenant-currency"
                maxLength={3}
                className={inputClass}
                value={form.currencyCode}
                onChange={(event) =>
                  onChange("currencyCode", event.target.value.toUpperCase())
                }
              />
            </FormControl>
          </FormField>
        </div>
      </div>
    </div>
  );
}

export default function TenantsCrudPage() {
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>(demoTenants);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TenantStatus>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyTenant);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TenantForm, string>>
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

  const filteredTenants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tenants.filter((tenant) => {
      const matchesStatus =
        statusFilter === "all" || tenant.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [tenant.code, tenant.displayName, tenant.legalName, tenant.email].some(
          (value) => value.toLowerCase().includes(normalizedQuery),
        );
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter, tenants]);

  function action(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2800);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyTenant);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(tenant: Tenant) {
    const { id: _id, updatedAt: _updatedAt, ...editableFields } = tenant;
    setEditingId(tenant.id);
    setForm(editableFields);
    setErrors({});
    setFormOpen(true);
  }

  function updateForm<Key extends keyof TenantForm>(
    key: Key,
    value: TenantForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof TenantForm, string>> = {};
    if (!form.code.trim()) nextErrors.code = "Tenant code is required.";
    if (!form.displayName.trim())
      nextErrors.displayName = "Display name is required.";
    if (!form.legalName.trim())
      nextErrors.legalName = "Legal name is required.";
    if (form.countryCode.length !== 2)
      nextErrors.countryCode = "Use a two-letter country code.";
    if (form.currencyCode.length !== 3)
      nextErrors.currencyCode = "Use a three-letter currency code.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    const now = "Just now";
    if (editingId) {
      setTenants((current) =>
        current.map((tenant) =>
          tenant.id === editingId
            ? { ...tenant, ...form, updatedAt: now }
            : tenant,
        ),
      );
      action(`${form.displayName} updated`);
    } else {
      setTenants((current) => [
        { ...form, id: `tenant-${Date.now()}`, updatedAt: now },
        ...current,
      ]);
      action(`${form.displayName} created`);
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleteId) return;
    const tenant = tenants.find((item) => item.id === deleteId);
    setTenants((current) => current.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    if (tenant) action(`${tenant.displayName} deleted`);
  }

  const deleteTarget = tenants.find((tenant) => tenant.id === deleteId);

  return (
    <main className={dark ? "app dark" : "app"}>
      <section className="workspace">
        <Header
          activeSection="Tenants"
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
              <p className="eyebrow">Platform administration</p>
              <h1>Tenant directory</h1>
              <p className="subheading">
                Create and manage the school organizations connected to Xenon.
              </p>
            </div>
            <Button onClick={openCreate}>
              <Plus size={16} /> New tenant
            </Button>
          </div>

          <section className="metrics-grid mb-4">
            <article className="metric-card">
              <div className="metric-icon blue">
                <Globe2 size={18} />
              </div>
              <div className="metric-copy">
                <span>Total tenants</span>
                <strong>{tenants.length}</strong>
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
                    tenants.filter((tenant) => tenant.status === "active")
                      .length
                  }
                </strong>
                <small className="positive">Ready for operations</small>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-icon orange">
                <Clock3 size={18} />
              </div>
              <div className="metric-copy">
                <span>Pending review</span>
                <strong>
                  {
                    tenants.filter((tenant) => tenant.status === "pending")
                      .length
                  }
                </strong>
                <small className="negative">Needs attention</small>
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
                    tenants.filter(
                      (tenant) =>
                        tenant.status === "suspended" ||
                        tenant.status === "closed",
                    ).length
                  }
                </strong>
                <small className="negative">Suspended or closed</small>
              </div>
            </article>
          </section>

          <section className="panel">
            <div className="panel-heading mb-5">
              <div>
                <h2>All tenants</h2>
                <p>Tenant identity, status, and regional configuration.</p>
              </div>
              <span className="text-xs text-(--muted)">
                {filteredTenants.length} of {tenants.length} shown
              </span>
            </div>
            <div className="mb-5 flex flex-col gap-3 md:flex-row">
              <label className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
                />
                <input
                  className={`${inputClass} pl-9`}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by code, name, or email"
                  aria-label="Search tenants"
                />
              </label>
              <label className="relative md:w-48">
                <select
                  className={`${inputClass} appearance-none pr-9`}
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | TenantStatus)
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

            {filteredTenants.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tenant</th>
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
                          </div>
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
                              {tenant.countryCode} · {tenant.currencyCode}
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
                          {tenant.updatedAt}
                        </td>
                        <td>
                          <div className="flex justify-end gap-1">
                            <button
                              className="icon-button subtle"
                              onClick={() => openEdit(tenant)}
                              aria-label={`Edit ${tenant.displayName}`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className="icon-button subtle text-(--red)"
                              onClick={() => setDeleteId(tenant.id)}
                              aria-label={`Delete ${tenant.displayName}`}
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
                <h3 className="text-sm font-semibold">No tenants found</h3>
                <p className="max-w-sm text-xs text-(--muted)">
                  Try another search or create a new tenant record.
                </p>
                <button className="text-button" onClick={openCreate}>
                  Create tenant <ChevronRight size={15} />
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
                  {editingId ? "Edit tenant" : "Create tenant"}
                </h2>
                <p className="mt-1 text-xs text-(--muted)">
                  Required fields are validated before saving.
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
              <TenantFormFields
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
                  {editingId ? "Save changes" : "Create tenant"}
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
              Delete {deleteTarget.displayName}?
            </h2>
            <p className="mt-2 text-sm text-(--muted)">
              This removes the record from the current workspace. Related school
              data should be archived before deleting a production tenant.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete tenant
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
                placeholder="Search tenants..."
              />
              <kbd>ESC</kbd>
            </div>
            <div className="search-results">
              <p>Tenant actions</p>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  openCreate();
                }}
              >
                <Plus size={16} />
                Create tenant
                <ChevronRight size={15} />
              </button>
              <button onClick={() => setSearchOpen(false)}>
                <Globe2 size={16} />
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
