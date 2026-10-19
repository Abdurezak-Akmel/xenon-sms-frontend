const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type RequestOptions = RequestInit & {
  auth?: boolean;
  responseType?: "blob";
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

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = true, headers, responseType, ...rest } = options;
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
    const { refreshAuthToken } = await import(
      "../services/auth/auth.service"
    );
    const refreshed = await refreshAuthToken();
    token = refreshed.accessToken;
    res = await sendRequest(token);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload =
    responseType === "blob" && res.ok
      ? await res.blob()
      : contentType.includes("application/json")
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
