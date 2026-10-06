import { apiFetch } from "../lib/api";

const BRANCHES_ENDPOINT = "/branches";

export type BranchStatus = "active" | "inactive" | "archived";

export type Branch = {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  timezone: string | null;
  status: BranchStatus;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateBranchInput = {
  tenantId: string;
  code: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  timezone?: string | null;
  status?: BranchStatus;
  settings?: Record<string, unknown>;
};

export type UpdateBranchInput = Partial<CreateBranchInput>;

export type BranchListFilters = {
  tenantId?: string;
  status?: BranchStatus;
  code?: string;
};

export type BranchListResponse = {
  branches: Branch[];
};

export type BranchResponse = {
  message?: string;
  branch: Branch;
};

export async function listBranches(filters: BranchListFilters = {}) {
  const query = new URLSearchParams();
  if (filters.tenantId) query.set("tenantId", filters.tenantId);
  if (filters.status) query.set("status", filters.status);
  if (filters.code) query.set("code", filters.code);

  const queryString = query.toString();
  return apiFetch<BranchListResponse>(
    `${BRANCHES_ENDPOINT}${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getBranch(id: string) {
  return apiFetch<BranchResponse>(
    `${BRANCHES_ENDPOINT}/${encodeURIComponent(id)}`,
  );
}

export async function createBranch(input: CreateBranchInput) {
  return apiFetch<BranchResponse>(BRANCHES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateBranch(id: string, input: UpdateBranchInput) {
  return apiFetch<BranchResponse>(
    `${BRANCHES_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteBranch(id: string) {
  return apiFetch<BranchResponse>(
    `${BRANCHES_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}