"use client";

import * as React from "react";
import {
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  schoolName: string;
  campus?: string;
  avatarUrl?: string;
  joinDate?: string;
  status?: "active" | "on_leave" | "archived";
  metrics?: Array<{ label: string; value: string | number }>;
}

export interface ProfileCardProps {
  user?: UserProfileData;
  onEdit?: () => void;
  onSecurityClick?: () => void;
  className?: string;
}

const defaultUser: UserProfileData = {
  id: "USR-0042",
  name: "Dr. Jordan Miller",
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
  onSecurityClick,
  className,
}: ProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className={className} variant="default" padding="none">
      {/* Decorative gradient banner */}
      <div className="h-28 bg-gradient-to-r from-(--blue) via-[#2e5ebf] to-(--violet) rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur">
            <span className="size-1.5 rounded-full bg-(--green)" />
            {user.status === "active" ? "Active Account" : "Staff"}
          </span>
        </div>
      </div>

      <CardContent className="px-6 pb-6 pt-0">
        {/* Avatar & Header actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
          <div className="relative inline-block">
            <div className="size-24 rounded-2xl border-4 border-(--card) bg-[#d9efe5] dark:bg-[#153e2d] text-(--blue) flex items-center justify-center text-2xl font-bold shadow-md overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-[#267a52] dark:text-[#52c98d]">{initials}</span>
              )}
            </div>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-(--blue) text-white shadow-sm hover:bg-(--blue)/90 transition"
                aria-label="Update avatar"
              >
                <Camera className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="gap-1.5">
                <Edit className="size-3.5" /> Edit Profile
              </Button>
            )}
            {onSecurityClick && (
              <Button size="sm" variant="outline" onClick={onSecurityClick} className="gap-1.5">
                <ShieldCheck className="size-3.5" /> Security
              </Button>
            )}
          </div>
        </div>

        {/* User Identity */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-(--foreground) tracking-tight">
              {user.name}
            </h2>
            <span className="rounded-md bg-(--blue-soft) px-2 py-0.5 text-xs font-semibold text-(--blue)">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-(--muted) mt-1 flex items-center gap-1.5">
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
        <div className="mt-5 grid sm:grid-cols-2 gap-3 border-t border-(--line) pt-4 text-xs text-(--muted)">
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
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-(--line) pt-4">
            {user.metrics.map((m) => (
              <div key={m.label} className="rounded-lg bg-(--background) p-2.5 text-center">
                <span className="block text-base font-bold text-(--foreground)">{m.value}</span>
                <span className="block text-[10px] text-(--muted) mt-0.5">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
