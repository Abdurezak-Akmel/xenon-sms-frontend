"use client";

import type { FormEvent } from "react";
import {
  Activity,
  Building2,
  Check,
  Globe2,
  GitBranch,
  Hash,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import type { BranchStatus } from "@/services/tenancy/branch.service";

export type BranchForm = {
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  status: BranchStatus;
};

const branchStatuses: BranchStatus[] = ["active", "inactive", "archived"];

export function TenantBranchFormDialog({
  isOpen,
  editing,
  tenantName,
  timezonePlaceholder,
  form,
  error,
  saving,
  styles,
  onClose,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  editing: boolean;
  tenantName: string;
  timezonePlaceholder?: string;
  form: BranchForm;
  error: string | null;
  saving: boolean;
  styles: Record<string, string>;
  onClose: () => void;
  onChange: <Key extends keyof BranchForm>(
    key: Key,
    value: BranchForm[Key],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  function closeIfIdle() {
    if (!saving) onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeIfIdle}
      size="xl"
      ariaLabelledBy="branch-form-title"
      closeOnBackdropClick={!saving}
      closeOnEscape={!saving}
      showCloseButton={false}
      backdropClassName={styles.formBackdrop}
      className={styles.formModal}
    >
      <ModalHeader
        className={styles.modalHeader}
        onClose={saving ? undefined : closeIfIdle}
      >
        <div className={styles.modalHeading}>
          <span className={styles.modalIcon}>
            <GitBranch size={18} />
          </span>
          <div className={styles.modalHeadingCopy}>
            <div className={styles.modalEyebrowRow}>
              <p className={styles.modalEyebrow}>
                {editing ? "Update workspace location" : "New workspace location"}
              </p>
              <span className={styles.modePill}>
                {editing ? "Editing" : "New branch"}
              </span>
            </div>
            <h2 id="branch-form-title">
              {editing ? "Edit branch details" : "Create a branch"}
            </h2>
            <small>
              Add a campus to <strong>{tenantName}</strong>. Required fields are
              marked with an asterisk.
            </small>
          </div>
        </div>
      </ModalHeader>

      <form className={styles.form} onSubmit={onSubmit}>
        <ModalBody className={styles.formBody}>
          <div className={styles.tenantContext}>
            <span className={styles.contextIcon}>
              <Building2 size={16} />
            </span>
            <div>
              <span>School workspace</span>
              <strong>{tenantName}</strong>
            </div>
            <span className={styles.contextStatus}>
              <i />
              Connected
            </span>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formSectionHeading}>
              <span className={styles.sectionIcon}>
                <GitBranch size={16} />
              </span>
              <div>
                <strong>Branch information</strong>
                <span>Set the name and location identifier for this campus.</span>
              </div>
              <small>01</small>
            </div>
            <div className={styles.formGrid}>
              <label>
                <span className={styles.fieldLabel}>
                  Branch name <i>Required</i>
                </span>
                <span className={styles.inputWrap}>
                  <Building2 size={15} aria-hidden="true" />
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    placeholder="e.g. Bole Campus"
                    autoComplete="organization"
                    required
                  />
                </span>
              </label>
              <label>
                <span className={styles.fieldLabel}>
                  Branch code <i>Required</i>
                </span>
                <span className={styles.inputWrap}>
                  <Hash size={15} aria-hidden="true" />
                  <input
                    value={form.code}
                    onChange={(event) =>
                      onChange("code", event.target.value.toUpperCase())
                    }
                    placeholder="e.g. BOLE-01"
                    autoComplete="off"
                    required
                  />
                </span>
              </label>
              <label className={styles.fullWidth}>
                <span className={styles.fieldLabel}>Address</span>
                <span className={styles.inputWrap}>
                  <MapPin size={15} aria-hidden="true" />
                  <input
                    value={form.address}
                    onChange={(event) => onChange("address", event.target.value)}
                    placeholder="City, neighborhood, street"
                    autoComplete="street-address"
                  />
                </span>
              </label>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formSectionHeading}>
              <span className={styles.sectionIcon}>
                <Globe2 size={16} />
              </span>
              <div>
                <strong>Contact &amp; regional settings</strong>
                <span>Optional details to help people reach this branch.</span>
              </div>
              <small>02</small>
            </div>
            <div className={styles.formGrid}>
              <label>
                Phone
                <span className={styles.inputWrap}>
                  <Phone size={15} aria-hidden="true" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => onChange("phone", event.target.value)}
                    placeholder="+251 9…"
                    autoComplete="tel"
                  />
                </span>
              </label>
              <label>
                Email
                <span className={styles.inputWrap}>
                  <Mail size={15} aria-hidden="true" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => onChange("email", event.target.value)}
                    placeholder="branch@school.edu"
                    autoComplete="email"
                  />
                </span>
              </label>
              <label>
                Timezone
                <span className={styles.inputWrap}>
                  <Globe2 size={15} aria-hidden="true" />
                  <input
                    value={form.timezone}
                    onChange={(event) => onChange("timezone", event.target.value)}
                    placeholder={timezonePlaceholder ?? "Africa/Addis_Ababa"}
                  />
                </span>
                <small className={styles.fieldHint}>
                  Leave blank to use the school&apos;s default timezone.
                </small>
              </label>
              <label>
                Status
                <span className={styles.inputWrap}>
                  <Activity size={15} aria-hidden="true" />
                  <select
                    value={form.status}
                    onChange={(event) =>
                      onChange("status", event.target.value as BranchStatus)
                    }
                  >
                    {branchStatuses.map((status) => (
                      <option value={status} key={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className={styles.formError} role="alert">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}
        </ModalBody>

        <ModalFooter className={styles.formFooter}>
          <span className={styles.footerNote}>
            Changes will be available to this school workspace.
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={closeIfIdle}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                {editing ? "Saving…" : "Creating…"}
              </>
            ) : (
              <>
                {editing ? <Check size={15} /> : <Plus size={15} />}
                {editing ? "Save changes" : "Create branch"}
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
