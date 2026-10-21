import { apiFetch } from "../../lib/api";

const STUDENT_DOCUMENTS_ENDPOINT = "/student-documents";

export type StudentDocument = {
  id: string;
  tenantId: string;
  studentId: string;
  fileId: string;
  documentType: string;
  issuedDate: string | null;
  expiryDate: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  notes: string | null;
  createdAt: string;
};

export type StudentDocumentResponse = {
  studentDocument: StudentDocument;
};

export type StudentDocumentListResponse = {
  studentDocuments: StudentDocument[];
};

export type StudentDocumentListFilters = {
  tenantId?: string;
  studentId?: string;
  fileId?: string;
  documentType?: string;
  verifiedBy?: string;
};

export type CreateStudentDocumentInput = Pick<
  StudentDocument,
  "tenantId" | "studentId" | "fileId" | "documentType"
> &
  Partial<Pick<StudentDocument, "issuedDate" | "expiryDate" | "notes">>;

export type UpdateStudentDocumentInput = Partial<
  Pick<
    StudentDocument,
    | "fileId"
    | "documentType"
    | "issuedDate"
    | "expiryDate"
    | "verifiedAt"
    | "notes"
  >
>;

function queryString<T extends object>(values: T) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function studentDocumentPath(id: string, tenantId?: string) {
  return `${STUDENT_DOCUMENTS_ENDPOINT}/${encodeURIComponent(id)}${queryString({
    tenantId,
  })}`;
}

export async function getOwnStudentDocuments(
  filters: Omit<StudentDocumentListFilters, "studentId"> = {},
) {
  return apiFetch<StudentDocumentListResponse>(
    `${STUDENT_DOCUMENTS_ENDPOINT}/me${queryString(filters)}`,
  );
}

export async function listStudentDocuments(
  filters: StudentDocumentListFilters = {},
) {
  return apiFetch<StudentDocumentListResponse>(
    `${STUDENT_DOCUMENTS_ENDPOINT}/${queryString(filters)}`,
  );
}

export async function getStudentDocument(id: string, tenantId?: string) {
  return apiFetch<StudentDocumentResponse>(
    studentDocumentPath(id, tenantId),
  );
}

export async function downloadStudentDocumentFile(
  id: string,
  tenantId?: string,
) {
  return apiFetch<{ blob: Blob; filename: string }>(
    `${STUDENT_DOCUMENTS_ENDPOINT}/${encodeURIComponent(id)}/download${queryString({
      tenantId,
    })}`,
    { responseType: "download" },
  );
}

export async function createStudentDocument(
  input: CreateStudentDocumentInput,
) {
  return apiFetch<StudentDocumentResponse>(STUDENT_DOCUMENTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateStudentDocument(
  id: string,
  input: UpdateStudentDocumentInput,
  tenantId?: string,
) {
  return apiFetch<StudentDocumentResponse>(
    studentDocumentPath(id, tenantId),
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteStudentDocument(id: string, tenantId?: string) {
  return apiFetch<StudentDocumentResponse>(studentDocumentPath(id, tenantId), {
    method: "DELETE",
  });
}