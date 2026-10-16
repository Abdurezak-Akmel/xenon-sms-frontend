import { apiFetch } from "../../lib/api";
import type { UserResponse } from "./user.service";

const MFA_ENDPOINT = "/auth/mfa";

export type MfaSetupResponse = {
  message: string;
};

export function beginMfaSetup() {
  return apiFetch<MfaSetupResponse>(`${MFA_ENDPOINT}/setup`, {
    method: "POST",
  });
}

export function beginMfaDisable() {
  return apiFetch<{ message: string }>(`${MFA_ENDPOINT}/disable/setup`, {
    method: "POST",
  });
}

export function enableMfa(code: string) {
  return apiFetch<UserResponse>(`${MFA_ENDPOINT}/enable`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function disableMfa(code: string) {
  return apiFetch<UserResponse>(`${MFA_ENDPOINT}/disable`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
