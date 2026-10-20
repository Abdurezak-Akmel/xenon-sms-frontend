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

import { Button } from "../../../../components/ui/Button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";

import { Input } from "../../../../components/ui/Input";

import { getAuthenticatedTenantId } from "../../../../services/auth/user.service";

import {
  listTenantMembershipRoles,
  listTenantMemberships,
  type TenantMembership,
  type TenantMembershipRole,
} from "../../../../services/auth/ten_mem.service";

import {
  createStudent,
  deleteStudent,
  listStudents,
  updateStudent,
  type CreateStudentInput,
  type Student,
  type StudentStatus,
  type UpdateStudentInput,
} from "../../../../services/community/students.service";

import styles from "./page.module.css";

type StudentForm = {
  studentNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  gender: string;
  dateOfBirth: string;
  birthPlace: string;
  nationality: string;
  nationalId: string;
  bloodGroup: string;
  address: string;
  status: StudentStatus;
  admissionDate: string;
  graduationDate: string;
  emergencyNotes: string;
};

const studentStatuses: StudentStatus[] = [
  "applicant",
  "enrolled",
  "active",
  "transferred",
  "suspended",
  "graduated",
  "withdrawn",
  "archived",
];

const emptyForm: StudentForm = {
  studentNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  gender: "",
  dateOfBirth: "",
  birthPlace: "",
  nationality: "",
  nationalId: "",
  bloodGroup: "",
  address: "",
  status: "active",
  admissionDate: "",
  graduationDate: "",
  emergencyNotes: "",
};

function toForm(student: Student): StudentForm {
  return {
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    middleName: student.middleName ?? "",
    lastName: student.lastName,
    preferredName: student.preferredName ?? "",
    gender: student.gender ?? "",
    dateOfBirth: student.dateOfBirth ?? "",
    birthPlace: student.birthPlace ?? "",
    nationality: student.nationality ?? "",
    nationalId: student.nationalId ?? "",
    bloodGroup: student.bloodGroup ?? "",
    address: student.address ?? "",
    status: student.status,
    admissionDate: student.admissionDate ?? "",
    graduationDate: student.graduationDate ?? "",
    emergencyNotes: student.emergencyNotes ?? "",
  };
}

function membershipUserName(membership: TenantMembership) {
  const user = membership.user;
  return user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    : "";
}

function toCreateInput(
  form: StudentForm,
  tenantId: string,
  membership: TenantMembership,
): CreateStudentInput {
  return {
    tenantId,
    branchId: membership.branchId,
    userId: membership.userId,
    studentNumber: form.studentNumber.trim(),
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || null,
    lastName: form.lastName.trim(),
    preferredName: form.preferredName.trim() || null,
    gender: form.gender || null,
    dateOfBirth: form.dateOfBirth || null,
    birthPlace: form.birthPlace.trim() || null,
    nationality: form.nationality.trim() || null,
    nationalId: form.nationalId.trim() || null,
    bloodGroup: form.bloodGroup.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
    admissionDate: form.admissionDate || null,
    graduationDate: form.graduationDate || null,
    emergencyNotes: form.emergencyNotes.trim() || null,
    customFields: {},
  };
}

