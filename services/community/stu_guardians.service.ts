import { apiFetch } from "../../lib/api";
import type { Student } from "./students.service";

const STUDENT_GUARDIANS_ENDPOINT = "/student-guardians";

export type StudentGuardian = {
  id: string;
  tenantId: string;
  studentId: string;
  guardianId: string;
  relationship: string;
  isPrimary: boolean;
  isFinancialPayer: boolean;
  receivesNotifications: boolean;
  canPickup: boolean;
  createdAt: string;
};

export type StudentGuardianResponse = {
  studentGuardian: StudentGuardian;
};

export type StudentGuardianListResponse = {
  studentGuardians: StudentGuardian[];
};

export type StudentGuardianChild = {
  student: Student;
  relationship: StudentGuardian;
};

export type StudentGuardianChildrenResponse = {
  children: StudentGuardianChild[];
};

export type StudentGuardianListFilters = {
  tenantId: string;
  studentId?: string;
  guardianId?: string;
  isPrimary?: boolean;
  isFinancialPayer?: boolean;
  receivesNotifications?: boolean;
  canPickup?: boolean;
};

export type CreateStudentGuardianInput = Pick<
  StudentGuardian,
  "tenantId" | "studentId" | "guardianId" | "relationship"
> &
  Partial<
    Pick<
      StudentGuardian,
      "isPrimary" | "isFinancialPayer" | "receivesNotifications" | "canPickup"
    >
  >;

export type UpdateStudentGuardianInput = Partial<
  Pick<
    StudentGuardian,
    | "relationship"
    | "isPrimary"
    | "isFinancialPayer"
    | "receivesNotifications"
    | "canPickup"
  >
>;

function queryString(values: Record<string, string | boolean | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function studentGuardianPath(id: string, tenantId?: string) {
  return `${STUDENT_GUARDIANS_ENDPOINT}/${encodeURIComponent(id)}${queryString({
    tenantId,
  })}`;
}

export async function getOwnStudentGuardianLinks() {
  return apiFetch<StudentGuardianListResponse>(
    `${STUDENT_GUARDIANS_ENDPOINT}/me`,
  );
}

export async function getOwnStudentGuardianChildren() {
  return apiFetch<StudentGuardianChildrenResponse>(
    `${STUDENT_GUARDIANS_ENDPOINT}/me/children`,
  );
}

export async function listStudentGuardianLinks(
  filters: StudentGuardianListFilters,
) {
  return apiFetch<StudentGuardianListResponse>(
    `${STUDENT_GUARDIANS_ENDPOINT}/${queryString(filters)}`,
  );
}

export async function createStudentGuardianLink(
  input: CreateStudentGuardianInput,
) {
  return apiFetch<StudentGuardianResponse>(STUDENT_GUARDIANS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getStudentGuardianLink(id: string, tenantId?: string) {
  return apiFetch<StudentGuardianResponse>(studentGuardianPath(id, tenantId));
}

export async function updateStudentGuardianLink(
  id: string,
  input: UpdateStudentGuardianInput,
  tenantId?: string,
) {
  return apiFetch<StudentGuardianResponse>(studentGuardianPath(id, tenantId), {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteStudentGuardianLink(id: string, tenantId?: string) {
  return apiFetch<StudentGuardianResponse>(studentGuardianPath(id, tenantId), {
    method: "DELETE",
  });
}
