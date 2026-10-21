"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import {
  deleteOwnStudentApplication,
  getStudentApplicationDirectory,
  listOwnStudentApplications,
  type StudentApplication,
  type StudentApplicationSchool,
} from "@/services/community/stu_app.service";

import styles from "./page.module.css";

function formatDate(value: string | null) {
  if (!value) return "Not submitted";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function getNotes(application: StudentApplication) {
  const notes = application.payload?.notes;
  return typeof notes === "string" ? notes : "";
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function AdmissionsApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [schools, setSchools] = useState<StudentApplicationSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingApplication, setDeletingApplication] =
    useState<StudentApplication | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [directoryResponse, applicationResponse] = await Promise.all([
        getStudentApplicationDirectory(),
        listOwnStudentApplications(),
      ]);
      setSchools(directoryResponse.schools);
      setApplications(applicationResponse.studentApplications);
    } catch (error) {
      setLoadError(
        getErrorMessage(error, "Unable to load your admissions applications."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const schoolsById = useMemo(
    () => new Map(schools.map((school) => [school.id, school])),
    [schools],
  );

  function openCreateForm() {
    router.push("/guest/admissions_app/create_app");
  }

  async function handleDelete() {
    if (!deletingApplication) return;
    setDeletingId(deletingApplication.id);
    setActionError(null);
    setSuccessMessage(null);
    try {
      await deleteOwnStudentApplication(
        deletingApplication.id,
        deletingApplication.tenantId,
      );
      setApplications((items) =>
        items.filter((item) => item.id !== deletingApplication.id),
      );
      setDeletingApplication(null);
      setSuccessMessage("Your application has been deleted.");
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to delete your application."),
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className={styles.admissionsPage}>
      <div className="content">
        <header className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>
              <ClipboardList size={14} />
              Guest workspace / Admissions
            </p>
            <h1>Admissions applications</h1>
            <p className={styles.subtitle}>
              Apply to a school and keep track of your application status.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button
              type="button"
              variant="outline"
              className={styles.refreshButton}
              onClick={() => void loadApplications()}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              type="button"
              onClick={openCreateForm}
              disabled={!schools.length}
              className={styles.createButton}
            >
              <Plus />
              Create application
            </Button>
          </div>
        </header>

        {loadError && (
          <div className={styles.errorNotice} role="alert">
            <span>{loadError}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadApplications()}
            >
              Try again
            </Button>
          </div>
        )}
        {actionError && (
          <div className={styles.errorNotice} role="alert">
            {actionError}
          </div>
        )}
        {successMessage && (
          <div className={styles.successNotice} role="status">
            {successMessage}
          </div>
        )}

        <section className={styles.applicationsPanel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>
                Your applications
                <span className={styles.count}>
                  {loading ? "…" : applications.length}
                </span>
              </h2>
              <p>View, update, or remove applications you have submitted.</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <span className={styles.loadingIcon}>
                <RefreshCw className="animate-spin" />
              </span>
              <strong>Loading applications</strong>
              <p>Retrieving your application records.</p>
            </div>
          ) : loadError ? (
            <div className={styles.emptyState}>
              <strong>Applications could not be loaded</strong>
              <p>Try refreshing the page or check back in a moment.</p>
            </div>
          ) : applications.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <ClipboardList />
              </span>
              <strong>No applications yet</strong>
              <p>Start an application to a school and it will appear here.</p>
              {!schools.length && (
                <small>
                  There are currently no schools accepting applications.
                </small>
              )}
              <Button
                type="button"
                onClick={openCreateForm}
                disabled={!schools.length}
              >
                <Plus />
                Create application
              </Button>
            </div>
          ) : (
            <div className={styles.applicationList}>
              {applications.map((application) => {
                const school = schoolsById.get(application.tenantId);
                const branch = school?.branches.find(
                  (item) => item.id === application.branchId,
                );
                const notes = getNotes(application);
                return (
                  <article
                    key={application.id}
                    className={styles.applicationCard}
                  >
                    <Link
                      href={`/guest/admissions_app/app_overview?applicationId=${encodeURIComponent(application.id)}`}
                      className={styles.applicationLink}
                      aria-label={`View application for ${application.applicantName}`}
                    >
                      <div className={styles.applicationTop}>
                        <div className={styles.applicantIdentity}>
                          <span className={styles.applicationIcon}>
                            <ClipboardList size={18} />
                          </span>
                          <div>
                            <h3>{application.applicantName}</h3>
                            <p>
                              {school?.displayName ?? "School unavailable"}
                              {branch ? ` · ${branch.name}` : ""}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`${styles.statusBadge} ${styles[`status_${application.status}`]}`}
                        >
                          {application.status.replaceAll("_", " ")}
                        </span>
                      </div>

                      <div className={styles.applicationDetails}>
                        {application.applicantEmail && (
                          <span>
                            <Mail size={14} />
                            {application.applicantEmail}
                          </span>
                        )}
                        {application.applicantPhone && (
                          <span>
                            <Phone size={14} />
                            {application.applicantPhone}
                          </span>
                        )}
                        {branch && (
                          <span>
                            <MapPin size={14} />
                            {branch.code}
                          </span>
                        )}
                        <span>
                          <CalendarDays size={14} />
                          Submitted {formatDate(application.submittedAt)}
                        </span>
                      </div>

                      {notes && (
                        <p className={styles.applicationNotes}>{notes}</p>
                      )}
                    </Link>

                    <div className={styles.cardFooter}>
                      <span>Updated {formatDate(application.updatedAt)}</span>
                      <div className={styles.rowActions}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/guest/admissions_app/create_app?applicationId=${encodeURIComponent(application.id)}`,
                            )
                          }
                          disabled={deletingId === application.id}
                        >
                          <Pencil />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingApplication(application)}
                          disabled={deletingId === application.id}
                        >
                          <Trash2 />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={Boolean(deletingApplication)}
        onClose={() => {
          if (!deletingId) setDeletingApplication(null);
        }}
        onConfirm={() => void handleDelete()}
        title="Delete this application?"
        description={`This will permanently delete the application for ${deletingApplication?.applicantName ?? "this applicant"}.`}
        confirmText="Delete application"
        isLoading={Boolean(deletingId)}
      />
    </main>
  );
}
