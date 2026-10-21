"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";

import { ApplicationFileUploads, type ApplicationFileReference } from "@/components/admissions/ApplicationFileUploads";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getCurrentUser } from "@/services/auth/user.service";
import {
  downloadFileObject,
  deleteFileObject,
  updateFileObject,
  uploadGlobalFileObject,
} from "@/services/files/file_objs.service";
import {
  createOwnStudentApplication,
  getStudentApplicationDirectory,
  listOwnStudentApplications,
  updateOwnStudentApplication,
  type StudentApplication,
  type StudentApplicationSchool,
} from "@/services/community/stu_app.service";
import type { PendingApplicationFile } from "@/components/admissions/ApplicationFileUploadCard";
import styles from "./page.module.css";

type ApplicationForm = {
  tenantId: string;
  branchId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  notes: string;
};

const emptyForm: ApplicationForm = {
  tenantId: "",
  branchId: "",
  applicantName: "",
  applicantEmail: "",
  applicantPhone: "",
  notes: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getApplicationNotes(application: StudentApplication) {
  const notes = application.payload?.notes;
  return typeof notes === "string" ? notes : "";
}

function getApplicationFiles(payload: Record<string, unknown>) {
  const attachments = payload.attachments;
  if (!Array.isArray(attachments)) return [];

  return attachments.filter(
    (attachment): attachment is ApplicationFileReference =>
      typeof attachment === "object" &&
      attachment !== null &&
      "id" in attachment &&
      typeof attachment.id === "string" &&
      "originalName" in attachment &&
      typeof attachment.originalName === "string",
  );
}

function getUploadValidationError(files: PendingApplicationFile[]) {
  for (const [index, item] of files.entries()) {
    if (!item.file) return `Choose a file for file ${index + 1}.`;
    if (!item.originalName.trim()) {
      return `Enter a name for file ${index + 1}.`;
    }
    if (item.originalName.trim().length > 255) {
      return `The name for file ${index + 1} must be 255 characters or fewer.`;
    }
    if (item.file.size > 25 * 1024 * 1024) {
      return `${item.file.name} exceeds the 25 MB file size limit.`;
    }
  }
  return null;
}

export default function CreateAdmissionsApplicationPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<StudentApplicationSchool[]>([]);
  const [form, setForm] = useState<ApplicationForm>(emptyForm);
  const [applicationPayload, setApplicationPayload] = useState<
    Record<string, unknown>
  >({});
  const [applicationFiles, setApplicationFiles] = useState<
    ApplicationFileReference[]
  >([]);
  const [removedApplicationFiles, setRemovedApplicationFiles] = useState<
    ApplicationFileReference[]
  >([]);
  const [pendingFiles, setPendingFiles] = useState<PendingApplicationFile[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFormData() {
      setLoading(true);
      setError(null);
      try {
        const selectedApplicationId = new URLSearchParams(
          window.location.search,
        ).get("applicationId");
        if (active) setApplicationId(selectedApplicationId);
        const [
          directoryResponse,
          userResponse,
          applicationListResponse,
        ] = await Promise.all([
          getStudentApplicationDirectory(),
          selectedApplicationId ? Promise.resolve(null) : getCurrentUser(),
          selectedApplicationId
            ? listOwnStudentApplications()
            : Promise.resolve(null),
        ]);
        if (!active) return;
        setSchools(directoryResponse.schools);

        if (selectedApplicationId) {
          const application = applicationListResponse?.studentApplications.find(
            (item) => item.id === selectedApplicationId,
          );
          if (!application) {
            throw new Error(
              "This application could not be found in your applications.",
            );
          }
          setForm({
            tenantId: application.tenantId,
            branchId: application.branchId ?? "",
            applicantName: application.applicantName,
            applicantEmail: application.applicantEmail ?? "",
            applicantPhone: application.applicantPhone ?? "",
            notes: getApplicationNotes(application),
          });
          setApplicationPayload(application.payload ?? {});
          setApplicationFiles(getApplicationFiles(application.payload ?? {}));
          return;
        }

        if (!userResponse) {
          throw new Error("Unable to load your profile information.");
        }
        setForm((current) => ({
          ...current,
          applicantName: [
            userResponse.user.firstName,
            userResponse.user.middleName,
            userResponse.user.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          applicantEmail: userResponse.user.email,
          applicantPhone: userResponse.user.phone ?? "",
        }));
      } catch (loadError) {
        if (active) {
          setError(
            getErrorMessage(loadError, "Unable to load application form data."),
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadFormData();
    return () => {
      active = false;
    };
  }, []);

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === form.tenantId),
    [schools, form.tenantId],
  );
  const branchRequired = Boolean(selectedSchool?.branches.length);

  async function handleDownloadExistingFile(file: ApplicationFileReference) {
    setError(null);
    try {
      const blob = await downloadFileObject(file.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(
        getErrorMessage(downloadError, `Unable to download ${file.originalName}.`),
      );
    }
  }

  function handleRemoveExistingFile(file: ApplicationFileReference) {
    setApplicationFiles((current) =>
      current.filter((currentFile) => currentFile.id !== file.id),
    );
    setRemovedApplicationFiles((current) =>
      current.some((currentFile) => currentFile.id === file.id)
        ? current
        : [...current, file],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const uploadValidationError = getUploadValidationError(pendingFiles);
    if (uploadValidationError) {
      setError(uploadValidationError);
      return;
    }

    setSaving(true);
    setError(null);
    const uploadedFiles: ApplicationFileReference[] = [];
    let applicationSaved = false;
    try {
      for (const pendingFile of pendingFiles) {
        if (!pendingFile.file) continue;
        const uploaded = await uploadGlobalFileObject(pendingFile.file);
        uploadedFiles.push(uploaded.fileObject);
        if (
          pendingFile.originalName.trim() !== uploaded.fileObject.originalName
        ) {
          const renamed = await updateFileObject(uploaded.fileObject.id, {
            originalName: pendingFile.originalName.trim(),
          });
          uploadedFiles[uploadedFiles.length - 1] = renamed.fileObject;
        }
      }

      const input = {
        applicantName: form.applicantName.trim(),
        applicantEmail: form.applicantEmail.trim() || null,
        applicantPhone: form.applicantPhone.trim() || null,
        payload: {
          ...applicationPayload,
          notes: form.notes.trim(),
          attachments: [
            ...applicationFiles,
            ...uploadedFiles.map((file) => ({
              id: file.id,
              originalName: file.originalName,
              mimeType: file.mimeType,
              sizeBytes: file.sizeBytes,
            })),
          ],
        },
      };
      if (applicationId) {
        await updateOwnStudentApplication(applicationId, input, form.tenantId);
        applicationSaved = true;
      } else {
        await createOwnStudentApplication({
          tenantId: form.tenantId,
          branchId: branchRequired ? form.branchId : null,
          ...input,
        });
        applicationSaved = true;
      }
      const savedFiles = uploadedFiles.map((file) => ({
        id: file.id,
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
      }));
      setApplicationFiles([...applicationFiles, ...savedFiles]);
      setPendingFiles([]);
      setApplicationPayload(input.payload);

      if (removedApplicationFiles.length > 0) {
        const deleteResults = await Promise.allSettled(
          removedApplicationFiles.map((file) => deleteFileObject(file.id)),
        );
        const failedFiles: ApplicationFileReference[] = [];
        deleteResults.forEach((result, index) => {
          const file = removedApplicationFiles[index];
          if (result.status === "rejected") {
            failedFiles.push(file);
            console.error(
              `Unable to delete removed application file ${file.id}:`,
              result.reason,
            );
          }
        });
        setRemovedApplicationFiles(failedFiles);
        if (failedFiles.length > 0) {
          throw new Error(
            `Your application was saved, but ${failedFiles.length} attached file${failedFiles.length === 1 ? "" : "s"} could not be deleted. Save again to retry.`,
          );
        }
      }
      router.push("/guest/admissions_app");
    } catch (submitError) {
      if (!applicationSaved) {
        const cleanupResults = await Promise.allSettled(
          uploadedFiles.map((file) => deleteFileObject(file.id)),
        );
        for (const cleanupResult of cleanupResults) {
          if (cleanupResult.status === "rejected") {
            console.error(
              "Unable to remove an uploaded application file after submission failed:",
              cleanupResult.reason,
            );
          }
        }
      }
      setError(
        getErrorMessage(submitError, "Unable to submit your application."),
      );
      setSaving(false);
    }
  }

  return (
    <main className={styles.createPage}>
      <div className="content">
        <header className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>
              <ClipboardList size={14} />
              Guest workspace / Admissions
            </p>
            <h1>
              {applicationId ? "Edit your application" : "Create an application"}
            </h1>
            <p className={styles.subtitle}>
              {applicationId
                ? "Update your contact details and application information."
                : "Choose a school and provide your admissions application details."}
            </p>
          </div>
          <Link href="/guest/admissions_app" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to applications
          </Link>
        </header>

        {error && (
          <div className={styles.errorNotice} role="alert">
            {error}
          </div>
        )}

        <section className={styles.formPanel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <ClipboardList size={19} />
            </span>
            <div>
              <h2>
                {applicationId
                  ? "Edit application details"
                  : "Application details"}
              </h2>
              <p>
                {applicationId
                  ? "Update your contact information and additional details. The selected school and branch cannot be changed."
                  : "Your contact information is prefilled from your profile and can be edited before submitting."}
              </p>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <RefreshCw className="animate-spin" size={18} />
              Loading schools and your profile…
            </div>
          ) : (
            <form className={styles.applicationForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>
                    School <b>*</b>
                  </span>
                  <select
                    value={form.tenantId}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        tenantId: event.target.value,
                        branchId: "",
                      }))
                    }
                    required
                    disabled={saving || !schools.length || Boolean(applicationId)}
                  >
                    <option value="">Select a school</option>
                    {!selectedSchool && applicationId && form.tenantId && (
                      <option value={form.tenantId}>
                        Previously selected school
                      </option>
                    )}
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.displayName} ({school.code})
                      </option>
                    ))}
                  </select>
                </label>
                {branchRequired && (
                  <label className={styles.field}>
                    <span>
                      Branch <b>*</b>
                    </span>
                    <select
                      value={form.branchId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          branchId: event.target.value,
                        }))
                      }
                      required
                      disabled={saving || Boolean(applicationId)}
                    >
                      <option value="">Select a branch</option>
                      {applicationId &&
                        form.branchId &&
                        !selectedSchool?.branches.some(
                          (branch) => branch.id === form.branchId,
                        ) && (
                          <option value={form.branchId}>
                            Previously selected branch
                          </option>
                        )}
                      {selectedSchool?.branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} ({branch.code})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {selectedSchool && !branchRequired && (
                  <p className={styles.noBranchNote}>
                    This school has no active branches. Your application will
                    be submitted to the school.
                  </p>
                )}
              </div>

              <div className={styles.formGrid}>
                <Input
                  label="Applicant name"
                  name="applicantName"
                  value={form.applicantName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      applicantName: event.target.value,
                    }))
                  }
                  required
                  disabled={saving}
                  autoComplete="name"
                />
                <Input
                  label="Email address"
                  name="applicantEmail"
                  type="email"
                  value={form.applicantEmail}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      applicantEmail: event.target.value,
                    }))
                  }
                  disabled={saving}
                  autoComplete="email"
                />
                <Input
                  label="Phone number"
                  name="applicantPhone"
                  type="tel"
                  value={form.applicantPhone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      applicantPhone: event.target.value,
                    }))
                  }
                  disabled={saving}
                  autoComplete="tel"
                />
                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>Additional information</span>
                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    rows={5}
                    placeholder="Add anything you would like the admissions team to know."
                    disabled={saving}
                  />
                </label>
              </div>

              {!schools.length && (
                <p className={styles.noSchools}>
                  There are currently no schools accepting applications.
                </p>
              )}

              <ApplicationFileUploads
                existingFiles={applicationFiles}
                onDownloadExistingFile={handleDownloadExistingFile}
                onRemoveExistingFile={handleRemoveExistingFile}
                pendingFiles={pendingFiles}
                onPendingFilesChange={setPendingFiles}
                disabled={saving}
              />

              <div className={styles.formActions}>
                <Link href="/guest/admissions_app" className={styles.cancelLink}>
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={
                    saving ||
                    !schools.length ||
                    !form.tenantId ||
                    (branchRequired && !form.branchId)
                  }
                >
                  {saving ? (
                    <>
                      <RefreshCw className="animate-spin" />
                      {applicationId ? "Saving…" : "Submitting…"}
                    </>
                  ) : (
                    <>
                      {applicationId ? <Pencil /> : <Plus />}
                      {applicationId ? "Save changes" : "Submit application"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}