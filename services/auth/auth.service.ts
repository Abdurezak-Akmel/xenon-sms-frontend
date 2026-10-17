import { ApiError, apiFetch } from "../../lib/api";

const AUTH_ENDPOINT = "/auth";

export type RegisterInput = {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
  mfaCode?: string;
};

export type EmailAuthInput = {
  email: string;
};

export type ForgotPasswordInput = EmailAuthInput;
export type ResendVerificationInput = EmailAuthInput;

export type ResetPasswordInput = {
  email: string;
  token: string;
  newPassword: string;
};

export type AuthUser = {
  id: string;
  globalRoleId: string | null;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string | null;
  avatarUrl?: string | null;
  status?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  mfaEnabled?: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthMessageResponse = {
  message: string;
};

export type AuthUserResponse = AuthMessageResponse & {
  user: AuthUser;
};

export type LoginResponse = AuthUserResponse & {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = AuthMessageResponse & {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

let refreshInFlight: Promise<RefreshTokenResponse> | null = null;

export type TenantMembershipSelectionResponse = AuthMessageResponse & {
  accessToken: string;
};

export type TenantMembershipChoice = {
  id: string;
  tenantId: string;
  branchId: string | null;
  status: string;
  joinedAt: string | null;
  roleCode: string;
  roleName: string;
  roleDescription: string | null;
  roleScope: "platform" | "tenant" | "branch" | "self" | "linked";
};

// Function to save access and refresh tokens in local storage
const saveTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Register user service
export async function registerUser(input: RegisterInput) {
  return apiFetch<AuthUserResponse>(`${AUTH_ENDPOINT}/register`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

// Login user service
export async function loginUser(input: LoginInput) {
  const response = await apiFetch<LoginResponse>(`${AUTH_ENDPOINT}/login`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });

  if (typeof window !== "undefined") {
    localStorage.removeItem("activeMembershipId");
  }
  saveTokens(response.accessToken, response.refreshToken);
  return response;
}

export async function selectTenantMembership(membershipId: string) {
  const response = await apiFetch<TenantMembershipSelectionResponse>(
    `${AUTH_ENDPOINT}/select-tenant-membership`,
    {
      method: "POST",
      body: JSON.stringify({ membershipId }),
    },
  );

  if (typeof window !== "undefined") {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("activeMembershipId", membershipId);
  }
  return response;
}

export async function listTenantMembershipChoices() {
  return apiFetch<{ memberships: TenantMembershipChoice[] }>(
    `${AUTH_ENDPOINT}/tenant-membership-choices`,
  );
}

export async function verifyEmail(token: string) {
  const query = new URLSearchParams({ token });
  return apiFetch<string>(`${AUTH_ENDPOINT}/verify-email?${query}`, {
    method: "GET",
    auth: false,
  });
}

export async function resendVerificationEmail(input: ResendVerificationInput) {
  return apiFetch<AuthMessageResponse>(`${AUTH_ENDPOINT}/resend-verification`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

export async function forgotPassword(input: ForgotPasswordInput) {
  return apiFetch<AuthMessageResponse>(`${AUTH_ENDPOINT}/forgot-password`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

export async function resetPassword(input: ResetPasswordInput) {
  return apiFetch<AuthUserResponse>(`${AUTH_ENDPOINT}/reset-password`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

export async function refreshAuthToken(
  refreshToken?: string,
): Promise<RefreshTokenResponse> {
  if (refreshInFlight) return refreshInFlight;

  const storedRefreshToken =
    refreshToken ??
    (typeof window !== "undefined"
      ? (localStorage.getItem("refreshToken") ?? undefined)
      : undefined);

  if (!storedRefreshToken) {
    throw new Error("Refresh token is required.");
  }

  refreshInFlight = (async () => {
    const activeMembershipId =
      typeof window !== "undefined"
        ? localStorage.getItem("activeMembershipId")
        : null;
    try {
      const response = await apiFetch<RefreshTokenResponse>(
        `${AUTH_ENDPOINT}/refresh-token`,
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({
            refreshToken: storedRefreshToken,
            ...(activeMembershipId ? { membershipId: activeMembershipId } : {}),
          }),
        },
      );

      if (
        typeof response !== "object" ||
        response === null ||
        typeof response.accessToken !== "string"
      ) {
        throw new ApiError(
          "Refresh response did not include an access token.",
          500,
        );
      }

      saveTokens(response.accessToken, response.refreshToken);
      return response;
    } catch (error) {
      if (
        typeof window !== "undefined" &&
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("activeMembershipId");
      }
      throw error;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export async function logoutUser() {
  try {
    return await apiFetch<AuthMessageResponse>(`${AUTH_ENDPOINT}/logout`, {
      method: "POST",
      body: JSON.stringify({
        refreshToken:
          typeof window === "undefined"
            ? undefined
            : localStorage.getItem("refreshToken"),
      }),
    });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("activeMembershipId");
    }
  }
}
