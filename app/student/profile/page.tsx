"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Pencil, RotateCcw, UserRound, X } from "lucide-react";

import type { UserProfileData } from "@/components/profile/ProfileCard";
import { ProfilePageFeedback } from "@/components/profile/ProfilePageFeedback";
import { ProfilePageHeader } from "@/components/profile/ProfilePageHeader";
import { ProfileWorkspace } from "@/components/profile/ProfileWorkspace";

import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

// Service Functions
import {
  type User,
  getCurrentUser,
  updateCurrentUserProfile,
  updateCurrentUserAvatar,
} from "@/services/auth/user.service";
import {
  beginMfaDisable,
  beginMfaSetup,
  disableMfa,
  enableMfa,
  type MfaSetupResponse,
} from "@/services/auth/mfa.service";
import {
  createOwnStudent,
  getOwnStudent,
  updateOwnStudent,
  type Student,
  type UpdateOwnStudentInput,
} from "@/services/community/students.service";

import styles from "./page.module.css";

function displayRole(user: User) {
  const roleCode = user.metadata.roleCode;
  if (typeof roleCode !== "string") return "Platform Administrator";
  if (roleCode === "super-admin") return "Platform Super Administrator";
  return roleCode
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toProfile(user: User): UserProfileData {
  const fullName = [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    id: user.id,
    name: fullName,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    role: displayRole(user),
    schoolName: "Xenon Platform",
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
    joinDate: new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(new Date(user.createdAt)),
    status: user.status,
  };
}

type StudentProfileForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  gender: "" | "male" | "female";
  dateOfBirth: string;
  birthPlace: string;
  nationality: string;
  nationalId: string;
  bloodGroup: string;
  address: string;
  emergencyNotes: string;
};

function toStudentProfileForm(student: Student): StudentProfileForm {
  const gender = student.gender?.toLowerCase();
  return {
    firstName: student.firstName,
    middleName: student.middleName ?? "",
    lastName: student.lastName,
    preferredName: student.preferredName ?? "",
    gender: gender === "male" || gender === "female" ? gender : "",
    dateOfBirth: student.dateOfBirth ?? "",
    birthPlace: student.birthPlace ?? "",
    nationality: student.nationality ?? "",
    nationalId: student.nationalId ?? "",
    bloodGroup: student.bloodGroup ?? "",
    address: student.address ?? "",
    emergencyNotes: student.emergencyNotes ?? "",
  };
}

function displayStudentValue(value: string | null) {
  return value?.trim() || "Not provided";
}

function displayStudentGender(value: string | null) {
  const gender = value?.toLowerCase();
  if (gender === "male" || gender === "female") {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }
  return "Not provided";
}

