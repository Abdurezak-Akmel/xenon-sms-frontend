"use client";

import { EditProfileForm } from "@/components/profile/EditProfileForm";
import {
  ProfileCard,
  type UserProfileData,
} from "@/components/profile/ProfileCard";
import type { User } from "@/services/auth/user.service";

import { AccountSecurityCard } from "./AccountSecurityCard";
import styles from "../../app/super_admin/profile/page.module.css";
import type { MfaSetupResponse } from "@/services/auth/mfa.service";

export interface ProfileWorkspaceProps {
  profile: UserProfileData;
  editing: boolean;
  user: User;
  saving: boolean;
  uploadingAvatar: boolean;
  error: string | null;
  mfaBusy: boolean;
  mfaSetup: MfaSetupResponse | null;
  mfaError: string | null;
  onEdit: () => void;
  onSave: (changes: Partial<UserProfileData>) => Promise<void>;
  onAvatarUpload: (file: File) => void;
  onBeginMfaSetup: () => Promise<void>;
  onEnableMfa: (code: string) => Promise<void>;
  onDisableMfa: (code: string) => Promise<void>;
  onCancel: () => void;
}

export function ProfileWorkspace({
  profile,
  editing,
  user,
  saving,
  uploadingAvatar,
  error,
  mfaBusy,
  mfaSetup,
  mfaError,
  onEdit,
  onSave,
  onAvatarUpload,
  onBeginMfaSetup,
  onEnableMfa,
  onDisableMfa,
  onCancel,
}: ProfileWorkspaceProps) {
  return (
    <>
      <div className={styles.profileGrid}>
        <div className={styles.primaryColumn}>
          <ProfileCard
            user={profile}
            onEdit={onEdit}
            onAvatarUpload={onAvatarUpload}
          />
          {editing && (
            <EditProfileForm
              className={styles.editForm}
              initialData={profile}
              saving={saving}
              error={error}
              onSave={onSave}
              onCancel={onCancel}
            />
          )}
          {uploadingAvatar && (
            <p className={styles.uploadStatus} role="status">
              Uploading profile photo…
            </p>
          )}
          {error && !editing && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}
        </div>
        <AccountSecurityCard
          mfaEnabled={user.mfaEnabled}
          lastLoginAt={user.lastLoginAt}
          mfaBusy={mfaBusy}
          setupUri={mfaSetup?.provisioningUri ?? null}
          error={mfaError}
          onBeginSetup={onBeginMfaSetup}
          onEnable={onEnableMfa}
          onDisable={onDisableMfa}
        />
      </div>
    </>
  );
}
