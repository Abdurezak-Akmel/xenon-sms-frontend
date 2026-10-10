import { apiFetch } from "../../lib/api";

const USER_SESSIONS_ENDPOINT = "/user-sessions";

export type UserSession = {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
};

export type UserSessionsResponse = {
  sessions: UserSession[];
};

export type UserSessionResponse = {
  message: string;
  session: UserSession;
};

export type RevokeAllUserSessionsResponse = {
  message: string;
  revokedCount: number;
};

export async function listUserSessions() {
  return apiFetch<UserSessionsResponse>(USER_SESSIONS_ENDPOINT);
}

export async function getUserSession(sessionId: string) {
  return apiFetch<{ session: UserSession }>(
    `${USER_SESSIONS_ENDPOINT}/${encodeURIComponent(sessionId)}`,
  );
}

export async function revokeUserSession(sessionId: string) {
  return apiFetch<UserSessionResponse>(
    `${USER_SESSIONS_ENDPOINT}/${encodeURIComponent(sessionId)}`,
    { method: "DELETE" },
  );
}

export async function revokeAllUserSessions() {
  return apiFetch<RevokeAllUserSessionsResponse>(
    `${USER_SESSIONS_ENDPOINT}/revoke-all`,
    { method: "POST" },
  );
}