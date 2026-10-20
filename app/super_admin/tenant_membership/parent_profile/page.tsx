"use client";

import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Pencil,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { Input } from "@/components/ui/Input";

import {
  listTenantMembershipRoles,
  listTenantMemberships,
  type TenantMembership,
  type TenantMembershipRole,
} from "@/services/auth/ten_mem.service";

import {
  createGuardian,
  deleteGuardian,
  listGuardians,
  updateGuardian,
  type CreateGuardianInput,
  type Guardian,
  type GuardianStatus,
  type UpdateGuardianInput,
} from "@/services/community/guardians.service";

import styles from "./page.module.css";

type GuardianForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  relationshipDefault: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  emergencyContact: boolean;
  status: GuardianStatus;
};

const emptyForm: GuardianForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  relationshipDefault: "",
  phone: "",
  email: "",
  occupation: "",
  address: "",
  emergencyContact: false,
  status: "active",
};

function toForm(guardian: Guardian): GuardianForm {
  return {
    firstName: guardian.firstName,
    middleName: guardian.middleName ?? "",
    lastName: guardian.lastName,
    relationshipDefault: guardian.relationshipDefault ?? "",
    phone: guardian.phone ?? "",
    email: guardian.email ?? "",
    occupation: guardian.occupation ?? "",
    address: guardian.address ?? "",
    emergencyContact: guardian.emergencyContact,
    status: guardian.status,
  };
}

function normalizeRole(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s/]+/g, "-");
}

function isParentGuardianRole(role: TenantMembershipRole | undefined) {
  if (!role) return false;
  const accepted = new Set(["parent", "guardian", "parent-guardian"]);
  return (
    accepted.has(normalizeRole(role.code)) ||
    accepted.has(normalizeRole(role.name))
  );
}

function membershipUserName(membership: TenantMembership) {
  const user = membership.user;
  return user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    : "";
}

function toCreateInput(
  form: GuardianForm,
  tenantId: string,
  membership: TenantMembership,
): CreateGuardianInput {
  return {
    tenantId,
    branchId: membership.branchId,
    userId: membership.userId,
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || null,
    lastName: form.lastName.trim(),
    relationshipDefault: form.relationshipDefault.trim() || null,
    phone: form.phone.trim() || null,
    email: form.email.trim() || null,
    occupation: form.occupation.trim() || null,
    address: form.address.trim() || null,
    emergencyContact: form.emergencyContact,
    status: form.status,
  };
}

