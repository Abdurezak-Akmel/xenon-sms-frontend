const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshInFlight: Promise<RefreshTokenResponse> | null = null;

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  if (typeof window === "undefined") {
    throw new ApiError(
      "A browser session is required to refresh the token.",
      401,
    );
  }

  if (refreshInFlight) return refreshInFlight;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new ApiError("Refresh token is required.", 401);
  }

  refreshInFlight = (async () => {
    const membershipId = localStorage.getItem("activeMembershipId");
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken,
        ...(membershipId ? { membershipId } : {}),
      }),
    });

    const contentType = res.headers.get("content-type") ?? "";
    const payload: unknown = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const errorPayload =
        typeof payload === "object" && payload !== null
          ? (payload as { message?: unknown })
          : null;

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("activeMembershipId");
      }

      throw new ApiError(
        typeof errorPayload?.message === "string"
          ? errorPayload.message
          : "Unable to refresh access token.",
        res.status,
      );
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("accessToken" in payload) ||
      typeof payload.accessToken !== "string"
    ) {
      throw new ApiError(
        "Refresh response did not include an access token.",
        500,
      );
    }

    const refreshed = payload as RefreshTokenResponse;
    localStorage.setItem("token", refreshed.accessToken);
    if (refreshed.refreshToken) {
      localStorage.setItem("refreshToken", refreshed.refreshToken);
    }
    return refreshed;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const isFormData =
    typeof FormData !== "undefined" && rest.body instanceof FormData;

  const sendRequest = (token: string | null) => {
    const requestHeaders = new Headers(headers);
    if (!isFormData && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    if (auth && token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE}${endpoint}`, {
      ...rest,
      headers: requestHeaders,
    });
  };

  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let res = await sendRequest(token);
  const isRefreshRequest = endpoint === "/auth/refresh-token";

  if (
    auth &&
    res.status === 401 &&
    !isRefreshRequest &&
    typeof window !== "undefined" &&
    localStorage.getItem("refreshToken")
  ) {
    const refreshed = await refreshAccessToken();
    token = refreshed.accessToken;
    res = await sendRequest(token);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const errorPayload =
      typeof payload === "object" && payload !== null
        ? (payload as { message?: unknown; code?: unknown })
        : null;
    throw new ApiError(
      typeof errorPayload?.message === "string"
        ? errorPayload.message
        : "Request failed",
      res.status,
      typeof errorPayload?.code === "string" ? errorPayload.code : undefined,
    );
  }

  return payload as T;
}
