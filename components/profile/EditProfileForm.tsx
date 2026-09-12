"use client";

import * as React from "react";
import { Check, Mail, Phone, Save, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import type { UserProfileData } from "./ProfileCard";

export interface EditProfileFormProps {
  initialData?: Partial<UserProfileData>;
  onSave?: (data: Partial<UserProfileData>) => void;
  onCancel?: () => void;
  className?: string;
}

export function EditProfileForm({
  initialData,
  onSave,
  onCancel,
  className,
}: EditProfileFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name ?? "Dr. Jordan Miller",
    email: initialData?.email ?? "admin@adamshill.edu",
    phone: initialData?.phone ?? "+251 11 555 0184",
    role: initialData?.role ?? "School Administrator",
    department: initialData?.department ?? "Executive Management",
    campus: initialData?.campus ?? "Main Campus, Addis Ababa",
    emailNotifications: true,
    smsAlerts: false,
  });

  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      onSave?.(formData);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 600);
  };

  return (
    <Card className={className} variant="default" padding="default">
      <CardHeader>
        <CardTitle className="text-lg">Edit Personal Information</CardTitle>
        <CardDescription>
          Update your public contact details, emergency notifications, and institutional title.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {savedSuccess && (
            <div className="rounded-lg bg-[#e8f6ee] dark:bg-[#183929] border border-(--green)/30 p-3 text-xs text-(--green) flex items-center gap-2">
              <Check className="size-4 shrink-0" />
              <span>Your profile details have been successfully synchronized.</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              startIcon={<User className="size-4" />}
            />

            <Input
              label="Official Institutional Role"
              value={formData.role}
              disabled
              helperText="Assigned by Tenant Super-Administrator"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Official Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              startIcon={<Mail className="size-4" />}
            />

            <Input
              label="Contact Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              startIcon={<Phone className="size-4" />}
              placeholder="+251 ..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Department / Faculty"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />

            <Input
              label="Assigned Campus Location"
              value={formData.campus}
              onChange={(e) => handleChange("campus", e.target.value)}
            />
          </div>

          {/* Preferences */}
          <div className="pt-2 border-t border-(--line)">
            <label className="text-xs font-semibold text-(--foreground) block mb-2">
              Communication & Alert Preferences
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-(--muted) cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  className="rounded border-(--line) text-(--blue)"
                />
                <span>Receive daily academic attendance summaries & emergency memos via email</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-(--muted) cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.smsAlerts}
                  onChange={(e) => handleChange("smsAlerts", e.target.checked)}
                  className="rounded border-(--line) text-(--blue)"
                />
                <span>Receive instant SMS alerts for payment settlement & visitor entry passes</span>
              </label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-2.5">
          {onCancel && (
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
            <Save className="size-3.5" />
            {saving ? "Saving changes..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
