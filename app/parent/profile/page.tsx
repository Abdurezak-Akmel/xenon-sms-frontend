"use client";

import { useCallback, useEffect, useState } from "react";

import type { UserProfileData } from "@/components/profile/ProfileCard";
import { ProfilePageFeedback } from "@/components/profile/ProfilePageFeedback";
import { ProfilePageHeader } from "@/components/profile/ProfilePageHeader";
import { ProfileWorkspace } from "@/components/profile/ProfileWorkspace";

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
