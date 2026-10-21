"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Heart,
  LoaderCircle,
  MapPin,
  FileText,
  RotateCcw,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  getOwnStudentGuardianChildren,
  type StudentGuardianChild,
} from "@/services/community/stu_guardians.service";
import {
  downloadStudentDocumentFile,
  getOwnStudentDocuments,
  type StudentDocument,
} from "@/services/community/stu_docs.service";

import styles from "./page.module.css";

function studentName(student: StudentGuardianChild["student"]) {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

function displayValue(value: string | null | undefined) {
  return value?.trim() || "Not provided";
}

function displayDate(value: string | null) {
  if (!value) return "Not provided";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<StudentGuardianChild[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<
    string | null
  >(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const loadChildren = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOwnStudentGuardianChildren();
      setChildren(response.children);
      setSelectedChildIndex(0);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load linked student records.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadChildren();
  }, [loadChildren]);

  const loadDocuments = useCallback(async (tenantId: string) => {
    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const response = await getOwnStudentDocuments({ tenantId });
      setDocuments(response.studentDocuments);
    } catch (loadError) {
      setDocumentsError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load student documents.",
      );
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  useEffect(() => {
    const tenantId = children[0]?.student.tenantId;
    if (tenantId) void loadDocuments(tenantId);
    else setDocuments([]);
  }, [children, loadDocuments]);

  const selectedChild = children[selectedChildIndex];
  const student = selectedChild?.student;
  const relationship = selectedChild?.relationship;
  const studentDocuments = student
    ? documents.filter((document) => document.studentId === student.id)
    : [];

  const handleDownload = async (document: StudentDocument) => {
    setDownloadingDocumentId(document.id);
    setDownloadError(null);
    try {
      const { blob, filename } = await downloadStudentDocumentFile(
        document.id,
        document.tenantId,
      );
      const objectUrl = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (downloadFailure) {
      setDownloadError(
        downloadFailure instanceof Error
          ? downloadFailure.message
          : "Unable to download this student document.",
      );
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>PARENT WORKSPACE</p>
        <h1>My children</h1>
        <p>
          View the student information for children linked to your guardian
          account.
        </p>
      </header>

      {loading ? (
        <Card padding="lg" className={styles.feedback} role="status">
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          Loading linked students…
        </Card>
      ) : error ? (
        <Card padding="lg" className={styles.errorCard}>
          <div className={styles.errorMessage}>
            <AlertCircle size={18} aria-hidden="true" />
            <p role="alert">{error}</p>
          </div>
          <Button type="button" variant="outline" onClick={() => void loadChildren()}>
            <RotateCcw aria-hidden="true" />
            Try again
          </Button>
        </Card>
      ) : children.length === 0 ? (
        <Card padding="lg" className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <UserRound size={22} aria-hidden="true" />
          </span>
          <div>
            <CardTitle>No linked students yet</CardTitle>
            <CardDescription>
              Students linked to your guardian profile will appear here. Contact
              your school if you believe a student should be listed.
            </CardDescription>
          </div>
        </Card>
      ) : (
        <>
          <nav className={styles.childNavigation} aria-label="Choose a child">
            <div className={styles.childTabs} role="tablist">
              {children.map(({ student: child }, index) => (
                <button
                  key={child.id}
                  id={`child-tab-${child.id}`}
                  type="button"
                  role="tab"
                  aria-selected={index === selectedChildIndex}
                  aria-controls={`child-panel-${child.id}`}
                  className={
                    index === selectedChildIndex
                      ? `${styles.childTab} ${styles.childTabActive}`
                      : styles.childTab
                  }
                  onClick={() => setSelectedChildIndex(index)}
                >
                  <span className={styles.tabAvatar}>
                    <GraduationCap size={17} aria-hidden="true" />
                  </span>
                  <span className={styles.tabCopy}>
                    <strong>{studentName(child) || "Student"}</strong>
                    <small>{child.studentNumber}</small>
                  </span>
                </button>
              ))}
            </div>
            {children.length > 1 && (
              <div className={styles.childControls}>
                <span>
                  Student {selectedChildIndex + 1} of {children.length}
                </span>
                <div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-label="Show previous student"
                    onClick={() =>
                      setSelectedChildIndex((current) =>
                        current === 0 ? children.length - 1 : current - 1,
                      )
                    }
                  >
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-label="Show next student"
                    onClick={() =>
                      setSelectedChildIndex((current) =>
                        current === children.length - 1 ? 0 : current + 1,
                      )
                    }
                  >
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}
          </nav>

          {student && relationship && (
            <section
              id={`child-panel-${student.id}`}
              role="tabpanel"
              aria-labelledby={`child-tab-${student.id}`}
              className={styles.studentPanel}
            >
              <Card padding="none" className={styles.studentCard}>
                <div className={styles.studentBanner}>
                  <div className={styles.studentIcon}>
                    <GraduationCap size={26} aria-hidden="true" />
                  </div>
                  <span className={styles.statusBadge}>{student.status}</span>
                </div>
                <CardContent className={styles.studentContent}>
                  <div className={styles.studentHeading}>
                    <div>
                      <p className={styles.studentEyebrow}>STUDENT PROFILE</p>
                      <h2>{studentName(student) || "Student"}</h2>
                      <p className={styles.studentNumber}>
                        Student number {student.studentNumber}
                      </p>
                    </div>
                    <span className={styles.relationshipBadge}>
                      <Heart size={14} aria-hidden="true" />
                      {relationship.relationship || "Guardian"}
                    </span>
                  </div>

                  <div className={styles.infoGrid}>
                    <Info
                      label="Preferred name"
                      value={student.preferredName}
                    />
                    <Info label="Gender" value={student.gender} />
                    <Info
                      label="Date of birth"
                      value={displayDate(student.dateOfBirth)}
                      icon={<CalendarDays size={15} aria-hidden="true" />}
                    />
                    <Info label="Place of birth" value={student.birthPlace} />
                    <Info label="Nationality" value={student.nationality} />
                    <Info label="Blood group" value={student.bloodGroup} />
                    <Info
                      label="Admission date"
                      value={displayDate(student.admissionDate)}
                    />
                    <Info
                      label="Graduation date"
                      value={displayDate(student.graduationDate)}
                    />
                    <Info
                      label="Address"
                      value={student.address}
                      icon={<MapPin size={15} aria-hidden="true" />}
                    />
                    <Info
                      label="Primary guardian"
                      value={relationship.isPrimary ? "Yes" : "No"}
                    />
                    <Info
                      label="Financial payer"
                      value={relationship.isFinancialPayer ? "Yes" : "No"}
                    />
                    <Info
                      label="Receives school notifications"
                      value={relationship.receivesNotifications ? "Yes" : "No"}
                    />
                  </div>

                  {student.emergencyNotes && (
                    <div className={styles.notes}>
                      <h3>Emergency notes</h3>
                      <p>{student.emergencyNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card padding="default" className={styles.documentsCard}>
                <CardHeader
                  className={styles.documentsHeader}
                  action={
                    !documentsLoading &&
                    !documentsError && (
                      <span className={styles.documentCount}>
                        {studentDocuments.length} document
                        {studentDocuments.length === 1 ? "" : "s"}
                      </span>
                    )
                  }
                >
                  <div>
                    <CardTitle>Student documents</CardTitle>
                    <CardDescription>
                      Documents shared with you by the school for this student.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {downloadError && (
                    <p className={styles.downloadError} role="alert">
                      {downloadError}
                    </p>
                  )}
                  {documentsError && (
                    <div className={styles.documentsError}>
                      <p role="alert">{documentsError}</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void loadDocuments(student.tenantId)
                        }
                      >
                        <RotateCcw aria-hidden="true" />
                        Try again
                      </Button>
                    </div>
                  )}
                  {documentsLoading ? (
                    <p className={styles.documentsFeedback} role="status">
                      <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                      />
                      Loading student documents…
                    </p>
                  ) : documentsError ? null : studentDocuments.length ? (
                    <ul className={styles.documentList}>
                      {studentDocuments.map((document) => (
                        <li key={document.id} className={styles.documentItem}>
                          <span className={styles.documentIcon}>
                            <FileText size={18} aria-hidden="true" />
                          </span>
                          <div className={styles.documentDetails}>
                            <strong>{document.documentType}</strong>
                            <span>
                              {document.issuedDate
                                ? `Issued ${displayDate(document.issuedDate)}`
                                : "Issue date not provided"}
                              {document.expiryDate
                                ? ` · Expires ${displayDate(document.expiryDate)}`
                                : ""}
                            </span>
                            {document.notes && <p>{document.notes}</p>}
                          </div>
                          <span
                            className={
                              document.verifiedAt
                                ? styles.documentVerified
                                : styles.documentPending
                            }
                          >
                            {document.verifiedAt ? (
                              <BadgeCheck size={14} aria-hidden="true" />
                            ) : null}
                            {document.verifiedAt
                              ? "Verified"
                              : "Pending verification"}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className={styles.downloadButton}
                            disabled={downloadingDocumentId !== null}
                            onClick={() => void handleDownload(document)}
                          >
                            {downloadingDocumentId === document.id ? (
                              <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Download size={15} aria-hidden="true" />
                            )}
                            {downloadingDocumentId === document.id
                              ? "Downloading…"
                              : "Download"}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.documentsEmpty}>
                      <FileText size={19} aria-hidden="true" />
                      <div>
                        <strong>No documents shared yet</strong>
                        <p>
                          Documents shared by the school will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon?: React.ReactNode;
}) {
  const formattedValue =
    value === "Not provided" ? value : displayValue(value);
  return (
    <div className={styles.infoItem}>
      <dt>
        {icon}
        {label}
      </dt>
      <dd>{formattedValue}</dd>
    </div>
  );
}