function toUpdateInput(form: GuardianForm): UpdateGuardianInput {
  return {
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || null,
    lastName: form.lastName.trim(),
    relationshipDefault: form.relationshipDefault.trim() || null,
    phone: form.phone.trim() || null,
    email: form.email.trim() || null,
    occupation: form.occupation.trim() || null,
    address: form.address.trim() || null,
    emergencyContact: form.emergencyContact,
    status: form.status,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ParentProfilePage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMembershipId, setSelectedMembershipId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [membership, setMembership] = useState<TenantMembership | null>(null);
  const [roles, setRoles] = useState<TenantMembershipRole[]>([]);
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [form, setForm] = useState<GuardianForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId") ?? "";
    const membershipId = params.get("membershipId") ?? "";
    const tenantId = params.get("tenantId") ?? "";
    if (!userId) {
      setPageError(
        "Select a parent/guardian membership from the membership table.",
      );
      setLoading(false);
      return;
    }
    if (!tenantId) {
      setPageError(
        "The selected membership does not include its tenant. Return to the membership table and select it again.",
      );
      setLoading(false);
      return;
    }
    setSelectedUserId(userId);
    setSelectedMembershipId(membershipId);
    setTenantId(tenantId);
  }, []);

  const loadProfile = useCallback(async () => {
    if (!selectedUserId || !tenantId) {
      setLoading(false);
      setPageError(
        "Select a parent/guardian membership from the membership table.",
      );
      return;
    }

    setLoading(true);
    setPageError(null);
    setActionError(null);
    try {
      const selectedTenantId = tenantId;
      const [membershipResult, roleResult] = await Promise.all([
        listTenantMemberships({
          tenantId: selectedTenantId,
          userId: selectedUserId,
        }),
        listTenantMembershipRoles(),
      ]);
      const roleMap = roleResult.roles;
      const selectedMembership = membershipResult.memberships.find(
        (item) =>
          (!selectedMembershipId || item.id === selectedMembershipId) &&
          item.userId === selectedUserId &&
          item.tenantId === selectedTenantId,
      );
      const membershipRole = selectedMembership
        ? roleMap.find((role) => role.id === selectedMembership.roleId)
        : undefined;

      if (!selectedMembership || !isParentGuardianRole(membershipRole)) {
        throw new Error(
          "The selected user does not have a parent/guardian membership in this school.",
        );
      }

      const guardianResult = await listGuardians({
        tenantId: selectedTenantId,
        userId: selectedUserId,
      });
      if (guardianResult.guardians.length > 1) {
        throw new Error(
          "More than one guardian record is linked to this user. Resolve the duplicate records before editing.",
        );
      }

      const currentGuardian = guardianResult.guardians[0] ?? null;
      setMembership(selectedMembership);
      setRoles(roleMap);
      setGuardian(currentGuardian);
      setForm(
        currentGuardian
          ? toForm(currentGuardian)
          : {
              ...emptyForm,
              firstName: selectedMembership.user?.firstName ?? "",
              middleName: selectedMembership.user?.middleName ?? "",
              lastName: selectedMembership.user?.lastName ?? "",
            },
      );
      setEditing(!currentGuardian);
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to load the guardian profile."),
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMembershipId, selectedUserId, tenantId]);

  useEffect(() => {
    if (selectedUserId) void loadProfile();
  }, [loadProfile, selectedUserId]);

  function updateForm<Field extends keyof GuardianForm>(
    field: Field,
    value: GuardianForm[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!membership || !tenantId) return;
    setSaving(true);
    setActionError(null);
    setNotice(null);
    try {
      const response = guardian
        ? await updateGuardian(guardian.id, toUpdateInput(form), tenantId)
        : await createGuardian(toCreateInput(form, tenantId, membership));
      setGuardian(response.guardian);
      setForm(toForm(response.guardian));
      setEditing(false);
      setNotice(
        guardian ? "Guardian profile updated." : "Guardian profile created.",
      );
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to save the guardian profile."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeProfile() {
    if (!guardian || !tenantId) return;
    const fullName = [
      guardian.firstName,
      guardian.middleName,
      guardian.lastName,
    ]
      .filter(Boolean)
      .join(" ");
    if (
      !window.confirm(`Permanently delete the guardian record for ${fullName}?`)
    ) {
      return;
    }

    setDeleting(true);
    setActionError(null);
    setNotice(null);
    try {
      await deleteGuardian(guardian.id, tenantId);
      setGuardian(null);
      setForm({
        ...emptyForm,
        firstName: membership?.user?.firstName ?? guardian.firstName,
        middleName: membership?.user?.middleName ?? guardian.middleName ?? "",
        lastName: membership?.user?.lastName ?? guardian.lastName,
      });
      setEditing(true);
      setNotice("Guardian record deleted.");
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to delete the guardian record."),
      );
    } finally {
      setDeleting(false);
    }
  }

  const displayName =
    (membership && membershipUserName(membership)) ||
    membership?.user?.email ||
    "Parent / Guardian";
  const roleName = membership
    ? (roles.find((role) => role.id === membership.roleId)?.name ??
      roles.find((role) => role.id === membership.roleId)?.code ??
      "Parent / Guardian")
    : "Parent / Guardian";

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <Link href="/super_admin/tenant_membership" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to memberships
          </Link>
          <p className={styles.eyebrow}>PLATFORM ADMINISTRATION</p>
          <h1>Parent / guardian profile</h1>
          <p className={styles.subtitle}>
            View and manage the guardian record associated with this school
            member.
          </p>
        </div>
        {!loading && !pageError && guardian && !editing && (
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              onClick={() => {
                setForm(toForm(guardian));
                setEditing(true);
                setActionError(null);
              }}
            >
              <Pencil aria-hidden="true" />
              Edit profile
            </Button>
            <Button
              variant="destructive"
              onClick={() => void removeProfile()}
              disabled={deleting}
            >
              {deleting ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        )}
      </header>

      {loading ? (
        <Card padding="lg" className={styles.feedback}>
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Loading selected parent / guardian…
        </Card>
      ) : pageError ? (
        <Card padding="lg" className={styles.errorCard}>
          <p role="alert">{pageError}</p>
          <Button variant="outline" onClick={() => void loadProfile()}>
            Try again
          </Button>
        </Card>
      ) : membership ? (
        <>
          <Card padding="default" className={styles.memberCard}>
            <div className={styles.memberAvatar}>
              <UserRound size={22} aria-hidden="true" />
            </div>
            <div className={styles.memberDetails}>
              <h2>{displayName}</h2>
              <p>{membership.user?.email ?? membership.userId}</p>
            </div>
            <span className={styles.roleBadge}>{roleName}</span>
            <span className={styles.scopeBadge}>
              {membership.branchId ? "Branch membership" : "School-wide"}
            </span>
          </Card>

          <Card padding="default" className={styles.profileCard}>
            <CardHeader className={styles.cardHeader}>
              <div>
                <CardTitle>
                  {guardian ? "Guardian details" : "Create guardian record"}
                </CardTitle>
                <CardDescription>
                  {guardian
                    ? `Linked to this member · ${guardian.status}`
                    : "No guardian record is linked to this member yet. Complete the form to create one."}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {notice && (
                <p className={styles.notice} role="status">
                  <Check size={16} aria-hidden="true" />
                  {notice}
                </p>
              )}
              {actionError && (
                <p className={styles.actionError} role="alert">
                  {actionError}
                </p>
              )}

              {editing ? (
                <form className={styles.form} onSubmit={saveProfile}>
                  <section className={styles.formSection}>
                    <h3>Guardian information</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="First name"
                        required
                        value={form.firstName}
                        onChange={(event) =>
                          updateForm("firstName", event.target.value)
                        }
                      />
                      <Input
                        label="Middle name"
                        value={form.middleName}
                        onChange={(event) =>
                          updateForm("middleName", event.target.value)
                        }
                      />
                      <Input
                        label="Last name"
                        required
                        value={form.lastName}
                        onChange={(event) =>
                          updateForm("lastName", event.target.value)
                        }
                      />
                      <Input
                        label="Relationship to student"
                        value={form.relationshipDefault}
                        onChange={(event) =>
                          updateForm("relationshipDefault", event.target.value)
                        }
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          updateForm("phone", event.target.value)
                        }
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          updateForm("email", event.target.value)
                        }
                      />
                      <Input
                        label="Occupation"
                        value={form.occupation}
                        onChange={(event) =>
                          updateForm("occupation", event.target.value)
                        }
                      />
                      <Input
                        label="Address"
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                      />
                      <label className={styles.field}>
                        <span>Status</span>
                        <select
                          value={form.status}
                          onChange={(event) =>
                            updateForm(
                              "status",
                              event.target.value as GuardianStatus,
                            )
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="archived">Archived</option>
                        </select>
                      </label>
                      <label className={styles.checkboxField}>
                        <input
                          type="checkbox"
                          checked={form.emergencyContact}
                          onChange={(event) =>
                            updateForm("emergencyContact", event.target.checked)
                          }
                        />
                        Emergency contact
                      </label>
                    </div>
                  </section>
                  <div className={styles.formActions}>
                    {guardian && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setForm(toForm(guardian));
                          setEditing(false);
                          setActionError(null);
                        }}
                        disabled={saving}
                      >
                        <X aria-hidden="true" />
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <LoaderCircle
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Save aria-hidden="true" />
                      )}
                      {saving
                        ? "Saving…"
                        : guardian
                          ? "Save changes"
                          : "Create guardian"}
                    </Button>
                  </div>
                </form>
              ) : guardian ? (
                <dl className={styles.detailsGrid}>
                  <Detail label="First name" value={guardian.firstName} />
                  <Detail label="Middle name" value={guardian.middleName} />
                  <Detail label="Last name" value={guardian.lastName} />
                  <Detail
                    label="Relationship"
                    value={guardian.relationshipDefault}
                  />
                  <Detail label="Phone" value={guardian.phone} />
                  <Detail label="Email" value={guardian.email} />
                  <Detail label="Occupation" value={guardian.occupation} />
                  <Detail label="Address" value={guardian.address} />
                  <Detail
                    label="Emergency contact"
                    value={guardian.emergencyContact ? "Yes" : "No"}
                  />
                  <Detail label="Status" value={guardian.status} />
                </dl>
              ) : (
                <p className={styles.emptyMessage}>
                  Complete the form to create a guardian record linked to this
                  membership’s user account.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className={styles.detail}>
      <dt>{label}</dt>
      <dd>{value || "Not provided"}</dd>
    </div>
  );
}
