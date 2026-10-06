import { apiFetch } from "../lib/api";

const TENANTS_ENDPOINT = "/tenants";

export type TenantStatus =
  | "pending"
  | "active"
  | "suspended"
  | "closed"
  | "archived";

export type Tenant = {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  countryCode: string | null;
  timezone: string;
  currencyCode: string;
  status: TenantStatus;
  settings: Record<string, unknown>;
  retentionPolicy: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateTenantInput = {
  code: string;
  legalName: string;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  countryCode?: string | null;
  timezone?: string;
  currencyCode?: string;
  status?: TenantStatus;
  settings?: Record<string, unknown>;
  retentionPolicy?: Record<string, unknown>;
};

export type UpdateTenantInput = Partial<CreateTenantInput>;

export type TenantListFilters = {
  status?: TenantStatus;
  code?: string;
};

export type TenantListResponse = {
  tenants: Tenant[];
};

export type TenantResponse = {
  message?: string;
  tenant: Tenant;
};

export async function listTenants(filters: TenantListFilters = {}) {
  const query = new URLSearchParams();
  if (filters.status) query.set("status", filters.status);
  if (filters.code) query.set("code", filters.code);

  const queryString = query.toString();
  return apiFetch<TenantListResponse>(
    `${TENANTS_ENDPOINT}${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getTenant(id: string) {
  return apiFetch<TenantResponse>(
    `${TENANTS_ENDPOINT}/${encodeURIComponent(id)}`,
  );
}

export async function createTenant(input: CreateTenantInput) {
  return apiFetch<TenantResponse>(TENANTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateTenant(id: string, input: UpdateTenantInput) {
  return apiFetch<TenantResponse>(
    `${TENANTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteTenant(id: string) {
  return apiFetch<TenantResponse>(
    `${TENANTS_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
