"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Download,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  Unlink,
  UserRound,
  UserPlus,
  X,
} from "lucide-react";

import { Button } from "../../../../components/ui/Button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";

import { Input } from "../../../../components/ui/Input";

import { getAuthenticatedTenantId } from "../../../../services/auth/user.service";

import {
  listTenantMembershipRoles,
  listTenantMemberships,
  type TenantMembership,
  type TenantMembershipRole,
} from "../../../../services/auth/ten_mem.service";

import {
  createStudent,
  deleteStudent,
  listStudents,
  updateStudent,
  type CreateStudentInput,
  type Student,
  type StudentStatus,
  type UpdateStudentInput,
} from "../../../../services/community/students.service";
import {
  listGuardians,
  type Guardian,
} from "../../../../services/community/guardians.service";
import {
  createStudentGuardianLink,
  deleteStudentGuardianLink,
  listStudentGuardianLinks,
  type StudentGuardian,
} from "../../../../services/community/stu_guardians.service";
import {
  createStudentDocument,
  deleteStudentDocument,
  listStudentDocuments,
  updateStudentDocument,
  type StudentDocument,
} from "../../../../services/community/stu_docs.service";
import {
  downloadFileObject,
  getFileObject,
  uploadTenantFileObject,
} from "../../../../services/files/file_objs.service";

import styles from "./page.module.css";

type StudentForm = {
  studentNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  gender: string;
  dateOfBirth: string;
  birthPlace: string;
  nationality: string;
  nationalId: string;
  bloodGroup: string;
  address: string;
  status: StudentStatus;
  admissionDate: string;
  graduationDate: string;
  emergencyNotes: string;
};

const studentStatuses: StudentStatus[] = [
  "applicant",
  "enrolled",
  "active",
  "transferred",
  "suspended",
  "graduated",
  "withdrawn",
  "archived",
];

const emptyForm: StudentForm = {
  studentNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  gender: "",
  dateOfBirth: "",
  birthPlace: "",
  nationality: "",
  nationalId: "",
  bloodGroup: "",
  address: "",
  status: "active",
  admissionDate: "",
  graduationDate: "",
  emergencyNotes: "",
};

function toForm(student: Student): StudentForm {
  return {
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    middleName: student.middleName ?? "",
    lastName: student.lastName,
    preferredName: student.preferredName ?? "",
    gender: student.gender ?? "",
    dateOfBirth: student.dateOfBirth ?? "",
    birthPlace: student.birthPlace ?? "",
    nationality: student.nationality ?? "",
    nationalId: student.nationalId ?? "",
    bloodGroup: student.bloodGroup ?? "",
    address: student.address ?? "",
    status: student.status,
    admissionDate: student.admissionDate ?? "",
    graduationDate: student.graduationDate ?? "",
    emergencyNotes: student.emergencyNotes ?? "",
  };
}

function membershipUserName(membership: TenantMembership) {
  const user = membership.user;
  return user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    : "";
}

function toCreateInput(
  form: StudentForm,
  tenantId: string,
  membership: TenantMembership,
): CreateStudentInput {
  return {
    tenantId,
    branchId: membership.branchId,
    userId: membership.userId,
    studentNumber: form.studentNumber.trim(),
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || null,
    lastName: form.lastName.trim(),
    preferredName: form.preferredName.trim() || null,
    gender: form.gender || null,
    dateOfBirth: form.dateOfBirth || null,
    birthPlace: form.birthPlace.trim() || null,
    nationality: form.nationality.trim() || null,
    nationalId: form.nationalId.trim() || null,
    bloodGroup: form.bloodGroup.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
    admissionDate: form.admissionDate || null,
    graduationDate: form.graduationDate || null,
    emergencyNotes: form.emergencyNotes.trim() || null,
    customFields: {},
  };
}

