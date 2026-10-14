"use client";

import * as React from "react";
import { useRef } from "react";
import {
  Building2,
  Calendar,
  Camera,
  Edit,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getUserAvatarSrc } from "@/services/auth/user.service";
import styles from "../../app/super_admin/profile/page.module.css";

export interface UserProfileData {
  id: string;
  name: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  schoolName: string;
  campus?: string;
  avatarUrl?: string;
  joinDate?: string;
  status?: "pending" | "active" | "inactive" | "locked" | "archived";
  metrics?: Array<{ label: string; value: string | number }>;
}

export interface ProfileCardProps {
  user?: UserProfileData;
  onEdit?: () => void;
  onAvatarUpload?: (file: File) => void;
  className?: string;
}

const defaultUser: UserProfileData = {
  id: "USR-0042",
  name: "Dr. Jordan Miller",
  firstName: "Jordan",
  middleName: null,
  lastName: "Miller",
  email: "admin@adamshill.edu",
  phone: "+251 11 555 0184",
  role: "School Administrator",
  department: "Executive Management",
  schoolName: "Adams Hill Academy",
  campus: "Main Campus, Addis Ababa",
  joinDate: "August 2023",
  status: "active",
  metrics: [
    { label: "Managed Branches", value: "3" },
    { label: "Active Faculty", value: "48" },
    { label: "Compliance Score", value: "99.4%" },
  ],
};

export function ProfileCard({
  user = defaultUser,
  onEdit,
  onAvatarUpload,
  className,
}: ProfileCardProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className={className} variant="default" padding="none">
      {/* Decorative gradient banner */}
      <div className={styles.profileBanner}>
        <div className="absolute inset-0 bg-black/10" />
        <div className={styles.accountStatusPosition}>
          <span className={styles.accountStatus}>
            <span className="size-1.5 rounded-full bg-(--green)" />
            {user.status === "active"
              ? "Active Account"
              : user.status ?? "Account"}
          </span>
        </div>
      </div>

      <CardContent className={styles.profileContent}>
        {/* Avatar & Header actions */}
        <div className={styles.profileActions}>
          <div className="relative inline-block">
            <div className={styles.profileAvatar}>
              {user.avatarUrl ? (
                <img
                  src={getUserAvatarSrc(user.avatarUrl)}
                  alt={user.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-[#267a52] dark:text-[#52c98d]">
                  {initials}
                </span>
              )}
            </div>
            {onAvatarUpload && (
              <>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) onAvatarUpload(file);
                    event.currentTarget.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-lg bg-(--blue) p-2.5 text-white shadow-sm transition hover:bg-(--blue)/90"
                  aria-label="Update avatar"
                >
                  <Camera className="size-4" />
                </button>
              </>
            )}
          </div>

          <div className={styles.profileButtons}>
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="gap-1.5"
              >
                <Edit className="size-3.5" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* User Identity */}
        <div className={styles.profileIdentity}>
          <div className={styles.profileNameRow}>
            <h2 className={styles.profileName}>{user.name}</h2>
            <span className={styles.profileRole}>{user.role}</span>
          </div>

          <p className={styles.profileOrganization}>
            <Building2 className="size-3.5 text-(--muted)" />
            <span>{user.schoolName}</span>
            {user.department && (
              <>
                <span>•</span>
                <span>{user.department}</span>
              </>
            )}
          </p>
        </div>

        {/* Contact details grid */}
        <div className={styles.contactGrid}>
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-(--muted)" />
            <span className="text-(--foreground) font-medium truncate">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-(--muted)" />
              <span className="text-(--foreground) font-medium">{user.phone}</span>
            </div>
          )}

          {user.campus && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-(--muted)" />
              <span className="truncate">{user.campus}</span>
            </div>
          )}

          {user.joinDate && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-(--muted)" />
              <span>Joined {user.joinDate}</span>
            </div>
          )}
        </div>

        {/* Metrics summary */}
        {user.metrics && user.metrics.length > 0 && (
          <div className={styles.metricsGrid}>
            {user.metrics.map((m) => (
              <div key={m.label} className={styles.metric}>
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