function StudentProfileSection({
  student,
  loading,
  creating,
  saving,
  error,
  onRetry,
  onCreate,
  onSave,
}: {
  student: Student | null;
  loading: boolean;
  creating: boolean;
  saving: boolean;
  error: string | null;
  onRetry: () => void;
  onCreate: (studentNumber: string) => Promise<void>;
  onSave: (changes: UpdateOwnStudentInput) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<StudentProfileForm | null>(null);
  const [studentNumber, setStudentNumber] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (student) setForm(toStudentProfileForm(student));
  }, [student]);

  const updateField = <Field extends keyof StudentProfileForm>(
    field: Field,
    value: StudentProfileForm[Field],
  ) => {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    try {
      await onSave({
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
        emergencyNotes: form.emergencyNotes.trim() || null,
      });
      setEditing(false);
    } catch {
      // The parent displays the request error.
    }
  };

  const submitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = studentNumber.trim();
    if (!value) return;

    setCreateError(null);
    try {
      await onCreate(value);
      setStudentNumber("");
    } catch (createError) {
      setCreateError(
        createError instanceof Error
          ? createError.message
          : "Unable to create your student record.",
      );
    }
  };

  return (
    <Card variant="default" padding="default" className="overflow-hidden">
      <CardHeader className="flex-wrap border-b border-(--line) pb-5">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-(--blue)/10 text-(--blue)">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <CardTitle className="text-lg">Student record</CardTitle>
            <CardDescription>
              Personal details associated with your school record.
            </CardDescription>
          </div>
        </div>
        {student && !editing && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              setForm(toStudentProfileForm(student));
              setEditing(true);
            }}
          >
            <Pencil aria-hidden="true" />
            Edit student details
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {loading && (
          <p
            className="flex items-center gap-2 rounded-lg bg-(--background) px-4 py-3 text-sm text-(--muted)"
            role="status"
          >
            <span className="size-4 animate-spin rounded-full border-2 border-(--blue)/30 border-t-(--blue)" />
            Loading student record…
          </p>
        )}
        {!loading && error && (
          <div className="grid justify-items-start gap-3 rounded-xl border border-(--red)/20 bg-(--red)/5 p-4">
            <p className="text-sm text-(--red)" role="alert">
              {error}
            </p>
            <Button type="button" size="sm" variant="outline" onClick={onRetry}>
              <RotateCcw aria-hidden="true" />
              Try again
            </Button>
          </div>
        )}
        {!loading && !error && !student && (
          <div className="grid justify-items-start gap-5 rounded-xl border border-dashed border-(--line) bg-(--background)/60 p-5 sm:p-6">
            <div>
              <h4 className="font-semibold text-(--foreground)">
                Set up your student record
              </h4>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-(--muted)">
                No student record is linked to your account yet. Enter the
                student number assigned by your school to create your profile.
              </p>
            </div>
            <form
              onSubmit={submitCreate}
              className="flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-end"
            >
              <Input
                label="School-assigned student number"
                value={studentNumber}
                onChange={(event) => setStudentNumber(event.target.value)}
                required
                disabled={creating}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="lg"
                disabled={creating || !studentNumber.trim()}
                className="sm:mb-px"
              >
                {creating ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                ) : (
                  <Check aria-hidden="true" />
                )}
                {creating ? "Creating..." : "Create student record"}
              </Button>
            </form>
            {createError && (
              <p className="text-sm text-(--red)" role="alert">
                {createError}
              </p>
            )}
          </div>
        )}
        {!loading && student && (
          <>
            {error && (
              <p className="mb-4 text-sm text-(--red)" role="alert">
                {error}
              </p>
            )}
            {editing && form ? (
              <form onSubmit={submit} className="space-y-6">
                <section className="rounded-xl border border-(--line) bg-(--background)/50 p-4 sm:p-5">
                  <h4 className="mb-4 text-sm font-semibold text-(--foreground)">
                    Name on student record
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Input
                      label="First name"
                      value={form.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                      required
                    />
                    <Input
                      label="Middle name"
                      value={form.middleName}
                      onChange={(event) =>
                        updateField("middleName", event.target.value)
                      }
                    />
                    <Input
                      label="Last name"
                      value={form.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                      required
                    />
                  </div>
                </section>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="Preferred name"
                    value={form.preferredName}
                    onChange={(event) =>
                      updateField("preferredName", event.target.value)
                    }
                  />
                  <label className="grid content-start gap-1.5 text-xs font-semibold text-(--foreground)">
                    <span>Gender</span>
                    <select
                      className="h-10 w-full rounded-lg border border-(--line) bg-(--card) px-3.5 text-sm font-normal text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15"
                      value={form.gender}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "" || value === "male" || value === "female") {
                          updateField("gender", value);
                        }
                      }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                  <Input
                    label="Date of birth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) =>
                      updateField("dateOfBirth", event.target.value)
                    }
                  />
                  <Input
                    label="Place of birth"
                    value={form.birthPlace}
                    onChange={(event) =>
                      updateField("birthPlace", event.target.value)
                    }
                  />
                  <Input
                    label="Nationality"
                    value={form.nationality}
                    onChange={(event) =>
                      updateField("nationality", event.target.value)
                    }
                  />
                  <Input
                    label="National ID"
                    value={form.nationalId}
                    onChange={(event) =>
                      updateField("nationalId", event.target.value)
                    }
                  />
                  <Input
                    label="Blood group"
                    value={form.bloodGroup}
                    onChange={(event) =>
                      updateField("bloodGroup", event.target.value)
                    }
                  />
                  <Input
                    label="Address"
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                  />
                  <label className="grid gap-1.5 text-xs font-semibold text-(--foreground)">
                    <span>Emergency notes</span>
                    <textarea
                      className="min-h-24 w-full rounded-lg border border-(--line) bg-(--card) px-3.5 py-2 text-sm text-(--foreground) outline-none transition focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15"
                      value={form.emergencyNotes}
                      onChange={(event) =>
                        updateField("emergencyNotes", event.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="flex flex-col-reverse justify-end gap-2 border-t border-(--line) pt-4 sm:flex-row">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={saving}
                    onClick={() => {
                      setForm(toStudentProfileForm(student));
                      setEditing(false);
                    }}
                  >
                    <X aria-hidden="true" />
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={saving}>
                    {saving ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                    ) : (
                      <Check aria-hidden="true" />
                    )}
                    {saving ? "Saving…" : "Save student details"}
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                    Student name
                  </dt>
                  <dd className="mt-1.5 font-medium text-(--foreground)">
                    {[student.firstName, student.middleName, student.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                    Student number
                  </dt>
                  <dd className="mt-1.5 font-medium text-(--foreground)">
                    {student.studentNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                    Status
                  </dt>
                  <dd className="mt-1.5 inline-flex rounded-full bg-(--blue)/10 px-2.5 py-1 text-xs font-semibold capitalize text-(--blue)">
                    {student.status}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Preferred name
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.preferredName)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Gender
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentGender(student.gender)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Date of birth
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.dateOfBirth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Place of birth
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.birthPlace)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Nationality
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.nationality)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    National ID
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.nationalId)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Blood group
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.bloodGroup)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Address
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.address)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Admission date
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.admissionDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-(--muted)">
                    Graduation date
                  </dt>
                  <dd className="mt-1 text-sm text-(--foreground)">
                    {displayStudentValue(student.graduationDate)}
                  </dd>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <dt className="text-xs font-semibold text-(--muted)">
                    Emergency notes
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-(--foreground)">
                    {displayStudentValue(student.emergencyNotes)}
                  </dd>
                </div>
                {Object.keys(student.customFields).length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <dt className="text-xs font-semibold text-(--muted)">
                      Additional student details
                    </dt>
                    <dd>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap wrap-break-word text-sm text-(--foreground)">
                        {JSON.stringify(student.customFields, null, 2)}
                      </pre>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaSetup, setMfaSetup] = useState<MfaSetupResponse | null>(null);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [studentSaving, setStudentSaving] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCurrentUser();
      setUser(response.user);
      setProfile(toProfile(response.user));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStudentProfile = useCallback(async () => {
    setStudentLoading(true);
    setStudentError(null);
    try {
      const response = await getOwnStudent();
      setStudent(response.student);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 404) {
        setStudent(null);
        return;
      }
      setStudentError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your student record.",
      );
    } finally {
      setStudentLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
    void loadStudentProfile();
  }, [loadProfile, loadStudentProfile]);

  const saveProfile = async (changes: Partial<UserProfileData>) => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const response = await updateCurrentUserProfile({
        firstName: changes.firstName ?? profile?.firstName ?? "",
        middleName:
          changes.middleName !== undefined
            ? changes.middleName
            : (profile?.middleName ?? null),
        lastName: changes.lastName ?? profile?.lastName ?? "",
        phone: changes.phone?.trim() ? changes.phone.trim() : null,
      });
      setUser(response.user);
      setProfile(toProfile(response.user));
      setEditing(false);
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save profile changes.";
      setError(message);
      throw saveError;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploadingAvatar(true);
    setError(null);
    try {
      const response = await updateCurrentUserAvatar(file);
      setUser(response.user);
      setProfile(toProfile(response.user));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload your profile photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveStudentProfile = async (
    changes: Parameters<typeof updateOwnStudent>[0],
  ) => {
    setStudentSaving(true);
    setStudentError(null);
    try {
      const response = await updateOwnStudent(changes);
      setStudent(response.student);
    } catch (saveError) {
      setStudentError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your student details.",
      );
      throw saveError;
    } finally {
      setStudentSaving(false);
    }
  };

  const createStudentProfile = async (studentNumber: string) => {
    setStudentSaving(true);
    try {
      const response = await createOwnStudent(studentNumber);
      setStudent(response.student);
    } finally {
      setStudentSaving(false);
    }
  };

  const startMfaSetup = async () => {
    setMfaBusy(true);
    setMfaError(null);
    try {
      setMfaSetup(await beginMfaSetup());
    } catch (setupError) {
      setMfaError(
        setupError instanceof Error
          ? setupError.message
          : "Unable to send an MFA verification code.",
      );
    } finally {
      setMfaBusy(false);
    }
  };

  const startMfaDisable = async () => {
    setMfaBusy(true);
    setMfaError(null);
    try {
      await beginMfaDisable();
    } catch (setupError) {
      setMfaError(
        setupError instanceof Error
          ? setupError.message
          : "Unable to send an MFA verification code.",
      );
    } finally {
      setMfaBusy(false);
    }
  };

  const confirmMfa = async (code: string, action: "enable" | "disable") => {
    setMfaBusy(true);
    setMfaError(null);
    try {
      const response =
        action === "enable" ? await enableMfa(code) : await disableMfa(code);
      setUser(response.user);
      setProfile(toProfile(response.user));
      setMfaSetup(null);
    } catch (mfaActionError) {
      setMfaError(
        mfaActionError instanceof Error
          ? mfaActionError.message
          : `Unable to ${action} two-factor authentication.`,
      );
    } finally {
      setMfaBusy(false);
    }
  };

  return (
    <main className={styles.profilePage}>
      <ProfilePageHeader />
      {loading && (
        <ProfilePageFeedback message="Loading your profile…" loading />
      )}
      {!loading && error && !profile && (
        <ProfilePageFeedback
          message={error}
          onRetry={() => void loadProfile()}
        />
      )}
      {!loading && profile && user && (
        <>
          <ProfileWorkspace
            profile={profile}
            user={user}
            editing={editing}
            saving={saving}
            uploadingAvatar={uploadingAvatar}
            error={error}
            mfaBusy={mfaBusy}
            mfaSetup={mfaSetup}
            mfaError={mfaError}
            onEdit={() => {
              setError(null);
              setEditing((current) => !current);
            }}
            onSave={saveProfile}
            onAvatarUpload={(file) => void uploadAvatar(file)}
            onBeginMfaSetup={startMfaSetup}
            onBeginMfaDisable={startMfaDisable}
            onEnableMfa={(code) => confirmMfa(code, "enable")}
            onDisableMfa={(code) => confirmMfa(code, "disable")}
            onCancel={() => {
              setError(null);
              setEditing(false);
            }}
          />
          <section className="mt-6">
            <StudentProfileSection
              student={student}
              loading={studentLoading}
              creating={studentSaving}
              saving={studentSaving}
              error={studentError}
              onRetry={() => void loadStudentProfile()}
              onCreate={createStudentProfile}
              onSave={saveStudentProfile}
            />
          </section>
        </>
      )}
    </main>
  );
}
