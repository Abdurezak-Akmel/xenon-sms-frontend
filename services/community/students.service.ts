import { apiFetch } from "../../lib/api";

const STUDENTS_ENDPOINT = "/students";

export type StudentStatus =
  | "applicant"
  | "enrolled"
  | "active"
  | "transferred"
  | "suspended"
  | "graduated"
  | "withdrawn"
  | "archived";

export type Student = {
  id: string;
  tenantId: string;
  userId: string | null;
  studentNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  preferredName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  birthPlace: string | null;
  nationality: string | null;
  nationalId: string | null;
  bloodGroup: string | null;
  address: string | null;
  photoFileId: string | null;
  status: StudentStatus;
  admissionDate: string | null;
  graduationDate: string | null;
  emergencyNotes: string | null;
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  branchId: string | null;
};

export type StudentResponse = {
  student: Student;
};

export type StudentListFilters = {
  tenantId?: string;
  branchId?: string;
  userId?: string;
  studentNumber?: string;
  status?: StudentStatus;
};

export type CreateStudentInput = Pick<
  Student,
  "tenantId" | "studentNumber" | "firstName" | "lastName"
> &
  Partial<
    Omit<
      Student,
      | "id"
      | "tenantId"
      | "studentNumber"
      | "firstName"
      | "lastName"
      | "createdAt"
      | "updatedAt"
    >
  >;

export type UpdateStudentInput = Partial<Omit<CreateStudentInput, "tenantId">>;

export type UpdateOwnStudentInput = Pick<
  Student,
  | "preferredName"
  | "gender"
  | "firstName"
  | "middleName"
  | "lastName"
  | "dateOfBirth"
  | "birthPlace"
  | "nationality"
  | "nationalId"
  | "bloodGroup"
  | "address"
  | "emergencyNotes"
>;

export type StudentListResponse = {
  students: Student[];
};

function queryString<T extends object>(values: T) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getOwnStudent() {
  return apiFetch<StudentResponse>(`${STUDENTS_ENDPOINT}/me`);
}

export async function createOwnStudent(studentNumber: string) {
  return apiFetch<StudentResponse>(`${STUDENTS_ENDPOINT}/me`, {
    method: "POST",
    body: JSON.stringify({ studentNumber }),
  });
}

export async function updateOwnStudent(input: UpdateOwnStudentInput) {
  return apiFetch<StudentResponse>(`${STUDENTS_ENDPOINT}/me`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function listStudents(filters: StudentListFilters = {}) {
  return apiFetch<StudentListResponse>(
    `${STUDENTS_ENDPOINT}/${queryString(filters)}`,
  );
}

export async function getStudent(id: string, tenantId?: string) {
  const query = queryString({ tenantId });
  return apiFetch<StudentResponse>(
    `${STUDENTS_ENDPOINT}/${encodeURIComponent(id)}${query}`,
  );
}

export async function createStudent(input: CreateStudentInput) {
  return apiFetch<StudentResponse>(STUDENTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateStudent(
  id: string,
  input: UpdateStudentInput,
  tenantId?: string,
) {
  const query = queryString({ tenantId });
  return apiFetch<StudentResponse>(
    `${STUDENTS_ENDPOINT}/${encodeURIComponent(id)}${query}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteStudent(id: string, tenantId?: string) {
  const query = queryString({ tenantId });
  return apiFetch<StudentResponse>(
    `${STUDENTS_ENDPOINT}/${encodeURIComponent(id)}${query}`,
    { method: "DELETE" },
  );
}
