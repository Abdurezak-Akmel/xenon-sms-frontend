"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, Pencil, Save, UserRound, X } from "lucide-react";

import type { UserProfileData } from "@/components/profile/ProfileCard";
import { ProfilePageFeedback } from "@/components/profile/ProfilePageFeedback";
import { ProfilePageHeader } from "@/components/profile/ProfilePageHeader";
import { ProfileWorkspace } from "@/components/profile/ProfileWorkspace";
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
  getAuthenticatedRoleCode,
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
  createOwnGuardian,
  getOwnGuardians,
  updateOwnGuardian,
  type Guardian,
  type CreateOwnGuardianInput,
  type UpdateOwnGuardianInput,
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
};

const emptyGuardianForm: GuardianForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  relationshipDefault: "",
  phone: "",
  email: "",
  occupation: "",
  address: "",
  emergencyContact: false,
};

function toGuardianForm(guardian: Guardian): GuardianForm {
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
  };
}

function toGuardianInput(form: GuardianForm): CreateOwnGuardianInput {
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
  };
}

function toGuardianUpdate(form: GuardianForm): UpdateOwnGuardianInput {
  return toGuardianInput(form);
}

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
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [guardianForm, setGuardianForm] =
    useState<GuardianForm>(emptyGuardianForm);
  const [guardianLoading, setGuardianLoading] = useState(true);
  const [guardianEditing, setGuardianEditing] = useState(false);
  const [guardianSaving, setGuardianSaving] = useState(false);
  const [guardianLoadError, setGuardianLoadError] = useState<string | null>(
    null,
  );
  const [guardianError, setGuardianError] = useState<string | null>(null);
  const [guardianNotice, setGuardianNotice] = useState<string | null>(null);

  const loadGuardianProfile = useCallback(async (profileUser: User) => {
    setGuardianLoading(true);
    setGuardianLoadError(null);
    setGuardianError(null);
    try {
      const roleCode = getAuthenticatedRoleCode();
      const normalizedRoleCode = roleCode
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-");
      if (
        normalizedRoleCode !== "parent" &&
        normalizedRoleCode !== "parent-guardian"
      ) {
        setGuardian(null);
        setGuardianLoadError("Guardian profile is available to parent accounts.");
        return;
      }

      const response = await getOwnGuardians();
      if (response.guardians.length > 1) {
        setGuardian(null);
        setGuardianLoadError(
          "Multiple guardian records are linked to your account. Please contact your school administrator.",
        );
        return;
      }

      const currentGuardian = response.guardians[0] ?? null;
      setGuardian(currentGuardian);
      setGuardianForm(
        currentGuardian
          ? toGuardianForm(currentGuardian)
          : {
              ...emptyGuardianForm,
              firstName: profileUser.firstName,
              middleName: profileUser.middleName ?? "",
              lastName: profileUser.lastName,
              email: profileUser.email,
              phone: profileUser.phone ?? "",
            },
      );
      setGuardianEditing(false);
    } catch (loadError) {
      setGuardianLoadError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your guardian profile.",
      );
    } finally {
      setGuardianLoading(false);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCurrentUser();
      setUser(response.user);
      setProfile(toProfile(response.user));
      await loadGuardianProfile(response.user);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  }, [loadGuardianProfile]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

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

  const saveGuardianProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGuardianSaving(true);
    setGuardianError(null);
    setGuardianNotice(null);
    try {
      const response = guardian
        ? await updateOwnGuardian(toGuardianUpdate(guardianForm))
        : await createOwnGuardian(toGuardianInput(guardianForm));
      setGuardian(response.guardian);
      setGuardianForm(toGuardianForm(response.guardian));
      setGuardianEditing(false);
      setGuardianNotice(
        guardian
          ? "Guardian profile updated successfully."
          : "Guardian profile created successfully.",
      );
    } catch (saveError) {
      setGuardianError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your guardian profile.",
      );
    } finally {
      setGuardianSaving(false);
    }
  };

  function updateGuardianForm<Field extends keyof GuardianForm>(
    field: Field,
    value: GuardianForm[Field],
  ) {
    setGuardianForm((current) => ({ ...current, [field]: value }));
  }

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

          <Card padding="default" className={styles.guardianCard}>
            <CardHeader className={styles.guardianHeader}>
              <div className={styles.guardianHeading}>
                <span className={styles.guardianIcon}>
                  <UserRound size={19} aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>Guardian profile</CardTitle>
                  <CardDescription>
                    Maintain the contact details your school uses for your
                    family record.
                  </CardDescription>
                </div>
              </div>
              {!guardianLoading && !guardianLoadError && !guardianEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setGuardianError(null);
                    setGuardianNotice(null);
                    setGuardianEditing(true);
                  }}
                >
                  {guardian ? (
                    <>
                      <Pencil aria-hidden="true" />
                      Edit profile
                    </>
                  ) : (
                    "Create profile"
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {guardianLoading ? (
                <p className={styles.guardianFeedback}>
                  <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
                  Loading guardian profile…
                </p>
              ) : guardianLoadError ? (
                <div className={styles.guardianError} role="alert">
                  <p>{guardianLoadError}</p>
                  <Button
                    variant="outline"
                    onClick={() => void loadGuardianProfile(user)}
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <>
                  {guardianNotice && (
                    <p className={styles.guardianNotice} role="status">
                      <Check size={16} aria-hidden="true" />
                      {guardianNotice}
                    </p>
                  )}
                  {guardianEditing ? (
                    <form
                      className={styles.guardianForm}
                      onSubmit={saveGuardianProfile}
                    >
                      <div className={styles.guardianFormGrid}>
                        <Input
                          label="First name"
                          required
                          value={guardianForm.firstName}
                          onChange={(event) =>
                            updateGuardianForm("firstName", event.target.value)
                          }
                        />
                        <Input
                          label="Middle name"
                          value={guardianForm.middleName}
                          onChange={(event) =>
                            updateGuardianForm("middleName", event.target.value)
                          }
                        />
                        <Input
                          label="Last name"
                          required
                          value={guardianForm.lastName}
                          onChange={(event) =>
                            updateGuardianForm("lastName", event.target.value)
                          }
                        />
                        <Input
                          label="Relationship to student"
                          value={guardianForm.relationshipDefault}
                          onChange={(event) =>
                            updateGuardianForm(
                              "relationshipDefault",
                              event.target.value,
                            )
                          }
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          value={guardianForm.phone}
                          onChange={(event) =>
                            updateGuardianForm("phone", event.target.value)
                          }
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={guardianForm.email}
                          onChange={(event) =>
                            updateGuardianForm("email", event.target.value)
                          }
                        />
                        <Input
                          label="Occupation"
                          value={guardianForm.occupation}
                          onChange={(event) =>
                            updateGuardianForm("occupation", event.target.value)
                          }
                        />
                        <Input
                          label="Address"
                          value={guardianForm.address}
                          onChange={(event) =>
                            updateGuardianForm("address", event.target.value)
                          }
                        />
                        <label className={styles.emergencyToggle}>
                          <input
                            type="checkbox"
                            checked={guardianForm.emergencyContact}
                            onChange={(event) =>
                              updateGuardianForm(
                                "emergencyContact",
                                event.target.checked,
                              )
                            }
                          />
                          Emergency contact
                        </label>
                      </div>
                      {guardianError && (
                        <p className={styles.guardianErrorText} role="alert">
                          {guardianError}
                        </p>
                      )}
                      <div className={styles.guardianFormActions}>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={guardianSaving}
                          onClick={() => {
                            setGuardianError(null);
                            setGuardianNotice(null);
                            setGuardianForm(
                              guardian
                                ? toGuardianForm(guardian)
                                : {
                                    ...emptyGuardianForm,
                                    firstName: user.firstName,
                                    middleName: user.middleName ?? "",
                                    lastName: user.lastName,
                                    email: user.email,
                                    phone: user.phone ?? "",
                                  },
                            );
                            setGuardianEditing(false);
                          }}
                        >
                          <X aria-hidden="true" />
                          Cancel
                        </Button>
                        <Button type="submit" disabled={guardianSaving}>
                          {guardianSaving ? (
                            <LoaderCircle
                              className="animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Save aria-hidden="true" />
                          )}
                          {guardianSaving ? "Saving…" : "Save profile"}
                        </Button>
                      </div>
                    </form>
                  ) : guardian ? (
                    <div className={styles.guardianDetails}>
                      <div>
                        <span>Name</span>
                        <strong>
                          {[guardian.firstName, guardian.middleName, guardian.lastName]
                            .filter(Boolean)
                            .join(" ")}
                        </strong>
                      </div>
                      <div>
                        <span>Relationship</span>
                        <strong>{guardian.relationshipDefault || "Not provided"}</strong>
                      </div>
                      <div>
                        <span>Phone</span>
                        <strong>{guardian.phone || "Not provided"}</strong>
                      </div>
                      <div>
                        <span>Email</span>
                        <strong>{guardian.email || "Not provided"}</strong>
                      </div>
                      <div>
                        <span>Occupation</span>
                        <strong>{guardian.occupation || "Not provided"}</strong>
                      </div>
                      <div>
                        <span>Address</span>
                        <strong>{guardian.address || "Not provided"}</strong>
                      </div>
                      <div>
                        <span>Emergency contact</span>
                        <strong>{guardian.emergencyContact ? "Yes" : "No"}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.guardianEmpty}>
                      <p>
                        There is no guardian record linked to your account yet.
                        Create one to provide your contact information to the
                        school.
                      </p>
                      <Button
                        onClick={() => {
                          setGuardianNotice(null);
                          setGuardianEditing(true);
                        }}
                      >
                        Create guardian profile
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
