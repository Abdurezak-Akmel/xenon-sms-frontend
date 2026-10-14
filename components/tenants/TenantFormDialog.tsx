"use client";

import type { FormEvent } from "react";
import { Globe2, LoaderCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/forms/Form";
import { Button } from "@/components/ui/Button";
import { Modal, ModalBody } from "@/components/ui/Modal";
import type { TenantStatus } from "@/services/tenancy/tenant.service";

export type TenantFormValues = {
  code: string;
  legalName: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  countryCode: string;
  timezone: string;
  currencyCode: string;
  status: TenantStatus;
};

const statuses: TenantStatus[] = [
  "pending",
  "active",
  "suspended",
  "closed",
  "archived",
];

const inputClass =
  "w-full rounded-xl border border-(--line) bg-(--background) px-3.5 py-3 text-sm text-(--foreground) outline-none transition placeholder:text-(--muted)/70 focus:border-(--blue) focus:ring-4 focus:ring-(--blue)/10";

function TenantFormFields({
  form,
  errors,
  onChange,
}: {
  form: TenantFormValues;
  errors: Partial<Record<keyof TenantFormValues, string>>;
  onChange: <Key extends keyof TenantFormValues>(
    key: Key,
    value: TenantFormValues[Key],
  ) => void;
}) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4">
        <div>
          <h3 className="text-sm font-semibold text-(--foreground)">
            School details
          </h3>
          <p className="mt-1 text-xs text-(--muted)">
            Add the school’s workspace identity and primary contact.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Tenant code"
            htmlFor="tenant-code"
            error={errors.code}
          >
            <FormControl>
              <input
                id="tenant-code"
                className={inputClass}
                value={form.code}
                onChange={(event) =>
                  onChange("code", event.target.value.toUpperCase())
                }
                placeholder="e.g. NORTHFIELD"
                autoComplete="off"
              />
            </FormControl>
          </FormField>
          <FormField label="Status" htmlFor="tenant-status">
            <FormControl>
              <select
                id="tenant-status"
                className={inputClass}
                value={form.status}
                onChange={(event) =>
                  onChange("status", event.target.value as TenantStatus)
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status[0].toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormField>
          <FormField
            label="Display name"
            htmlFor="tenant-display-name"
            error={errors.displayName}
          >
            <FormControl>
              <input
                id="tenant-display-name"
                className={inputClass}
                value={form.displayName}
                onChange={(event) =>
                  onChange("displayName", event.target.value)
                }
                placeholder="Name shown across Xenon"
              />
            </FormControl>
          </FormField>
          <FormField
            label="Legal name"
            htmlFor="tenant-legal-name"
            error={errors.legalName}
          >
            <FormControl>
              <input
                id="tenant-legal-name"
                className={inputClass}
                value={form.legalName}
                onChange={(event) => onChange("legalName", event.target.value)}
                placeholder="Registered organization name"
              />
            </FormControl>
          </FormField>
          <FormField label="Email" htmlFor="tenant-email">
            <FormControl>
              <input
                id="tenant-email"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="admin@school.edu"
              />
            </FormControl>
          </FormField>
          <FormField label="Phone" htmlFor="tenant-phone">
            <FormControl>
              <input
                id="tenant-phone"
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(event) => onChange("phone", event.target.value)}
                placeholder="+251 ..."
              />
            </FormControl>
          </FormField>
          <FormField
            className="sm:col-span-2"
            label="Address"
            htmlFor="tenant-address"
            description="The primary address for this school organization."
          >
            <FormControl>
              <textarea
                id="tenant-address"
                className={`${inputClass} min-h-24 resize-y`}
                value={form.address}
                onChange={(event) => onChange("address", event.target.value)}
                placeholder="City, neighborhood, street"
              />
            </FormControl>
          </FormField>
        </div>
      </section>

      <section className="grid gap-4 border-t border-(--line) pt-5">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--blue)/10 text-(--blue)">
            <Globe2 size={17} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-(--foreground)">
              Regional settings
            </h3>
            <p className="mt-1 text-xs text-(--muted)">
              Set defaults for dates, amounts, and school-wide preferences.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Country code"
            htmlFor="tenant-country"
            error={errors.countryCode}
          >
            <FormControl>
              <input
                id="tenant-country"
                maxLength={2}
                className={inputClass}
                value={form.countryCode}
                onChange={(event) =>
                  onChange("countryCode", event.target.value.toUpperCase())
                }
                placeholder="ET"
              />
            </FormControl>
          </FormField>
          <FormField label="Timezone" htmlFor="tenant-timezone">
            <FormControl>
              <input
                id="tenant-timezone"
                className={inputClass}
                value={form.timezone}
                onChange={(event) => onChange("timezone", event.target.value)}
                placeholder="Africa/Addis_Ababa"
              />
            </FormControl>
          </FormField>
          <FormField
            label="Currency"
            htmlFor="tenant-currency"
            error={errors.currencyCode}
          >
            <FormControl>
              <input
                id="tenant-currency"
                maxLength={3}
                className={inputClass}
                value={form.currencyCode}
                onChange={(event) =>
                  onChange("currencyCode", event.target.value.toUpperCase())
                }
                placeholder="ETB"
              />
            </FormControl>
          </FormField>
        </div>
      </section>
    </div>
  );
}

export function TenantFormDialog({
  isOpen,
  isEditing,
  form,
  errors,
  saving,
  onClose,
  onSubmit,
  onChange,
}: {
  isOpen: boolean;
  isEditing: boolean;
  form: TenantFormValues;
  errors: Partial<Record<keyof TenantFormValues, string>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: <Key extends keyof TenantFormValues>(
    key: Key,
    value: TenantFormValues[Key],
  ) => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={isEditing ? "Edit school workspace" : "Add a school"}
      description={
        isEditing
          ? "Update workspace details and regional preferences."
          : "Create a school workspace and configure its contact and regional details."
      }
      className="max-h-[90dvh] rounded-2xl border-(--line) shadow-[0_32px_100px_rgb(7_17_31_/_32%)] sm:max-w-3xl"
    >
      <ModalBody className="max-h-[calc(90dvh-10rem)] p-0">
        <Form onSubmit={onSubmit} className="gap-0">
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <TenantFormFields
              form={form}
              errors={errors}
              onChange={onChange}
            />
            {Object.keys(errors).length > 0 && (
              <FormMessage className="mt-5 rounded-xl border border-(--red)/20 bg-(--red)/5 px-4 py-3 text-xs">
                Please correct the highlighted fields before saving.
              </FormMessage>
            )}
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-(--line) bg-(--card)/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end sm:px-7">
            <Button
              type="button"
              variant="outline"
              className="min-h-10 px-5"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-h-10 gap-2 px-5"
              disabled={saving}
            >
              {saving && <LoaderCircle size={15} className="animate-spin" />}
              {saving
                ? "Saving…"
                : isEditing
                  ? "Save changes"
                  : "Create school"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}