function toUpdateInput(form: StudentForm): UpdateStudentInput {
  return {
    studentNumber: form.studentNumber.trim(),
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim() || null,
    lastName: form.lastName.trim(),
    preferredName: form.preferredName.trim() || null,
    gender: form.gender || null,
    dateOfBirth: form.dateOfBirth || null,
    birthPlace: form.birthPlace.trim() || null,
    nationality: form.nationality.trim() || null,
    nationalId: form.nationalId.trim() || null,
    bloodGroup: form.bloodGroup.trim() || null,
    address: form.address.trim() || null,
    status: form.status,
    admissionDate: form.admissionDate || null,
    graduationDate: form.graduationDate || null,
    emergencyNotes: form.emergencyNotes.trim() || null,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function StudentProfilePage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMembershipId, setSelectedMembershipId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [membership, setMembership] = useState<TenantMembership | null>(null);
  const [roles, setRoles] = useState<TenantMembershipRole[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [availableGuardians, setAvailableGuardians] = useState<Guardian[]>([]);
  const [studentGuardianLinks, setStudentGuardianLinks] = useState<
    StudentGuardian[]
  >([]);
  const [guardianLinksLoading, setGuardianLinksLoading] = useState(false);
  const [guardianLinksError, setGuardianLinksError] = useState<string | null>(
    null,
  );
  const [guardianLinkNotice, setGuardianLinkNotice] = useState<string | null>(
    null,
  );
  const [selectedGuardianId, setSelectedGuardianId] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("");
  const [isPrimaryGuardian, setIsPrimaryGuardian] = useState(false);
  const [isFinancialPayer, setIsFinancialPayer] = useState(false);
  const [receivesNotifications, setReceivesNotifications] = useState(true);
  const [canPickup, setCanPickup] = useState(false);
  const [linkingGuardian, setLinkingGuardian] = useState(false);
  const [removingGuardianLinkId, setRemovingGuardianLinkId] = useState<
    string | null
  >(null);
  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>(
    [],
  );
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentsNotice, setDocumentsNotice] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentIssuedDate, setDocumentIssuedDate] = useState("");
  const [documentExpiryDate, setDocumentExpiryDate] = useState("");
  const [documentNotes, setDocumentNotes] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [editingDocument, setEditingDocument] =
    useState<StudentDocument | null>(null);
  const [savingDocument, setSavingDocument] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("userId");
    const membershipId =
      new URLSearchParams(window.location.search).get("membershipId") ?? "";
    if (userId) {
      setSelectedUserId(userId);
      setSelectedMembershipId(membershipId);
      return;
    }
    setPageError("Select a student membership from the membership table.");
    setLoading(false);
  }, []);

  const loadStudentDocuments = useCallback(
    async (studentId: string, selectedTenantId: string) => {
      setDocumentsLoading(true);
      setDocumentsError(null);
      try {
        const result = await listStudentDocuments({
          tenantId: selectedTenantId,
          studentId,
        });
        setStudentDocuments(result.studentDocuments);
      } catch (error) {
        setDocumentsError(
          getErrorMessage(error, "Unable to load student documents."),
        );
      } finally {
        setDocumentsLoading(false);
      }
    },
    [],
  );

  const loadProfile = useCallback(async () => {
    if (!selectedUserId) {
      setLoading(false);
      setPageError("Select a student membership from the membership table.");
      return;
    }

    setLoading(true);
    setPageError(null);
    setActionError(null);
    try {
      const selectedTenantId = getAuthenticatedTenantId();
      const [membershipResult, roleResult] = await Promise.all([
        listTenantMemberships({
          tenantId: selectedTenantId,
          userId: selectedUserId,
        }),
        listTenantMembershipRoles(),
      ]);
      const tenantMembership = membershipResult.memberships.find(
        (item) =>
          (!selectedMembershipId || item.id === selectedMembershipId) &&
          item.userId === selectedUserId &&
          item.tenantId === selectedTenantId,
      );
      const roleMap = roleResult.roles;
      const studentMembership = tenantMembership
        ? roleMap
            .find((role) => role.id === tenantMembership.roleId)
            ?.code.toLowerCase()
            .replace(/_/g, "-") === "student"
        : false;

      if (!tenantMembership || !studentMembership) {
        throw new Error(
          "The selected user does not have a student membership in this school.",
        );
      }

      const studentResult = await listStudents({
        tenantId: selectedTenantId,
        userId: selectedUserId,
      });
      if (studentResult.students.length > 1) {
        throw new Error(
          "More than one student record is linked to this user. Resolve the duplicate records before editing.",
        );
      }

      const currentStudent = studentResult.students[0] ?? null;
      setTenantId(selectedTenantId);
      setMembership(tenantMembership);
      setRoles(roleMap);
      setStudent(currentStudent);
      setStudentDocuments([]);
      setDocumentsError(null);
      setAvailableGuardians([]);
      setStudentGuardianLinks([]);
      setGuardianLinksError(null);
      setForm(
        currentStudent
          ? toForm(currentStudent)
          : {
              ...emptyForm,
              firstName: tenantMembership.user?.firstName ?? "",
              middleName: tenantMembership.user?.middleName ?? "",
              lastName: tenantMembership.user?.lastName ?? "",
            },
      );
      setEditing(!currentStudent);
      if (currentStudent) {
        void loadStudentDocuments(currentStudent.id, selectedTenantId);
        setGuardianLinksLoading(true);
        try {
          const [guardiansResult, linksResult] = await Promise.all([
            listGuardians({ tenantId: selectedTenantId }),
            listStudentGuardianLinks({
              tenantId: selectedTenantId,
              studentId: currentStudent.id,
            }),
          ]);
          setAvailableGuardians(guardiansResult.guardians);
          setStudentGuardianLinks(linksResult.studentGuardians);
          const linkedIds = new Set(
            linksResult.studentGuardians.map((link) => link.guardianId),
          );
          const firstAvailable = guardiansResult.guardians.find(
            (guardian) => !linkedIds.has(guardian.id),
          );
          setSelectedGuardianId(firstAvailable?.id ?? "");
          setGuardianRelationship(firstAvailable?.relationshipDefault ?? "");
        } catch (guardianError) {
          setGuardianLinksError(
            getErrorMessage(
              guardianError,
              "Unable to load available guardians.",
            ),
          );
        } finally {
          setGuardianLinksLoading(false);
        }
      } else {
        setGuardianLinksLoading(false);
      }
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Unable to load the student profile."),
      );
    } finally {
      setLoading(false);
    }
  }, [loadStudentDocuments, selectedMembershipId, selectedUserId]);

  useEffect(() => {
    if (selectedUserId) void loadProfile();
  }, [loadProfile, selectedUserId]);

  function updateForm<Field extends keyof StudentForm>(
    field: Field,
    value: StudentForm[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!membership || !tenantId) return;
    setSaving(true);
    setActionError(null);
    setNotice(null);
    try {
      const response = student
        ? await updateStudent(student.id, toUpdateInput(form), tenantId)
        : await createStudent(toCreateInput(form, tenantId, membership));
      setStudent(response.student);
      setForm(toForm(response.student));
      setEditing(false);
      setNotice(
        student ? "Student profile updated." : "Student profile created.",
      );
      if (!student) {
        setAvailableGuardians([]);
        setStudentGuardianLinks([]);
        setGuardianLinksError(null);
        setGuardianLinksLoading(true);
        try {
          const [guardiansResult, linksResult] = await Promise.all([
            listGuardians({ tenantId }),
            listStudentGuardianLinks({
              tenantId,
              studentId: response.student.id,
            }),
          ]);
          setAvailableGuardians(guardiansResult.guardians);
          setStudentGuardianLinks(linksResult.studentGuardians);
          const linkedIds = new Set(
            linksResult.studentGuardians.map((link) => link.guardianId),
          );
          const firstAvailable = guardiansResult.guardians.find(
            (guardian) => !linkedIds.has(guardian.id),
          );
          setSelectedGuardianId(firstAvailable?.id ?? "");
          setGuardianRelationship(firstAvailable?.relationshipDefault ?? "");
        } catch (guardianError) {
          setGuardianLinksError(
            getErrorMessage(
              guardianError,
              "Unable to load available guardians.",
            ),
          );
        } finally {
          setGuardianLinksLoading(false);
        }
        void loadStudentDocuments(response.student.id, tenantId);
      }
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to save the student profile."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function linkGuardian(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!student || !tenantId || !selectedGuardianId) return;
    setLinkingGuardian(true);
    setGuardianLinksError(null);
    setGuardianLinkNotice(null);
    try {
      const result = await createStudentGuardianLink({
        tenantId,
        studentId: student.id,
        guardianId: selectedGuardianId,
        relationship: guardianRelationship.trim(),
        isPrimary: isPrimaryGuardian,
        isFinancialPayer,
        receivesNotifications,
        canPickup,
      });
      setStudentGuardianLinks((current) => [...current, result.studentGuardian]);
      const nextGuardian = availableGuardians.find(
        (guardian) =>
          guardian.id !== selectedGuardianId &&
          !studentGuardianLinks.some(
            (link) => link.guardianId === guardian.id,
          ),
      );
      setSelectedGuardianId(nextGuardian?.id ?? "");
      setGuardianRelationship(nextGuardian?.relationshipDefault ?? "");
      setIsPrimaryGuardian(false);
      setIsFinancialPayer(false);
      setReceivesNotifications(true);
      setCanPickup(false);
      setGuardianLinkNotice("Guardian linked to the student.");
    } catch (error) {
      setGuardianLinksError(
        getErrorMessage(error, "Unable to link guardian to the student."),
      );
    } finally {
      setLinkingGuardian(false);
    }
  }

  const guardiansById = new Map(
    availableGuardians.map((guardian) => [guardian.id, guardian]),
  );

  async function unlinkGuardian(link: StudentGuardian) {
    if (!tenantId) return;
    setRemovingGuardianLinkId(link.id);
    setGuardianLinksError(null);
    setGuardianLinkNotice(null);
    try {
      await deleteStudentGuardianLink(link.id, tenantId);
      setStudentGuardianLinks((current) =>
        current.filter((item) => item.id !== link.id),
      );
      setSelectedGuardianId(link.guardianId);
      setGuardianRelationship(
        guardiansById.get(link.guardianId)?.relationshipDefault ?? "",
      );
      setGuardianLinkNotice("Guardian unlinked from the student.");
    } catch (error) {
      setGuardianLinksError(
        getErrorMessage(error, "Unable to unlink guardian from the student."),
      );
    } finally {
      setRemovingGuardianLinkId(null);
    }
  }

  function clearDocumentForm() {
    setEditingDocument(null);
    setDocumentType("");
    setDocumentIssuedDate("");
    setDocumentExpiryDate("");
    setDocumentNotes("");
    setDocumentFile(null);
    if (documentFileInputRef.current) {
      documentFileInputRef.current.value = "";
    }
  }

  function editDocument(document: StudentDocument) {
    setEditingDocument(document);
    setDocumentType(document.documentType);
    setDocumentIssuedDate(document.issuedDate ?? "");
    setDocumentExpiryDate(document.expiryDate ?? "");
    setDocumentNotes(document.notes ?? "");
    setDocumentFile(null);
    setDocumentsError(null);
    setDocumentsNotice(null);
  }

  async function saveDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!student || !tenantId) return;
    if (!editingDocument && !documentFile) {
      setDocumentsError("Choose a file to upload for this document.");
      return;
    }

    setSavingDocument(true);
    setDocumentsError(null);
    setDocumentsNotice(null);
    try {
      if (editingDocument) {
        const { studentDocument: updatedDocument } =
          await updateStudentDocument(
            editingDocument.id,
            {
              documentType: documentType.trim(),
              issuedDate: documentIssuedDate || null,
              expiryDate: documentExpiryDate || null,
              notes: documentNotes.trim() || null,
            },
            tenantId,
          );
        setStudentDocuments((current) =>
          current.map((item) =>
            item.id === updatedDocument.id ? updatedDocument : item,
          ),
        );
        setDocumentsNotice("Student document updated.");
      } else {
        if (!documentFile) {
          throw new Error("Choose a file to upload for this document.");
        }
        const { fileObject } = await uploadTenantFileObject(
          tenantId,
          documentFile,
        );
        const { studentDocument: createdDocument } =
          await createStudentDocument({
            tenantId,
            studentId: student.id,
            fileId: fileObject.id,
            documentType: documentType.trim(),
            issuedDate: documentIssuedDate || null,
            expiryDate: documentExpiryDate || null,
            notes: documentNotes.trim() || null,
          });
        setStudentDocuments((current) => [...current, createdDocument]);
        setDocumentsNotice("Student document uploaded.");
      }
      clearDocumentForm();
    } catch (error) {
      setDocumentsError(
        getErrorMessage(error, "Unable to save the student document."),
      );
    } finally {
      setSavingDocument(false);
    }
  }

  async function toggleDocumentVerification(document: StudentDocument) {
    setActiveDocumentId(document.id);
    setDocumentsError(null);
    setDocumentsNotice(null);
    try {
      const { studentDocument: updatedDocument } =
        await updateStudentDocument(
          document.id,
          {
            verifiedAt: document.verifiedAt ? null : new Date().toISOString(),
          },
          tenantId,
        );
      setStudentDocuments((current) =>
        current.map((item) =>
          item.id === updatedDocument.id ? updatedDocument : item,
        ),
      );
      setDocumentsNotice(
        updatedDocument.verifiedAt
          ? "Student document verified."
          : "Student document verification removed.",
      );
    } catch (error) {
      setDocumentsError(
        getErrorMessage(error, "Unable to update document verification."),
      );
    } finally {
      setActiveDocumentId(null);
    }
  }

  async function removeStudentDocument(document: StudentDocument) {
    if (
      !tenantId ||
      !window.confirm(
        `Delete the ${document.documentType} document record? The uploaded file will remain in school resources.`,
      )
    ) {
      return;
    }
    setActiveDocumentId(document.id);
    setDocumentsError(null);
    setDocumentsNotice(null);
    try {
      await deleteStudentDocument(document.id, tenantId);
      setStudentDocuments((current) =>
        current.filter((item) => item.id !== document.id),
      );
      if (editingDocument?.id === document.id) clearDocumentForm();
      setDocumentsNotice("Student document record deleted.");
    } catch (error) {
      setDocumentsError(
        getErrorMessage(error, "Unable to delete the student document."),
      );
    } finally {
      setActiveDocumentId(null);
    }
  }

  async function downloadStudentDocument(document: StudentDocument) {
    setActiveDocumentId(document.id);
    setDocumentsError(null);
    try {
      const [{ fileObject }, blob] = await Promise.all([
        getFileObject(document.fileId),
        downloadFileObject(document.fileId),
      ]);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileObject.originalName;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setDocumentsError(
        getErrorMessage(error, "Unable to download the student document."),
      );
    } finally {
      setActiveDocumentId(null);
    }
  }

  async function removeProfile() {
    if (!student || !tenantId) return;
    const confirmed = window.confirm(
      `Permanently delete the student record for ${student.firstName} ${student.lastName}?`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setActionError(null);
    setNotice(null);
    try {
      await deleteStudent(student.id, tenantId);
      setStudent(null);
      setStudentGuardianLinks([]);
      setStudentDocuments([]);
      setAvailableGuardians([]);
      clearDocumentForm();
      setForm({
        ...emptyForm,
        firstName: membership?.user?.firstName ?? student.firstName,
        middleName: membership?.user?.middleName ?? student.middleName ?? "",
        lastName: membership?.user?.lastName ?? student.lastName,
      });
      setEditing(true);
      setNotice("Student record deleted.");
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to delete the student record."),
      );
    } finally {
      setDeleting(false);
    }
  }

  const displayName =
    membership && membershipUserName(membership)
      ? membershipUserName(membership)
      : (membership?.user?.email ?? "Student");
  const roleName = membership
    ? (roles.find((role) => role.id === membership.roleId)?.name ?? "Student")
    : "Student";
  const linkedGuardianIds = new Set(
    studentGuardianLinks.map((link) => link.guardianId),
  );
  const unlinkedGuardians = availableGuardians.filter(
    (guardian) => !linkedGuardianIds.has(guardian.id),
  );

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <Link href="/school_admin/memberships" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to memberships
          </Link>
          <p className={styles.eyebrow}>SCHOOL ADMINISTRATION</p>
          <h1>Student profile</h1>
          <p className={styles.subtitle}>
            View and manage the student record associated with this school
            member.
          </p>
        </div>
        {!loading && !pageError && student && !editing && (
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              onClick={() => {
                setForm(toForm(student));
                setEditing(true);
                setActionError(null);
              }}
            >
              <Pencil aria-hidden="true" />
              Edit profile
            </Button>
            <Button
              variant="destructive"
              onClick={() => void removeProfile()}
              disabled={deleting}
            >
              {deleting ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        )}
      </header>

      {loading ? (
        <Card padding="lg" className={styles.feedback}>
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Loading selected student…
        </Card>
      ) : pageError ? (
        <Card padding="lg" className={styles.errorCard}>
          <p role="alert">{pageError}</p>
          <Button variant="outline" onClick={() => void loadProfile()}>
            Try again
          </Button>
        </Card>
      ) : membership ? (
        <>
          <Card padding="default" className={styles.memberCard}>
            <div className={styles.memberAvatar}>
              <UserRound size={22} aria-hidden="true" />
            </div>
            <div className={styles.memberDetails}>
              <h2>{displayName}</h2>
              <p>{membership.user?.email ?? membership.userId}</p>
            </div>
            <span className={styles.roleBadge}>{roleName}</span>
            <span className={styles.scopeBadge}>
              {membership.branchId ? "Branch membership" : "School-wide"}
            </span>
          </Card>

          <Card padding="default" className={styles.profileCard}>
            <CardHeader className={styles.cardHeader}>
              <div>
                <CardTitle>
                  {student ? "Student details" : "Create student record"}
                </CardTitle>
                <CardDescription>
                  {student
                    ? `Student number ${student.studentNumber} · ${student.status}`
                    : "No student record is linked to this member yet. Complete the form to create one."}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {notice && (
                <p className={styles.notice} role="status">
                  <Check size={16} aria-hidden="true" />
                  {notice}
                </p>
              )}
              {actionError && (
                <p className={styles.actionError} role="alert">
                  {actionError}
                </p>
              )}

              {editing ? (
                <form className={styles.form} onSubmit={saveProfile}>
                  <section className={styles.formSection}>
                    <h3>Student identification</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Student number"
                        value={form.studentNumber}
                        onChange={(event) =>
                          updateForm("studentNumber", event.target.value)
                        }
                        required
                      />
                      <label className={styles.field}>
                        <span>Status</span>
                        <select
                          value={form.status}
                          onChange={(event) =>
                            updateForm(
                              "status",
                              event.target.value as StudentStatus,
                            )
                          }
                        >
                          {studentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status[0].toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>

                  <section className={styles.formSection}>
                    <h3>Name and personal details</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="First name"
                        value={form.firstName}
                        onChange={(event) =>
                          updateForm("firstName", event.target.value)
                        }
                        required
                      />
                      <Input
                        label="Middle name"
                        value={form.middleName}
                        onChange={(event) =>
                          updateForm("middleName", event.target.value)
                        }
                      />
                      <Input
                        label="Last name"
                        value={form.lastName}
                        onChange={(event) =>
                          updateForm("lastName", event.target.value)
                        }
                        required
                      />
                      <Input
                        label="Preferred name"
                        value={form.preferredName}
                        onChange={(event) =>
                          updateForm("preferredName", event.target.value)
                        }
                      />
                      <label className={styles.field}>
                        <span>Gender</span>
                        <select
                          value={form.gender}
                          onChange={(event) =>
                            updateForm("gender", event.target.value)
                          }
                        >
                          <option value="">Not specified</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </label>
                      <Input
                        label="Date of birth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(event) =>
                          updateForm("dateOfBirth", event.target.value)
                        }
                      />
                      <Input
                        label="Place of birth"
                        value={form.birthPlace}
                        onChange={(event) =>
                          updateForm("birthPlace", event.target.value)
                        }
                      />
                      <Input
                        label="Nationality"
                        value={form.nationality}
                        onChange={(event) =>
                          updateForm("nationality", event.target.value)
                        }
                      />
                      <Input
                        label="National ID"
                        value={form.nationalId}
                        onChange={(event) =>
                          updateForm("nationalId", event.target.value)
                        }
                      />
                      <Input
                        label="Blood group"
                        value={form.bloodGroup}
                        onChange={(event) =>
                          updateForm("bloodGroup", event.target.value)
                        }
                      />
                    </div>
                  </section>

                  <section className={styles.formSection}>
                    <h3>Enrollment and contact</h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Admission date"
                        type="date"
                        value={form.admissionDate}
                        onChange={(event) =>
                          updateForm("admissionDate", event.target.value)
                        }
                      />
                      <Input
                        label="Graduation date"
                        type="date"
                        value={form.graduationDate}
                        onChange={(event) =>
                          updateForm("graduationDate", event.target.value)
                        }
                      />
                      <Input
                        label="Address"
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                      />
                      <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span>Emergency notes</span>
                        <textarea
                          value={form.emergencyNotes}
                          onChange={(event) =>
                            updateForm("emergencyNotes", event.target.value)
                          }
                          rows={4}
                        />
                      </label>
                    </div>
                  </section>

                  <div className={styles.formActions}>
                    {student && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={saving}
                        onClick={() => {
                          setForm(toForm(student));
                          setEditing(false);
                          setActionError(null);
                        }}
                      >
                        <X aria-hidden="true" />
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <LoaderCircle
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : student ? (
                        <Save aria-hidden="true" />
                      ) : (
                        <Check aria-hidden="true" />
                      )}
                      {saving
                        ? "Saving…"
                        : student
                          ? "Save changes"
                          : "Create student record"}
                    </Button>
                  </div>
                </form>
              ) : student ? (
                <dl className={styles.detailsGrid}>
                  <Detail
                    label="Student number"
                    value={student.studentNumber}
                  />
                  <Detail
                    label="Full name"
                    value={[
                      student.firstName,
                      student.middleName,
                      student.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <Detail label="Status" value={student.status} />
                  <Detail
                    label="Preferred name"
                    value={student.preferredName}
                  />
                  <Detail label="Gender" value={student.gender} />
                  <Detail label="Date of birth" value={student.dateOfBirth} />
                  <Detail label="Place of birth" value={student.birthPlace} />
                  <Detail label="Nationality" value={student.nationality} />
                  <Detail label="National ID" value={student.nationalId} />
                  <Detail label="Blood group" value={student.bloodGroup} />
                  <Detail
                    label="Admission date"
                    value={student.admissionDate}
                  />
                  <Detail
                    label="Graduation date"
                    value={student.graduationDate}
                  />
                  <Detail label="Address" value={student.address} />
                  <Detail
                    label="Emergency notes"
                    value={student.emergencyNotes}
                  />
                </dl>
              ) : null}
            </CardContent>
          </Card>

          {student && (
            <Card padding="default" className={styles.profileCard}>
              <CardHeader
                className={styles.cardHeader}
                action={
                  !guardianLinksLoading &&
                  !guardianLinksError && (
                    <span className={styles.guardianCount}>
                      {studentGuardianLinks.length} linked
                    </span>
                  )
                }
              >
                <div>
                  <CardTitle>Guardians</CardTitle>
                  <CardDescription>
                    Link existing guardians from this school to this student.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {guardianLinkNotice && (
                  <p className={styles.notice} role="status">
                    <Check size={16} aria-hidden="true" />
                    {guardianLinkNotice}
                  </p>
                )}
                {guardianLinksError && (
                  <div className={styles.guardianError}>
                    <p className={styles.actionError} role="alert">
                      {guardianLinksError}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void loadProfile()}
                    >
                      Try again
                    </Button>
                  </div>
                )}

                {guardianLinksError ? null : guardianLinksLoading ? (
                  <p className={styles.feedback}>
                    <LoaderCircle
                      className="animate-spin"
                      size={16}
                      aria-hidden="true"
                    />
                    Loading guardians…
                  </p>
                ) : (
                  <>
                    {studentGuardianLinks.length ? (
                      <ul className={styles.guardianList}>
                        {studentGuardianLinks.map((link) => {
                          const guardian = guardiansById.get(link.guardianId);
                          const name = guardian
                            ? [
                                guardian.firstName,
                                guardian.middleName,
                                guardian.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ")
                            : "Guardian record unavailable";
                          const permissions = [
                            link.isPrimary && "Primary contact",
                            link.isFinancialPayer && "Financial payer",
                            link.receivesNotifications &&
                              "Receives notifications",
                            link.canPickup && "Can pick up",
                          ].filter((permission): permission is string =>
                            Boolean(permission),
                          );
                          return (
                            <li key={link.id} className={styles.guardianItem}>
                              <div className={styles.guardianInfo}>
                                <div className={styles.guardianIdentity}>
                                  <span className={styles.guardianAvatar}>
                                    <UserRound size={18} aria-hidden="true" />
                                  </span>
                                  <div className={styles.guardianName}>
                                    <strong>{name}</strong>
                                    <span>
                                      {link.relationship ||
                                        "Relationship not specified"}
                                    </span>
                                  </div>
                                </div>
                                {(guardian?.phone || guardian?.email) && (
                                  <div className={styles.guardianContacts}>
                                    {guardian.phone && (
                                      <span>
                                        <b>Phone</b>
                                        {guardian.phone}
                                      </span>
                                    )}
                                    {guardian.email && (
                                      <span>
                                        <b>Email</b>
                                        {guardian.email}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className={styles.guardianFlags}>
                                  {permissions.length ? (
                                    permissions.map((permission) => (
                                      <span
                                        key={permission}
                                        className={styles.guardianFlag}
                                      >
                                        {permission}
                                      </span>
                                    ))
                                  ) : (
                                    <span className={styles.guardianNoFlags}>
                                      No additional permissions
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={removingGuardianLinkId === link.id}
                                onClick={() => void unlinkGuardian(link)}
                              >
                                {removingGuardianLinkId === link.id ? (
                                  <LoaderCircle
                                    className="animate-spin"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Unlink aria-hidden="true" />
                                )}
                                Unlink
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className={styles.guardianEmpty}>
                        <span className={styles.guardianEmptyIcon}>
                          <UserRound size={18} aria-hidden="true" />
                        </span>
                        <div>
                          <strong>No guardians linked yet</strong>
                          <p>
                            Choose an available guardian below to add them to
                            this student’s contacts.
                          </p>
                        </div>
                      </div>
                    )}

                    {unlinkedGuardians.length ? (
                      <form
                        className={styles.guardianForm}
                        onSubmit={linkGuardian}
                      >
                        <h3>Link an available guardian</h3>
                        <div className={styles.formGrid}>
                          <label className={styles.field}>
                            <span>Select guardian</span>
                            <select
                              value={selectedGuardianId}
                              onChange={(event) => {
                                const guardian = availableGuardians.find(
                                  (item) => item.id === event.target.value,
                                );
                                setSelectedGuardianId(event.target.value);
                                setGuardianRelationship(
                                  guardian?.relationshipDefault ?? "",
                                );
                              }}
                              required
                            >
                              {unlinkedGuardians.map((guardian) => (
                                <option key={guardian.id} value={guardian.id}>
                                  {[
                                    guardian.firstName,
                                    guardian.middleName,
                                    guardian.lastName,
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                  {guardian.phone ? ` · ${guardian.phone}` : ""}
                                </option>
                              ))}
                            </select>
                          </label>
                          <Input
                            label="Relationship"
                            value={guardianRelationship}
                            onChange={(event) =>
                              setGuardianRelationship(event.target.value)
                            }
                            placeholder="e.g. Mother, Father, Aunt"
                            required
                          />
                        </div>
                        <p className={styles.guardianHelp}>
                          Relationship is required. A guardian&apos;s default
                          relationship is filled in automatically when set.
                        </p>
                        <div className={styles.guardianOptions}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isPrimaryGuardian}
                              onChange={(event) =>
                                setIsPrimaryGuardian(event.target.checked)
                              }
                            />
                            Primary contact
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={isFinancialPayer}
                              onChange={(event) =>
                                setIsFinancialPayer(event.target.checked)
                              }
                            />
                            Financial payer
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={receivesNotifications}
                              onChange={(event) =>
                                setReceivesNotifications(event.target.checked)
                              }
                            />
                            Receives notifications
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={canPickup}
                              onChange={(event) =>
                                setCanPickup(event.target.checked)
                              }
                            />
                            Can pick up student
                          </label>
                        </div>
                        <div className={styles.formActions}>
                          <Button
                            type="submit"
                            disabled={linkingGuardian || !selectedGuardianId}
                          >
                            {linkingGuardian ? (
                              <LoaderCircle
                                className="animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <UserPlus aria-hidden="true" />
                            )}
                            {linkingGuardian ? "Linking…" : "Link guardian"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <p className={styles.feedback}>
                        {availableGuardians.length
                          ? "All available guardians are already linked."
                          : "No guardian records are available for this school. Create a guardian profile first."}
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {student && (
              <Card padding="default" className={styles.profileCard}>
                <CardHeader
                  className={styles.cardHeader}
                  action={
                    !documentsLoading && !documentsError && (
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
                      Upload and manage supporting documents for this student.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {documentsNotice && (
                    <p className={styles.notice} role="status">
                      <Check size={16} aria-hidden="true" />
                      {documentsNotice}
                    </p>
                  )}
                  {documentsError && (
                    <div className={styles.guardianError}>
                      <p className={styles.actionError} role="alert">
                        {documentsError}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void loadStudentDocuments(student.id, tenantId)}
                      >
                        Try again
                      </Button>
                    </div>
                  )}

                  {documentsLoading ? (
                    <p className={styles.feedback}>
                      <LoaderCircle
                        className="animate-spin"
                        size={16}
                        aria-hidden="true"
                      />
                      Loading student documents…
                    </p>
                  ) : studentDocuments.length ? (
                    <ul className={styles.documentList}>
                      {studentDocuments.map((document) => (
                        <li key={document.id} className={styles.documentItem}>
                          <div className={styles.documentInfo}>
                            <span className={styles.documentIcon}>
                              <FileText size={18} aria-hidden="true" />
                            </span>
                            <div className={styles.documentDetails}>
                              <strong>{document.documentType}</strong>
                              <span>
                                {document.issuedDate
                                  ? `Issued ${document.issuedDate}`
                                  : "Issue date not provided"}
                                {document.expiryDate
                                  ? ` · Expires ${document.expiryDate}`
                                  : ""}
                              </span>
                              {document.notes && <p>{document.notes}</p>}
                              <span className={styles.documentFileId}>
                                Attached file available to download
                              </span>
                            </div>
                          </div>
                          <div className={styles.documentActions}>
                            <span
                              className={
                                document.verifiedAt
                                  ? styles.documentVerified
                                  : styles.documentUnverified
                              }
                            >
                              {document.verifiedAt
                                ? "Verified"
                                : "Not verified"}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={activeDocumentId === document.id}
                              onClick={() =>
                                void downloadStudentDocument(document)
                              }
                            >
                              {activeDocumentId === document.id ? (
                                <LoaderCircle
                                  className="animate-spin"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Download aria-hidden="true" />
                              )}
                              Download
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={activeDocumentId === document.id}
                              onClick={() =>
                                void toggleDocumentVerification(document)
                              }
                            >
                              <BadgeCheck aria-hidden="true" />
                              {document.verifiedAt ? "Unverify" : "Verify"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => editDocument(document)}
                            >
                              <Pencil aria-hidden="true" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={activeDocumentId === document.id}
                              onClick={() =>
                                void removeStudentDocument(document)
                              }
                            >
                              <Trash2 aria-hidden="true" />
                              Delete
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.documentEmpty}>
                      <FileText size={20} aria-hidden="true" />
                      <div>
                        <strong>No documents added</strong>
                        <p>Upload a document using the form below.</p>
                      </div>
                    </div>
                  )}

                  <form className={styles.documentForm} onSubmit={saveDocument}>
                    <h3>
                      {editingDocument ? "Edit document details" : "Add a document"}
                    </h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Document type"
                        value={documentType}
                        onChange={(event) => setDocumentType(event.target.value)}
                        placeholder="e.g. Birth certificate"
                        required
                      />
                      {!editingDocument && (
                        <Input
                          ref={documentFileInputRef}
                          label="Document file"
                          type="file"
                          onChange={(event) =>
                            setDocumentFile(event.target.files?.[0] ?? null)
                          }
                          required
                        />
                      )}
                      <Input
                        label="Issue date"
                        type="date"
                        value={documentIssuedDate}
                        onChange={(event) =>
                          setDocumentIssuedDate(event.target.value)
                        }
                      />
                      <Input
                        label="Expiry date"
                        type="date"
                        value={documentExpiryDate}
                        onChange={(event) =>
                          setDocumentExpiryDate(event.target.value)
                        }
                      />
                      <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span>Notes</span>
                        <textarea
                          value={documentNotes}
                          onChange={(event) =>
                            setDocumentNotes(event.target.value)
                          }
                          rows={3}
                        />
                      </label>
                    </div>
                    {editingDocument && (
                      <p className={styles.documentHelp}>
                        Changing the uploaded file is not available while
                        editing. To replace it, delete this record and add a new
                        document.
                      </p>
                    )}
                    <div className={styles.documentFormActions}>
                      {editingDocument && (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={savingDocument}
                          onClick={clearDocumentForm}
                        >
                          <X aria-hidden="true" />
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={savingDocument || documentsLoading}
                      >
                        {savingDocument ? (
                          <LoaderCircle
                            className="animate-spin"
                            aria-hidden="true"
                          />
                        ) : editingDocument ? (
                          <Save aria-hidden="true" />
                        ) : (
                          <Plus aria-hidden="true" />
                        )}
                        {savingDocument
                          ? "Saving…"
                          : editingDocument
                            ? "Save document"
                            : "Upload document"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
        </>
      ) : null}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className={styles.detail}>
      <dt>{label}</dt>
      <dd>{value?.trim() || "Not provided"}</dd>
    </div>
  );
}
