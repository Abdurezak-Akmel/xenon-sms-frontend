import { apiFetch } from "../../lib/api";

const USERS_ENDPOINT = "/users";
const API_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
).origin;

export type UserStatus =
  | "pending"
  | "active"
  | "inactive"
  | "locked"
  | "archived";

export type User = {
  id: string;
  globalRoleId: string | null;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  mfaEnabled: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type MembershipCandidate = Pick<
  User,
  | "id"
  | "globalRoleId"
  | "email"
  | "firstName"
  | "middleName"
  | "lastName"
  | "status"
>;

export type UpdateUserProfileInput = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string | null;
};

export type CreateUserInput = {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  password: string;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "password">> & {
  globalRoleId?: string | null;
  status?: UserStatus;
};

export type UpdateUserWithAvatarInput = Omit<UpdateUserInput, "avatarUrl">;

export type UserListFilters = {
  status?: UserStatus;
  email?: string;
  search?: string;
};

export type UserListResponse = {
  users: User[];
};

export type UserResponse = {
  message?: string;
  user: User;
};

type AuthenticatedTokenClaims = {
  id?: unknown;
  tenantId?: unknown;
  branchId?: unknown;
};

function getAuthenticatedTokenClaims(): AuthenticatedTokenClaims {
  if (typeof window === "undefined") {
    throw new Error("The signed-in account is only available in the browser.");
  }

  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must be signed in to view this page.");

  const encodedPayload = token.split(".")[1];
  if (!encodedPayload)
    throw new Error("Unable to identify the signed-in account.");

  let payload: unknown;
  try {
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error("Unable to identify the signed-in user.");
  }

  if (typeof payload !== "object" || payload === null || !("id" in payload)) {
    throw new Error("The access token does not contain account information.");
  }
  return payload;
}

export function getAuthenticatedTenantId() {
  const claims = getAuthenticatedTokenClaims();
  if (typeof claims.tenantId !== "string" || !claims.tenantId) {
    throw new Error(
      "The signed-in account has no selected school. Sign in again and choose a school.",
    );
  }
  return claims.tenantId;
}

export function getAuthenticatedUserId() {
  const claims = getAuthenticatedTokenClaims();
  if (typeof claims.id !== "string" || !claims.id) {
    throw new Error("The access token does not contain account information.");
  }
  return claims.id;
}

export function getAuthenticatedBranchId() {
  const claims = getAuthenticatedTokenClaims();
  if (typeof claims.branchId !== "string" || !claims.branchId) {
    throw new Error(
      "The signed-in account has no selected branch. Sign in again and choose a branch.",
    );
  }
  return claims.branchId;
}

export function getUserAvatarSrc(avatarUrl: string | null) {
  if (!avatarUrl) return undefined;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
  return new URL(avatarUrl, API_ORIGIN).toString();
}

export async function getCurrentUser() {
  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/me`);
}

export async function listUsers(filters: UserListFilters = {}) {
  const query = new URLSearchParams();
  if (filters.status) query.set("status", filters.status);
  if (filters.email) query.set("email", filters.email);
  if (filters.search) query.set("search", filters.search);

  const queryString = query.toString();
  return apiFetch<UserListResponse>(
    `${USERS_ENDPOINT}${queryString ? `?${queryString}` : ""}`,
  );
}

export async function listMembershipCandidates() {
  return apiFetch<{ users: MembershipCandidate[] }>(
    `${USERS_ENDPOINT}/membership-candidates`,
  );
}

export async function getUser(id: string) {
  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`);
}

export async function createUser(input: CreateUserInput) {
  return apiFetch<UserResponse>(USERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateUser(id: string, input: UpdateUserInput) {
  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function updateCurrentUserProfile(input: UpdateUserProfileInput) {
  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/me`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function updateCurrentUserAvatar(avatar: File) {
  const formData = new FormData();
  formData.append("avatar", avatar);

  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/me`, {
    method: "PATCH",
    body: formData,
  });
}

export async function updateUserAvatar(
  id: string,
  avatar: File,
  input: UpdateUserWithAvatarInput = {},
) {
  const formData = new FormData();
  formData.append("avatar", avatar);

  for (const [field, value] of Object.entries(input)) {
    if (value !== undefined) {
      formData.append(field, value ?? "");
    }
  }

  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteUser(id: string) {
  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
