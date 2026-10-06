"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock3,
  GitBranch,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getTenant } from "@/services/tenant.service";
import type { Tenant } from "@/services/tenant.service";
import {
  createBranch,
  listBranches,
  updateBranch,
} from "@/services/branch.service";
import type {
  Branch,
  BranchStatus,
  CreateBranchInput,
  UpdateBranchInput,
} from "@/services/branch.service";
import styles from "./page.module.css";

type BranchForm = {
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  status: BranchStatus;
};

const initialForm: BranchForm = {
  code: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  timezone: "",
  status: "active",
};

const branchStatuses: BranchStatus[] = ["active", "inactive", "archived"];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
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

export default function TenantBranchesPage() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<BranchForm>(initialForm);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadPage(id: string) {
    setLoading(true);
    setLoadError(null);
    try {
      const [tenantResponse, branchResponse] = await Promise.all([
        getTenant(id),
        listBranches({ tenantId: id }),
      ]);
      setTenant(tenantResponse.tenant);
      setBranches(branchResponse.branches);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load branches.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    const id = new URLSearchParams(window.location.search).get("tenantId");
    if (!id) {
      setLoadError("A school is required to view its branches.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setTenantId(id);
    Promise.all([getTenant(id), listBranches({ tenantId: id })])
      .then(([tenantResponse, branchResponse]) => {
        if (!active) return;
        setTenant(tenantResponse.tenant);
        setBranches(branchResponse.branches);
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load branches.",
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

  function updateForm<Key extends keyof BranchForm>(
    key: Key,
    value: BranchForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError(null);
  }

  function openCreateForm() {
    setEditingBranchId(null);
    setForm(initialForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(branch: Branch) {
    setEditingBranchId(branch.id);
    setForm({
      code: branch.code,
      name: branch.name,
      address: branch.address ?? "",
      phone: branch.phone ?? "",
      email: branch.email ?? "",
      timezone: branch.timezone ?? "",
      status: branch.status,
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tenantId) {
      setFormError("The school could not be identified. Return to the overview and try again.");
      return;
    }

    const code = form.code.trim();
    const name = form.name.trim();
    if (!code || !name) {
      setFormError("Branch code and branch name are required.");
      return;
    }

    setSaving(true);
    setFormError(null);
    const fields: Omit<CreateBranchInput, "tenantId"> = {
      code,
      name,
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      timezone: form.timezone.trim() || null,
      status: form.status,
    };

    try {
      if (editingBranchId) {
        const changes: UpdateBranchInput = fields;
        const response = await updateBranch(editingBranchId, changes);
        setBranches((current) =>
          current.map((branch) =>
            branch.id === editingBranchId ? response.branch : branch,
          ),
        );
        setNotice(`${response.branch.name} branch updated`);
      } else {
        const input: CreateBranchInput = { tenantId, ...fields };
        const response = await createBranch(input);
        setBranches((current) => [response.branch, ...current]);
        setNotice(`${response.branch.name} branch created`);
      }
      setForm(initialForm);
      setEditingBranchId(null);
      setFormOpen(false);
      window.setTimeout(() => setNotice(null), 3000);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : `Unable to ${editingBranchId ? "update" : "create"} branch.`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link
          href={
            tenantId
              ? `/super_admin/tenants/overview?tenantId=${encodeURIComponent(tenantId)}`
              : "/super_admin/tenants"
          }
          className={styles.backLink}
        >
          <ArrowLeft size={15} />
          {tenant?.displayName ?? "Tenant overview"}
        </Link>

        {loadError && !tenant ? (
          <section className={styles.statePanel} role="alert">
            <span className={styles.errorMark}>!</span>
            <h1>Branches unavailable</h1>
            <p>{loadError}</p>
            {tenantId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => void loadPage(tenantId)}
              >
                Try again
              </Button>
            )}
          </section>
        ) : (
          <>
            <header className={styles.hero}>
              <div className={styles.heroContent}>
                <p className={styles.eyebrow}>
                  <GitBranch size={14} />
                  School workspace
                </p>
                <div className={styles.headingRow}>
                  <span className={styles.tenantAvatar}>
                    {tenant ? initials(tenant.displayName) : <Building2 size={22} />}
                  </span>
                  <div>
                    <p className={styles.tenantLabel}>Branches</p>
                    <h1>{tenant?.displayName ?? "School branches"}</h1>
                    <p className={styles.tenantLegal}>
                      {tenant
                        ? `${tenant.code} · ${tenant.legalName}`
                        : "Manage campuses and school locations."}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className={styles.createButton}
                onClick={openCreateForm}
                disabled={!tenant}
              >
                <Plus size={16} />
                Create branch
              </Button>
              <div className={styles.heroDecoration} aria-hidden="true">
                <GitBranch size={100} strokeWidth={1} />
              </div>
            </header>

            {loadError && (
              <div className={styles.errorBanner} role="alert">
                <span>{loadError}</span>
                {tenantId && (
                  <button
                    type="button"
                    onClick={() => void loadPage(tenantId)}
                    disabled={loading}
                  >
                    {loading ? "Loading…" : "Try again"}
                  </button>
                )}
              </div>
            )}

            <section className={styles.listPanel}>
              <div className={styles.listHeading}>
                <div>
                  <h2>Branch directory</h2>
                  <p>Locations connected to this school workspace.</p>
                </div>
                <span className={styles.countBadge}>
                  {loading ? "…" : branches.length}
                  <small>{branches.length === 1 ? "branch" : "branches"}</small>
                </span>
              </div>

              {loading ? (
                <div className={styles.loadingState} role="status">
                  <span className={styles.spinner} />
                  Loading branches…
                </div>
              ) : branches.length ? (
                <div className={styles.branchGrid}>
                  {branches.map((branch) => (
                    <article className={styles.branchCard} key={branch.id}>
                      <div className={styles.branchTop}>
                        <span className={styles.branchAvatar}>
                          {initials(branch.name)}
                        </span>
                        <div className={styles.branchActions}>
                          <span
                            className={`${styles.branchStatus} ${styles[`branchStatus_${branch.status}`]}`}
                          >
                            <i />
                            {branch.status}
                          </span>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => openEditForm(branch)}
                            aria-label={`Edit ${branch.name} branch`}
                            title={`Edit ${branch.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                        </div>
                      </div>
                      <h3>{branch.name}</h3>
                      <p className={styles.branchCode}>Branch code · {branch.code}</p>
                      <div className={styles.branchDetails}>
                        <span>
                          <MapPin size={14} />
                          {branch.address || "Address not provided"}
                        </span>
                        <span>
                          <Clock3 size={14} />
                          {branch.timezone || "Timezone not set"}
                        </span>
                      </div>
                      <div className={styles.branchFooter}>
                        <span>
                          <Check size={13} />
                          Added {formatDate(branch.createdAt)}
                        </span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>
                    <GitBranch size={21} />
                  </span>
                  <h3>No branches yet</h3>
                  <p>
                    Add the first branch to organize this school into campuses
                    and locations.
                  </p>
                  <Button type="button" className={styles.createButton} onClick={openCreateForm}>
                    <Plus size={15} />
                    Create first branch
                  </Button>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {formOpen && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setFormOpen(false);
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="branch-form-title"
          >
            <header className={styles.modalHeader}>
              <span className={styles.modalIcon}>
                <GitBranch size={18} />
              </span>
              <div>
                <p>{editingBranchId ? "Update workspace location" : "Create workspace location"}</p>
                <h2 id="branch-form-title">
                  {editingBranchId ? "Edit branch" : "Create a branch"}
                </h2>
                <small>
                  {tenant?.displayName ?? "School"} · Required fields marked *
                </small>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setFormOpen(false)}
                disabled={saving}
                aria-label="Close branch form"
              >
                <X size={18} />
              </button>
            </header>

            <form className={styles.form} onSubmit={submitForm}>
              <div className={styles.formGrid}>
                <label>
                  Branch name *
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="e.g. Bole Campus"
                    required
                  />
                </label>
                <label>
                  Branch code *
                  <input
                    value={form.code}
                    onChange={(event) =>
                      updateForm("code", event.target.value.toUpperCase())
                    }
                    placeholder="e.g. BOLE-01"
                    required
                  />
                </label>
                <label className={styles.fullWidth}>
                  Address
                  <input
                    value={form.address}
                    onChange={(event) =>
                      updateForm("address", event.target.value)
                    }
                    placeholder="City, neighborhood, street"
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    placeholder="+251 …"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    placeholder="branch@school.edu"
                  />
                </label>
                <label>
                  Timezone
                  <input
                    value={form.timezone}
                    onChange={(event) =>
                      updateForm("timezone", event.target.value)
                    }
                    placeholder={tenant?.timezone ?? "Africa/Addis_Ababa"}
                  />
                </label>
                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as BranchStatus)
                    }
                  >
                    {branchStatuses.map((status) => (
                      <option value={status} key={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {formError && (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              )}

              <footer className={styles.formFooter}>
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
                  className={styles.submitButton}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={15} className="animate-spin" />
                      {editingBranchId ? "Saving…" : "Creating…"}
                    </>
                  ) : (
                    <>
                      {editingBranchId ? (
                        <Check size={15} />
                      ) : (
                        <Plus size={15} />
                      )}
                      {editingBranchId ? "Save changes" : "Create branch"}
                    </>
                  )}
                </Button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {notice && (
        <div className={styles.toast} role="status">
          <Check size={15} />
          {notice}
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}