import { apiFetch } from "../../lib/api";

const STUDENT_APPLICATIONS_ENDPOINT = "/student-applications";

export type StudentApplicationStatus =
  | "draft"
  | "submitted"
  | "review"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "converted";

export type StudentApplication = {
  id: string;
  tenantId: string;
  branchId: string | null;
  applicantName: string;
  applicantEmail: string | null;
  applicantPhone: string | null;
  academicYearId: string | null;
  desiredGradeLevelId: string | null;
  status: StudentApplicationStatus;
  submittedAt: string | null;
  convertedStudentId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type StudentApplicationResponse = {
  studentApplication: StudentApplication;
};

export type StudentApplicationListResponse = {
  studentApplications: StudentApplication[];
};

export type StudentApplicationDirectoryBranch = {
  id: string;
  tenantId: string;
  code: string;
  name: string;
};

export type StudentApplicationSchool = {
  id: string;
  code: string;
  displayName: string;
  branches: StudentApplicationDirectoryBranch[];
};

export type StudentApplicationDirectoryResponse = {
  schools: StudentApplicationSchool[];
};

export type StudentApplicationListFilters = {
  tenantId?: string;
  branchId?: string | null;
  userId?: string;
  academicYearId?: string | null;
  desiredGradeLevelId?: string | null;
  status?: StudentApplicationStatus;
  convertedStudentId?: string | null;
};

export type CreateOwnStudentApplicationInput = Pick<
  StudentApplication,
  "tenantId" | "applicantName"
> &
  Partial<
    Pick<
      StudentApplication,
      | "branchId"
      | "applicantEmail"
      | "applicantPhone"
      | "academicYearId"
      | "desiredGradeLevelId"
      | "payload"
    >
  >;

export type UpdateOwnStudentApplicationInput = Partial<
  Pick<
    StudentApplication,
    | "applicantName"
    | "applicantEmail"
    | "applicantPhone"
    | "academicYearId"
    | "desiredGradeLevelId"
    | "payload"
  >
>;

export type UpdateStudentApplicationInput = Partial<
  Pick<
    StudentApplication,
    | "branchId"
    | "applicantName"
    | "applicantEmail"
    | "applicantPhone"
    | "academicYearId"
    | "desiredGradeLevelId"
    | "status"
    | "submittedAt"
    | "convertedStudentId"
    | "payload"
  >
>;

export async function getStudentApplicationDirectory() {
  return apiFetch<StudentApplicationDirectoryResponse>(
    `${STUDENT_APPLICATIONS_ENDPOINT}/directory`,
  );
}

function queryString<T extends object>(values: T) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function studentApplicationPath(id: string, tenantId?: string) {
  return `${STUDENT_APPLICATIONS_ENDPOINT}/${encodeURIComponent(id)}${queryString(
    { tenantId },
  )}`;
}

function ownStudentApplicationPath(id: string, tenantId?: string) {
  return `${STUDENT_APPLICATIONS_ENDPOINT}/me/${encodeURIComponent(id)}${queryString(
    { tenantId },
  )}`;
}

export async function createOwnStudentApplication(
  input: CreateOwnStudentApplicationInput,
) {
  return apiFetch<StudentApplicationResponse>(
    `${STUDENT_APPLICATIONS_ENDPOINT}/me`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function listOwnStudentApplications(tenantId?: string) {
  return apiFetch<StudentApplicationListResponse>(
    `${STUDENT_APPLICATIONS_ENDPOINT}/me${queryString({ tenantId })}`,
  );
}

export async function getOwnStudentApplication(id: string, tenantId?: string) {
  return apiFetch<StudentApplicationResponse>(
    ownStudentApplicationPath(id, tenantId),
  );
}

export async function updateOwnStudentApplication(
  id: string,
  input: UpdateOwnStudentApplicationInput,
  tenantId?: string,
) {
  return apiFetch<StudentApplicationResponse>(
    ownStudentApplicationPath(id, tenantId),
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteOwnStudentApplication(
  id: string,
  tenantId?: string,
) {
  return apiFetch<StudentApplicationResponse>(
    ownStudentApplicationPath(id, tenantId),
    { method: "DELETE" },
  );
}

export async function listStudentApplications(
  filters: StudentApplicationListFilters = {},
) {
  return apiFetch<StudentApplicationListResponse>(
    `${STUDENT_APPLICATIONS_ENDPOINT}/${queryString(filters)}`,
  );
}

export async function getStudentApplication(id: string, tenantId?: string) {
  return apiFetch<StudentApplicationResponse>(
    studentApplicationPath(id, tenantId),
  );
}

export async function updateStudentApplication(
  id: string,
  input: UpdateStudentApplicationInput,
  tenantId?: string,
) {
  return apiFetch<StudentApplicationResponse>(
    studentApplicationPath(id, tenantId),
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteStudentApplication(id: string, tenantId?: string) {
  return apiFetch<StudentApplicationResponse>(
    studentApplicationPath(id, tenantId),
    { method: "DELETE" },
  );
}
