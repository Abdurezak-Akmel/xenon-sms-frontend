"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Check, CircleAlert, Clock3, Globe2, X } from "lucide-react";

import { TenantDirectory } from "@/components/tenants/TenantDirectory";

import {
  TenantFormDialog,
  type TenantFormValues,
} from "@/components/tenants/TenantFormDialog";

import { TenantPageHeader } from "@/components/tenants/TenantPageHeader";

import {
  TenantStatsCards,
  type TenantStat,
} from "@/components/tenants/TenantStatsCards";

import { Button } from "@/components/ui/Button";

import { ConfirmModal } from "@/components/ui/Modal";

import { Footer } from "@/components/ui/footer";

import {
  createTenant,
  deleteTenant,
  listTenants,
  updateTenant,
} from "../../../services/tenancy/tenant.service";

import type {
  CreateTenantInput,
  Tenant,
  TenantStatus,
} from "../../../services/tenancy/tenant.service";

import styles from "./page.module.css";

type TenantForm = TenantFormValues;

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
  status: "active",
};

export default function TenantsPage() {
  const [notice, setNotice] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TenantStatus>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyTenant);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TenantForm, string>>
  >({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function loadTenants() {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await listTenants();
      setTenants(response.tenants);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load tenants.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTenants();
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("create") === "1") {
      setFormOpen(true);
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname,
      );
    }
  }, []);

  const filteredTenants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tenants.filter((tenant) => {
      const matchesStatus =
        statusFilter === "all" || tenant.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          tenant.code,
          tenant.displayName,
          tenant.legalName,
          tenant.email ?? "",
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
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
    setEditingId(tenant.id);
    setForm({
      code: tenant.code,
      legalName: tenant.legalName,
      displayName: tenant.displayName,
      email: tenant.email ?? "",
      phone: tenant.phone ?? "",
      address: tenant.address ?? "",
      countryCode: tenant.countryCode ?? "",
      timezone: tenant.timezone,
      currencyCode: tenant.currencyCode,
      status: tenant.status,
    });
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

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setLoadError(null);
    const input: CreateTenantInput = {
      code: form.code.trim(),
      legalName: form.legalName.trim(),
      displayName: form.displayName.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      countryCode: form.countryCode.trim().toUpperCase(),
      timezone: form.timezone.trim(),
      currencyCode: form.currencyCode.trim().toUpperCase(),
      status: form.status,
    };
    try {
      if (editingId) {
        const response = await updateTenant(editingId, input);
        setTenants((current) =>
          current.map((tenant) =>
            tenant.id === editingId ? response.tenant : tenant,
          ),
        );
        action(`${response.tenant.displayName} updated`);
      } else {
        const response = await createTenant(input);
        setTenants((current) => [response.tenant, ...current]);
        action(`${response.tenant.displayName} created`);
      }
      setFormOpen(false);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to save tenant.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const tenant = tenants.find((item) => item.id === deleteId);
    setDeleting(true);
    setLoadError(null);
    try {
      await deleteTenant(deleteId);
      setTenants((current) => current.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      if (tenant) action(`${tenant.displayName} deleted`);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to delete tenant.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const deleteTarget = tenants.find((tenant) => tenant.id === deleteId);
  const tenantStats: TenantStat[] = [
    {
      label: "School workspaces",
      value: tenants.length,
      helper: "Connected to Xenon",
      tone: "blue",
      helperTone: "positive",
      helperIcon: Check,
      icon: Globe2,
    },
    {
      label: "Active",
      value: tenants.filter((tenant) => tenant.status === "active").length,
      helper: "Ready for operations",
      tone: "green",
      helperTone: "positive",
      icon: Check,
    },
    {
      label: "Pending review",
      value: tenants.filter((tenant) => tenant.status === "pending").length,
      helper: "Needs attention",
      tone: "orange",
      helperTone: "negative",
      icon: Clock3,
    },
    {
      label: "Restricted",
      value: tenants.filter(
        (tenant) => tenant.status === "suspended" || tenant.status === "closed",
      ).length,
      helper: "Suspended or closed",
      tone: "red",
      helperTone: "negative",
      icon: CircleAlert,
    },
  ];

  return (
    <div className={styles.tenantPage}>
      <div className="content">
        <TenantPageHeader onCreate={openCreate} styles={styles} />
        <TenantStatsCards
          stats={tenantStats}
          loading={loading}
          className={styles.metricsGrid}
        />

        <TenantDirectory
          tenants={tenants}
          filteredTenants={filteredTenants}
          loading={loading}
          loadError={loadError}
          query={query}
          statusFilter={statusFilter}
          onQueryChange={setQuery}
          onStatusFilterChange={setStatusFilter}
          onRetry={() => void loadTenants()}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onCreate={openCreate}
          styles={styles}
        />
        <Footer year={2026} />
      </div>

      <TenantFormDialog
        isOpen={formOpen}
        isEditing={editingId !== null}
        form={form}
        errors={errors}
        saving={saving}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
        onChange={updateForm}
      />

      <ConfirmModal
        isOpen={deleteTarget !== undefined}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
        title={`Delete ${deleteTarget?.displayName ?? "school"}?`}
        description="This permanently removes the school workspace. Related records may prevent deletion while they are still in use."
        confirmText="Delete school"
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