function toUpdateInput(form: StudentForm): UpdateStudentInput {
  return {
    studentNumber: form.studentNumber.trim(),
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || null,
    lastName: form.lastName.trim(),
    preferredName: form.preferredName.trim() || null,
    gender: form.gender || null,
    dateOfBirth: form.dateOfBirth || null,
    birthPlace: form.birthPlace.trim() || null,
    nationality: form.nationality.trim() || null,
    nationalId: form.nationalId.trim() || null,
    bloodGroup: form.bloodGroup.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
    admissionDate: form.admissionDate || null,
    graduationDate: form.graduationDate || null,
    emergencyNotes: form.emergencyNotes.trim() || null,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function StudentProfilePage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMembershipId, setSelectedMembershipId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [membership, setMembership] = useState<TenantMembership | null>(null);
  const [roles, setRoles] = useState<TenantMembershipRole[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("userId");
    const membershipId =
      new URLSearchParams(window.location.search).get("membershipId") ?? "";
    if (userId) {
      setSelectedUserId(userId);
      setSelectedMembershipId(membershipId);
      return;
    }
    setPageError("Select a student membership from the membership table.");
    setLoading(false);
  }, []);

  const loadProfile = useCallback(async () => {
    if (!selectedUserId) {
      setLoading(false);
      setPageError("Select a student membership from the membership table.");
      return;
    }

    setLoading(true);
    setPageError(null);
    setActionError(null);
    try {
      const selectedTenantId = getAuthenticatedTenantId();
      const [membershipResult, roleResult] = await Promise.all([
        listTenantMemberships({
          tenantId: selectedTenantId,
          userId: selectedUserId,
        }),
        listTenantMembershipRoles(),
      ]);
      const tenantMembership = membershipResult.memberships.find(
        (item) =>
          (!selectedMembershipId || item.id === selectedMembershipId) &&
          item.userId === selectedUserId &&
          item.tenantId === selectedTenantId,
      );
      const roleMap = roleResult.roles;
      const studentMembership = tenantMembership
        ? roleMap
            .find((role) => role.id === tenantMembership.roleId)
            ?.code.toLowerCase()
            .replace(/_/g, "-") === "student"
        : false;

      if (!tenantMembership || !studentMembership) {
        throw new Error(
          "The selected user does not have a student membership in this school.",
        );
      }

      const studentResult = await listStudents({
        tenantId: selectedTenantId,
        userId: selectedUserId,
      });
      if (studentResult.students.length > 1) {
        throw new Error(
          "More than one student record is linked to this user. Resolve the duplicate records before editing.",
        );
      }

      const currentStudent = studentResult.students[0] ?? null;
      setTenantId(selectedTenantId);
      setMembership(tenantMembership);
      setRoles(roleMap);
      setStudent(currentStudent);
      setForm(
        currentStudent
          ? toForm(currentStudent)
          : {
              ...emptyForm,
              firstName: tenantMembership.user?.firstName ?? "",
              middleName: tenantMembership.user?.middleName ?? "",
              lastName: tenantMembership.user?.lastName ?? "",
            },
      );
      setEditing(!currentStudent);
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to load the student profile."),
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMembershipId, selectedUserId]);

  useEffect(() => {
    if (selectedUserId) void loadProfile();
  }, [loadProfile, selectedUserId]);

  function updateForm<Field extends keyof StudentForm>(
    field: Field,
    value: StudentForm[Field],
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
      const response = student
        ? await updateStudent(student.id, toUpdateInput(form), tenantId)
        : await createStudent(toCreateInput(form, tenantId, membership));
      setStudent(response.student);
      setForm(toForm(response.student));
      setEditing(false);
      setNotice(
        student ? "Student profile updated." : "Student profile created.",
      );
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to save the student profile."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeProfile() {
    if (!student || !tenantId) return;
    const confirmed = window.confirm(
      `Permanently delete the student record for ${student.firstName} ${student.lastName}?`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setActionError(null);
    setNotice(null);
    try {
      await deleteStudent(student.id, tenantId);
      setStudent(null);
      setForm({
        ...emptyForm,
        firstName: membership?.user?.firstName ?? student.firstName,
        middleName: membership?.user?.middleName ?? student.middleName ?? "",
        lastName: membership?.user?.lastName ?? student.lastName,
      });
      setEditing(true);
      setNotice("Student record deleted.");
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to delete the student record."),
      );
    } finally {
      setDeleting(false);
    }
  }

  const displayName =
    membership && membershipUserName(membership)
      ? membershipUserName(membership)
      : (membership?.user?.email ?? "Student");
  const roleName = membership
    ? (roles.find((role) => role.id === membership.roleId)?.name ?? "Student")
    : "Student";

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <Link href="/school_admin/memberships" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to memberships
          </Link>
          <p className={styles.eyebrow}>SCHOOL ADMINISTRATION</p>
          <h1>Student profile</h1>
          <p className={styles.subtitle}>
            View and manage the student record associated with this school
            member.
          </p>
        </div>
        {!loading && !pageError && student && !editing && (
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              onClick={() => {
                setForm(toForm(student));
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
          Loading selected student…
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
                  {student ? "Student details" : "Create student record"}
                </CardTitle>
                <CardDescription>
                  {student
                    ? `Student number ${student.studentNumber} · ${student.status}`
                    : "No student record is linked to this member yet. Complete the form to create one."}
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
                    <h3>Student identification</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Student number"
                        value={form.studentNumber}
                        onChange={(event) =>
                          updateForm("studentNumber", event.target.value)
                        }
                        required
                      />
                      <label className={styles.field}>
                        <span>Status</span>
                        <select
                          value={form.status}
                          onChange={(event) =>
                            updateForm(
                              "status",
                              event.target.value as StudentStatus,
                            )
                          }
                        >
                          {studentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status[0].toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>

                  <section className={styles.formSection}>
                    <h3>Name and personal details</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="First name"
                        value={form.firstName}
                        onChange={(event) =>
                          updateForm("firstName", event.target.value)
                        }
                        required
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
                        value={form.lastName}
                        onChange={(event) =>
                          updateForm("lastName", event.target.value)
                        }
                        required
                      />
                      <Input
                        label="Preferred name"
                        value={form.preferredName}
                        onChange={(event) =>
                          updateForm("preferredName", event.target.value)
                        }
                      />
                      <label className={styles.field}>
                        <span>Gender</span>
                        <select
                          value={form.gender}
                          onChange={(event) =>
                            updateForm("gender", event.target.value)
                          }
                        >
                          <option value="">Not specified</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </label>
                      <Input
                        label="Date of birth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(event) =>
                          updateForm("dateOfBirth", event.target.value)
                        }
                      />
                      <Input
                        label="Place of birth"
                        value={form.birthPlace}
                        onChange={(event) =>
                          updateForm("birthPlace", event.target.value)
                        }
                      />
                      <Input
                        label="Nationality"
                        value={form.nationality}
                        onChange={(event) =>
                          updateForm("nationality", event.target.value)
                        }
                      />
                      <Input
                        label="National ID"
                        value={form.nationalId}
                        onChange={(event) =>
                          updateForm("nationalId", event.target.value)
                        }
                      />
                      <Input
                        label="Blood group"
                        value={form.bloodGroup}
                        onChange={(event) =>
                          updateForm("bloodGroup", event.target.value)
                        }
                      />
                    </div>
                  </section>

                  <section className={styles.formSection}>
                    <h3>Enrollment and contact</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Admission date"
                        type="date"
                        value={form.admissionDate}
                        onChange={(event) =>
                          updateForm("admissionDate", event.target.value)
                        }
                      />
                      <Input
                        label="Graduation date"
                        type="date"
                        value={form.graduationDate}
                        onChange={(event) =>
                          updateForm("graduationDate", event.target.value)
                        }
                      />
                      <Input
                        label="Address"
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                      />
                      <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span>Emergency notes</span>
                        <textarea
                          value={form.emergencyNotes}
                          onChange={(event) =>
                            updateForm("emergencyNotes", event.target.value)
                          }
                          rows={4}
                        />
                      </label>
                    </div>
                  </section>

                  <div className={styles.formActions}>
                    {student && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={saving}
                        onClick={() => {
                          setForm(toForm(student));
                          setEditing(false);
                          setActionError(null);
                        }}
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
                      ) : student ? (
                        <Save aria-hidden="true" />
                      ) : (
                        <Check aria-hidden="true" />
                      )}
                      {saving
                        ? "Saving…"
                        : student
                          ? "Save changes"
                          : "Create student record"}
                    </Button>
                  </div>
                </form>
              ) : student ? (
                <dl className={styles.detailsGrid}>
                  <Detail
                    label="Student number"
                    value={student.studentNumber}
                  />
                  <Detail
                    label="Full name"
                    value={[
                      student.firstName,
                      student.middleName,
                      student.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <Detail label="Status" value={student.status} />
                  <Detail
                    label="Preferred name"
                    value={student.preferredName}
                  />
                  <Detail label="Gender" value={student.gender} />
                  <Detail label="Date of birth" value={student.dateOfBirth} />
                  <Detail label="Place of birth" value={student.birthPlace} />
                  <Detail label="Nationality" value={student.nationality} />
                  <Detail label="National ID" value={student.nationalId} />
                  <Detail label="Blood group" value={student.bloodGroup} />
                  <Detail
                    label="Admission date"
                    value={student.admissionDate}
                  />
                  <Detail
                    label="Graduation date"
                    value={student.graduationDate}
                  />
                  <Detail label="Address" value={student.address} />
                  <Detail
                    label="Emergency notes"
                    value={student.emergencyNotes}
                  />
                </dl>
              ) : null}
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
      <dd>{value?.trim() || "Not provided"}</dd>
    </div>
  );
}
