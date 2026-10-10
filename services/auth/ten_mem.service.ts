import { apiFetch } from "../../lib/api";

const TENANT_MEMBERSHIPS_ENDPOINT = "/tenant-memberships";

export type TenantMembershipStatus =
  | "invited"
  | "active"
  | "suspended"
  | "revoked";

export type TenantMembership = {
  id: string;
  userId: string;
  tenantId: string;
  branchId: string | null;
  roleId: string;
  billingEligible: boolean;
  status: TenantMembershipStatus;
  joinedAt: string | null;
  invitedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TenantMembershipRole = {
  id: string;
  code: string;
  name: string;
  scope: "platform" | "tenant" | "branch" | "self" | "linked";
  description: string | null;
};

type TenantMembershipFields = {
  userId: string;
  tenantId: string;
  branchId?: string | null;
  roleId: string;
  billingEligible?: boolean;
  status?: TenantMembershipStatus;
  joinedAt?: string | null;
  invitedAt?: string | null;
  revokedAt?: string | null;
};

export type CreateTenantMembershipInput = TenantMembershipFields & {
  userId: string;
  tenantId: string;
  roleId: string;
};

export type UpdateTenantMembershipInput = Partial<TenantMembershipFields>;

export type TenantMembershipListFilters = {
  tenantId?: string;
  userId?: string;
  roleId?: string;
  branchId?: string;
  status?: TenantMembershipStatus;
};

export type TenantMembershipListResponse = {
  memberships: TenantMembership[];
};

export type TenantMembershipResponse = {
  message?: string;
  membership: TenantMembership;
};

export type TenantMembershipRolesResponse = {
  roles: TenantMembershipRole[];
};

export async function listTenantMembershipRoles() {
  return apiFetch<TenantMembershipRolesResponse>(
    `${TENANT_MEMBERSHIPS_ENDPOINT}/roles`,
  );
}

export async function listTenantMemberships(
  filters: TenantMembershipListFilters = {},
) {
  const query = new URLSearchParams();
  if (filters.tenantId) query.set("tenantId", filters.tenantId);
  if (filters.userId) query.set("userId", filters.userId);
  if (filters.roleId) query.set("roleId", filters.roleId);
  if (filters.branchId) query.set("branchId", filters.branchId);
  if (filters.status) query.set("status", filters.status);

  const queryString = query.toString();
  return apiFetch<TenantMembershipListResponse>(
    `${TENANT_MEMBERSHIPS_ENDPOINT}${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getTenantMembership(id: string) {
  return apiFetch<TenantMembershipResponse>(
    `${TENANT_MEMBERSHIPS_ENDPOINT}/${encodeURIComponent(id)}`,
  );
}

export async function createTenantMembership(
  input: CreateTenantMembershipInput,
) {
  return apiFetch<TenantMembershipResponse>(TENANT_MEMBERSHIPS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateTenantMembership(
  id: string,
  input: UpdateTenantMembershipInput,
) {
  return apiFetch<TenantMembershipResponse>(
    `${TENANT_MEMBERSHIPS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteTenantMembership(id: string) {
  return apiFetch<TenantMembershipResponse>(
    `${TENANT_MEMBERSHIPS_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
