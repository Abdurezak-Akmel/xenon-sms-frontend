"use client";

import * as React from "react";
import { Check, Mail, Phone, Save, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { UserProfileData } from "./ProfileCard";

export interface EditProfileFormProps {
  initialData?: Partial<UserProfileData>;
  onSave: (data: Partial<UserProfileData>) => Promise<void>;
  saving?: boolean;
  error?: string | null;
  onCancel?: () => void;
  className?: string;
}

export function EditProfileForm({
  initialData,
  onSave,
  saving = false,
  error,
  onCancel,
  className,
}: EditProfileFormProps) {
  const [formData, setFormData] = React.useState({
    firstName: initialData?.firstName ?? "",
    middleName: initialData?.middleName ?? "",
    lastName: initialData?.lastName ?? "",
    email: initialData?.email ?? "admin@adamshill.edu",
    phone: initialData?.phone ?? "",
    role: initialData?.role ?? "School Administrator",
  });

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    try {
      await onSave({
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim() || null,
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
      });
      setSavedSuccess(true);
      window.setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // The parent owns and displays the request error.
    }
  };

  return (
    <Card className={className} variant="default" padding="default">
      <CardHeader className="mb-7">
        <CardTitle className="text-lg">Edit Personal Information</CardTitle>
        <CardDescription>
          Update your personal contact information. Your email is managed by
          your administrator.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-7">
          {savedSuccess && (
            <div className="flex items-center gap-3 rounded-lg border border-(--green)/30 bg-[#e8f6ee] p-4 text-sm text-(--green) dark:bg-[#183929]">
              <Check className="size-4 shrink-0" />
              <span>
                Your profile details have been successfully synchronized.
              </span>
            </div>
          )}

          {error && (
            <div
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-3">
            <Input
              label="First name"
              required
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              startIcon={<User className="size-4" />}
            />
            <Input
              label="Middle name"
              value={formData.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
              placeholder="Optional"
            />
            <Input
              label="Last name"
              required
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Email address"
              type="email"
              value={formData.email}
              disabled
              helperText="Email changes require administrator support."
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

        </CardContent>

        <CardFooter className="mt-7 justify-end gap-3 pt-6">
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
