import { apiFetch } from "../../lib/api";

const GUARDIANS_ENDPOINT = "/guardians";

export type GuardianStatus = "active" | "inactive" | "archived";

export type Guardian = {
  id: string;
  tenantId: string;
  branchId: string | null;
  userId: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  relationshipDefault: string | null;
  phone: string | null;
  email: string | null;
  occupation: string | null;
  address: string | null;
  emergencyContact: boolean;
  status: GuardianStatus;
  createdAt: string;
  updatedAt: string;
};

export type GuardianResponse = {
  guardian: Guardian;
};

export type GuardianListResponse = {
  guardians: Guardian[];
};

export type GuardianListFilters = {
  tenantId?: string;
  branchId?: string;
  userId?: string;
  status?: GuardianStatus;
};

type GuardianProfileFields = Pick<
  Guardian,
  | "firstName"
  | "middleName"
  | "lastName"
  | "relationshipDefault"
  | "phone"
  | "email"
  | "occupation"
  | "address"
  | "emergencyContact"
>;

export type CreateOwnGuardianInput = Pick<Guardian, "firstName" | "lastName"> &
  Partial<Omit<GuardianProfileFields, "firstName" | "lastName">>;

export type UpdateOwnGuardianInput = Partial<GuardianProfileFields>;

export type CreateGuardianInput = Pick<
  Guardian,
  "tenantId" | "firstName" | "lastName"
> &
  Partial<
    Omit<
      Guardian,
      "id" | "tenantId" | "createdAt" | "updatedAt" | "firstName" | "lastName"
    >
  >;

export type UpdateGuardianInput = Partial<
  Omit<Guardian, "id" | "tenantId" | "createdAt" | "updatedAt">
>;

function queryString<T extends object>(values: T) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function guardianPath(id: string, tenantId?: string) {
  return `${GUARDIANS_ENDPOINT}/${encodeURIComponent(id)}${queryString({
    tenantId,
  })}`;
}

export async function getOwnGuardians() {
  return apiFetch<GuardianListResponse>(`${GUARDIANS_ENDPOINT}/me`);
}

export async function createOwnGuardian(input: CreateOwnGuardianInput) {
  return apiFetch<GuardianResponse>(`${GUARDIANS_ENDPOINT}/me`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOwnGuardian(input: UpdateOwnGuardianInput) {
  return apiFetch<GuardianResponse>(`${GUARDIANS_ENDPOINT}/me`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function listGuardians(filters: GuardianListFilters = {}) {
  return apiFetch<GuardianListResponse>(
    `${GUARDIANS_ENDPOINT}/${queryString(filters)}`,
  );
}

export async function getGuardian(id: string, tenantId?: string) {
  return apiFetch<GuardianResponse>(guardianPath(id, tenantId));
}

export async function createGuardian(input: CreateGuardianInput) {
  return apiFetch<GuardianResponse>(GUARDIANS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateGuardian(
  id: string,
  input: UpdateGuardianInput,
  tenantId?: string,
) {
  return apiFetch<GuardianResponse>(guardianPath(id, tenantId), {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteGuardian(id: string, tenantId?: string) {
  return apiFetch<GuardianResponse>(guardianPath(id, tenantId), {
    method: "DELETE",
  });
}
