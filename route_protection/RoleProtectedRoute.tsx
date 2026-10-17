"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { refreshAuthToken } from "../services/auth/auth.service";

import {
  getRoleHomePath,
  isPublicPath,
  normalizeRole,
  requiredRoleForPath,
} from "./roleRules";

type TokenClaims = {
  exp?: unknown;
  role?: unknown;
  roleCode?: unknown;
};

function decodeToken(token: string): TokenClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    const decoded = new TextDecoder().decode(bytes);
    const claims: unknown = JSON.parse(decoded);
    if (typeof claims !== "object" || claims === null) return null;
    return claims as TokenClaims;
  } catch {
    return null;
  }
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorizedPath, setAuthorizedPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (isPublicPath(pathname)) {
      setAuthorizedPath(pathname);
      return () => {
        active = false;
      };
    }

    const authorize = (token: string | null) => {
      const claims = token ? decodeToken(token) : null;
      const expiry =
        typeof claims?.exp === "number" ? claims.exp * 1000 : Number.NaN;
      if (!token || !claims || !Number.isFinite(expiry) || expiry <= Date.now()) {
        router.replace("/auth/login");
        return;
      }

      const roleClaim =
        typeof claims.roleCode === "string"
          ? claims.roleCode
          : typeof claims.role === "string"
            ? claims.role
            : null;
      const currentRole = roleClaim ? normalizeRole(roleClaim) : null;
      const requiredRole = requiredRoleForPath(pathname);
      if (!requiredRole || currentRole !== requiredRole) {
        router.replace(
          currentRole ? (getRoleHomePath(currentRole) ?? "/") : "/auth/login",
        );
        return;
      }

      setAuthorizedPath(pathname);
    };

    const token = window.localStorage.getItem("token");
    const claims = token ? decodeToken(token) : null;
    const expiry =
      typeof claims?.exp === "number" ? claims.exp * 1000 : Number.NaN;
    if (
      (!token || !Number.isFinite(expiry) || expiry <= Date.now()) &&
      window.localStorage.getItem("refreshToken")
    ) {
      void refreshAuthToken()
        .then(({ accessToken }) => {
          if (active) authorize(accessToken);
        })
        .catch(() => {
          if (active) router.replace("/auth/login");
        });
    } else {
      authorize(token);
    }

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (authorizedPath !== pathname) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm text-(--muted)"
        role="status"
        aria-live="polite"
      >
        Checking access…
      </div>
    );
  }

  return children;
}
