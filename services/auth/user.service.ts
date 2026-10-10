import { apiFetch } from "../../lib/api";

const USERS_ENDPOINT = "/users";

export type UserStatus =
  | "pending"
  | "active"
  | "inactive"
  | "locked"
  | "archived";

export type User = {
  id: string;
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
  status?: UserStatus;
};

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

export async function deleteUser(id: string) {
  return apiFetch<UserResponse>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
