"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  Building2,
  CircleAlert,
  CircleCheck,
  CircleMinus,
  GitBranch,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { TenantBranchDirectory } from "@/components/tenants/TenantBranchDirectory";
import {
  TenantBranchFormDialog,
  type BranchForm,
} from "@/components/tenants/TenantBranchFormDialog";
import { TenantPageHeader } from "@/components/tenants/TenantPageHeader";
import { TenantStatsCards } from "@/components/tenants/TenantStatsCards";
import {
  createBranch,
  deleteBranch,
  listBranches,
  updateBranch,
} from "@/services/tenancy/branch.service";
import type {
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
} from "@/services/tenancy/branch.service";
import { getAuthenticatedTenantId } from "@/services/auth/user.service";
import styles from "@/components/tenants/BranchWorkspace.module.css";

const initialForm: BranchForm = {
  code: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  timezone: "",
  status: "active",
};

export default function SchoolAdminBranchesPage() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolReady, setSchoolReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<BranchForm>(initialForm);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPage = useCallback(
    async (id: string, isActive: () => boolean = () => true) => {
      setLoading(true);
      setSchoolReady(false);
      setLoadError(null);
      try {
        const branchResponse = await listBranches({ tenantId: id });
        if (!isActive()) return;
        if (branchResponse.branches.some((branch) => branch.tenantId !== id)) {
          throw new Error("The server returned branch data outside your school.");
        }
        setSchoolReady(true);
        setBranches(branchResponse.branches);
      } catch (error) {
        if (isActive()) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load school branches.",
          );
        }
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;
    try {
      const id = getAuthenticatedTenantId();
      setTenantId(id);
      void loadPage(id, () => active);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to identify your signed-in school.",
      );
      setSchoolReady(false);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [loadPage]);

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
    if (branch.tenantId !== tenantId) {
      setLoadError("This branch does not belong to your school.");
      return;
    }
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
    if (!tenantId || !schoolReady) {
      setFormError("Your school could not be identified. Sign in again and retry.");
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
        const response = await updateBranch(editingBranchId, changes, tenantId);
        if (response.branch.tenantId !== tenantId) {
          throw new Error("The server returned a branch outside your school.");
        }
        setBranches((current) =>
          current.map((branch) =>
            branch.id === editingBranchId ? response.branch : branch,
          ),
        );
        setNotice(`${response.branch.name} branch updated`);
      } else {
        const input: CreateBranchInput = { tenantId, ...fields };
        const response = await createBranch(input);
        if (response.branch.tenantId !== tenantId) {
          throw new Error("The server returned a branch outside your school.");
        }
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

  async function confirmDeleteBranch() {
    if (!branchToDelete) return;
    if (!tenantId || branchToDelete.tenantId !== tenantId) {
      setBranchToDelete(null);
      setLoadError("This branch does not belong to your signed-in school.");
      return;
    }

    const target = branchToDelete;
    setDeleting(true);
    setLoadError(null);
    try {
      await deleteBranch(target.id, tenantId);
      setBranches((current) =>
        current.filter((branch) => branch.id !== target.id),
      );
      setBranchToDelete(null);
      setNotice(`${target.name} branch deleted`);
      window.setTimeout(() => setNotice(null), 3000);
    } catch (error) {
      setBranchToDelete(null);
      setLoadError(
        error instanceof Error ? error.message : "Unable to delete branch.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const activeBranches = branches.filter(
    (branch) => branch.status === "active",
  ).length;
  const inactiveBranches = branches.filter(
    (branch) => branch.status === "inactive",
  ).length;
  const archivedBranches = branches.filter(
    (branch) => branch.status === "archived",
  ).length;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        {tenantId && (
          <Link href="/school_admin" className={styles.backLink}>
            <ArrowLeft size={15} />
            School dashboard
          </Link>
        )}

        {loadError && !tenantId ? (
          <section className={styles.statePanel} role="alert">
            <span className={styles.errorMark}>
              <CircleAlert size={20} />
            </span>
            <h1>Branches unavailable</h1>
            <p>{loadError}</p>
          </section>
        ) : (
          <>
            <TenantPageHeader
              styles={styles}
              className={styles.hero}
              contentClassName={styles.heroContent}
              eyebrowClassName={styles.eyebrow}
              eyebrow="School administration / Branches"
              icon={Building2}
              title="My school branches"
              subtitle="Manage your school’s branch locations, contact details, and status."
              details={
                <div className={styles.heroMeta}>
                  <span className={styles.codeBadge}>School workspace</span>
                </div>
              }
              action={
                <Button
                  type="button"
                  className={styles.createButton}
                  onClick={openCreateForm}
                  disabled={!schoolReady}
                >
                  <Plus size={16} />
                  Add a branch
                </Button>
              }
              decoration={
                <div className={styles.heroDecoration} aria-hidden="true">
                  <GitBranch size={100} strokeWidth={1} />
                </div>
              }
            />

            <TenantStatsCards
              className={styles.summaryGrid}
              loading={loading || Boolean(loadError)}
              ariaLabel="School branch summary"
              stats={[
                {
                  label: "Total branches",
                  value: branches.length,
                  helper: "School locations",
                  tone: "blue",
                  icon: GitBranch,
                },
                {
                  label: "Active",
                  value: activeBranches,
                  helper: "Operational locations",
                  tone: "green",
                  icon: CircleCheck,
                },
                {
                  label: "Inactive",
                  value: inactiveBranches,
                  helper: "Temporarily unavailable",
                  tone: "orange",
                  icon: CircleMinus,
                },
                {
                  label: "Archived",
                  value: archivedBranches,
                  helper: "Retired locations",
                  tone: "red",
                  icon: Archive,
                },
              ]}
            />

            <TenantBranchDirectory
              branches={branches}
              loading={loading}
              error={loadError}
              styles={styles}
              onCreate={openCreateForm}
              onEdit={openEditForm}
              onDelete={setBranchToDelete}
              onView={(branch) => {
                if (branch.tenantId !== tenantId || !tenantId) {
                  setLoadError("This branch does not belong to your school.");
                  return;
                }
                const params = new URLSearchParams({
                  branchId: branch.id,
                  tenantId,
                });
                router.push(
                  `/school_admin/branches/overview?${params.toString()}`,
                );
              }}
              onRetry={() => {
                if (tenantId) void loadPage(tenantId);
              }}
            />
          </>
        )}
      </div>

      <TenantBranchFormDialog
        isOpen={formOpen}
        editing={Boolean(editingBranchId)}
        tenantName="Your school"
        form={form}
        error={formError}
        saving={saving}
        styles={styles}
        onClose={() => setFormOpen(false)}
        onChange={updateForm}
        onSubmit={submitForm}
      />

      <ConfirmModal
        isOpen={branchToDelete !== null}
        onClose={() => {
          if (!deleting) setBranchToDelete(null);
        }}
        onConfirm={() => void confirmDeleteBranch()}
        title="Delete branch?"
        description={
          branchToDelete
            ? `This will permanently delete ${branchToDelete.name} (${branchToDelete.code}). This action cannot be undone.`
            : ""
        }
        confirmText="Delete branch"
        isLoading={deleting}
      />

      {notice && (
        <div className={styles.toast} role="status">
          <CircleCheck size={15} />
          {notice}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
          >
            <X size={14} />
          </Button>
        </div>
      )}
    </main>
  );
}
