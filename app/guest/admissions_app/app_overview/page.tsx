"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Download,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { downloadFileObject } from "@/services/files/file_objs.service";

import {
  getOwnStudentApplication,
  getStudentApplicationDirectory,
  type StudentApplication,
  type StudentApplicationSchool,
} from "@/services/community/stu_app.service";
import type { ApplicationFileReference } from "@/components/admissions/ApplicationFileUploads";

import styles from "./page.module.css";

type ApplicationAttachment = ApplicationFileReference;

function getAttachments(payload: Record<string, unknown>): ApplicationAttachment[] {
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

function formatDate(value: string | null) {
  if (!value) return "Not submitted";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function getNotes(application: StudentApplication) {
  const notes = application.payload?.notes;
  return typeof notes === "string" ? notes : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to load this application.";
}

function formatFileSize(sizeBytes: number) {
  return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ApplicationOverviewPage() {
  const [application, setApplication] = useState<StudentApplication | null>(
    null,
  );
  const [schools, setSchools] = useState<StudentApplicationSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function loadApplication() {
      const applicationId = new URLSearchParams(window.location.search).get(
        "applicationId",
      );
      if (!applicationId) {
        setError("No application was selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [applicationResponse, directoryResponse] = await Promise.all([
          getOwnStudentApplication(applicationId),
          getStudentApplicationDirectory(),
        ]);
        if (!active) return;
        setApplication(applicationResponse.studentApplication);
        setSchools(directoryResponse.schools);
      } catch (loadError) {
        if (active) setError(getErrorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadApplication();
    return () => {
      active = false;
    };
  }, []);

  const school = schools.find((item) => item.id === application?.tenantId);
  const branch = school?.branches.find(
    (item) => item.id === application?.branchId,
  );
  const notes = application ? getNotes(application) : "";
  const attachments = application
    ? getAttachments(application.payload)
    : [];

  async function handleDownload(file: ApplicationAttachment) {
    setDownloadError(null);
    setDownloadingFileId(file.id);
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
    } catch (downloadFailure) {
      setDownloadError(
        downloadFailure instanceof Error
          ? downloadFailure.message
          : `Unable to download ${file.originalName}.`,
      );
    } finally {
      setDownloadingFileId(null);
    }
  }

  return (
    <main className={styles.overviewPage}>
      <div className="content">
        <header className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>
              <ClipboardList size={14} />
              Guest workspace / Admissions
            </p>
            <h1>Application overview</h1>
            <p className={styles.subtitle}>
              Review the details and current status of your application.
            </p>
          </div>
          <Link href="/guest/admissions_app" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to applications
          </Link>
        </header>

        {loading ? (
          <section className={styles.statePanel} role="status">
            <RefreshCw className="animate-spin" size={20} />
            Loading application details…
          </section>
        ) : error || !application ? (
          <section className={styles.statePanel} role="alert">
            <strong>Application unavailable</strong>
            <p>{error ?? "The selected application could not be loaded."}</p>
            <Link href="/guest/admissions_app" className={styles.backLink}>
              <ArrowLeft size={16} />
              Back to applications
            </Link>
          </section>
        ) : (
          <section className={styles.detailsPanel}>
            <div className={styles.detailsHeading}>
              <div>
                <p className={styles.eyebrow}>
                  <ClipboardList size={14} />
                  Application details
                </p>
                <h2>{application.applicantName}</h2>
                <p className={styles.schoolName}>
                  {school?.displayName ?? "School unavailable"}
                  {branch ? ` · ${branch.name}` : ""}
                </p>
              </div>
              <span
                className={`${styles.statusBadge} ${styles[`status_${application.status}`]}`}
              >
                {application.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Applicant</span>
                <strong>{application.applicantName}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>School</span>
                <strong>{school?.displayName ?? "School unavailable"}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email address</span>
                <strong>
                  {application.applicantEmail ? (
                    <span className={styles.detailWithIcon}>
                      <Mail size={15} />
                      {application.applicantEmail}
                    </span>
                  ) : (
                    "Not provided"
                  )}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone number</span>
                <strong>
                  {application.applicantPhone ? (
                    <span className={styles.detailWithIcon}>
                      <Phone size={15} />
                      {application.applicantPhone}
                    </span>
                  ) : (
                    "Not provided"
                  )}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Branch</span>
                <strong>
                  {branch ? (
                    <span className={styles.detailWithIcon}>
                      <MapPin size={15} />
                      {branch.name} ({branch.code})
                    </span>
                  ) : (
                    "No branch"
                  )}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Submitted</span>
                <strong>
                  <span className={styles.detailWithIcon}>
                    <CalendarDays size={15} />
                    {formatDate(application.submittedAt)}
                  </span>
                </strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Created</span>
                <strong>{formatDate(application.createdAt)}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last updated</span>
                <strong>{formatDate(application.updatedAt)}</strong>
              </div>
            </div>

            <div className={styles.notesSection}>
              <h3>Additional information</h3>
              <p>{notes || "No additional information provided."}</p>
            </div>

            <section className={styles.attachmentsSection}>
              <h3>Attached files</h3>
              {downloadError && (
                <p className={styles.downloadError} role="alert">
                  {downloadError}
                </p>
              )}
              {attachments.length ? (
                <ul className={styles.attachmentList}>
                  {attachments.map((file) => (
                    <li className={styles.attachmentItem} key={file.id}>
                      <div className={styles.attachmentInfo}>
                        <FileText size={17} aria-hidden="true" />
                        <span className={styles.attachmentName}>
                          {file.originalName}
                        </span>
                        {typeof file.sizeBytes === "number" && (
                          <span className={styles.attachmentSize}>
                            {formatFileSize(file.sizeBytes)}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void handleDownload(file)}
                        disabled={downloadingFileId !== null}
                      >
                        {downloadingFileId === file.id ? (
                          <RefreshCw className="animate-spin" />
                        ) : (
                          <Download />
                        )}
                        {downloadingFileId === file.id
                          ? "Downloading…"
                          : "Download"}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noAttachments}>
                  No files attached to this application.
                </p>
              )}
            </section>

            <div className={styles.actions}>
              <Link href="/guest/admissions_app" className={styles.cancelLink}>
                Back to applications
              </Link>
              <Link
                href={`/guest/admissions_app/create_app?applicationId=${encodeURIComponent(application.id)}`}
                className={styles.editLink}
              >
                <Pencil size={16} />
                Edit application
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
