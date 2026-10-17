"use client";

import { useCallback, useEffect, useState } from "react";

// UI Components
import type { UserProfileData } from "@/components/profile/ProfileCard";
import { ProfilePageFeedback } from "@/components/profile/ProfilePageFeedback";
import { ProfilePageHeader } from "@/components/profile/ProfilePageHeader";
import { ProfileWorkspace } from "@/components/profile/ProfileWorkspace";

// Stylesheet
import styles from "./page.module.css";

// Service Functions
import {
  type User,
  getAuthenticatedTenantId,
  getCurrentUser,
  updateCurrentUserProfile,
  updateCurrentUserAvatar,
} from "@/services/auth/user.service";
import { getTenant } from "@/services/tenancy/tenant.service";

import {
  beginMfaDisable,
  beginMfaSetup,
  disableMfa,
  enableMfa,
  type MfaSetupResponse,
} from "@/services/auth/mfa.service";

function toProfile(user: User, schoolName: string): UserProfileData {
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
    role: "School Administrator",
    schoolName,
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
    joinDate: new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(new Date(user.createdAt)),
    status: user.status,
  };
}

export default function SchoolAdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaSetup, setMfaSetup] = useState<MfaSetupResponse | null>(null);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tenantId = getAuthenticatedTenantId();
      const [response, tenantResponse] = await Promise.all([
        getCurrentUser(),
        getTenant(tenantId),
      ]);
      setSchoolName(tenantResponse.tenant.displayName);
      setUser(response.user);
      setProfile(toProfile(response.user, tenantResponse.tenant.displayName));
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
      setProfile(toProfile(response.user, schoolName));
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
      setProfile(toProfile(response.user, schoolName));
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
      setProfile(toProfile(response.user, schoolName));
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
      )}
    </main>
  );
}
