"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Clock3,
  Globe2,
  MonitorSmartphone,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

// Components from UI
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Footer } from "@/components/ui/footer";

// Components from tenants page
import { TenantPageHeader } from "@/components/tenants/TenantPageHeader";
import {
  TenantStatsCards,
  type TenantStat,
} from "@/components/tenants/TenantStatsCards";

// User_session's Service Functions
import {
  deleteAllRevokedUserSessions,
  deleteRevokedUserSession,
  listUserSessions,
  revokeAllUserSessions,
  revokeUserSession,
  type UserSession,
} from "@/services/auth/user_sessions.service";

// Stylesheet
import styles from "./page.module.css";

type SessionFilter = "all" | "active" | "expired" | "revoked";
type ConfirmTarget =
  | { type: "revoke"; session: UserSession }
  | { type: "revokeAll" }
  | { type: "delete"; session: UserSession }
  | { type: "deleteAll" }
  | null;

function sessionStatus(session: UserSession, now: number) {
  if (session.revokedAt) return "revoked";
  const expiresAt = Date.parse(session.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt <= now ? "expired" : "active";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function sessionDevice(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|android/i.test(userAgent)) return "Mobile device";
  if (/windows|macintosh|linux/i.test(userAgent)) return "Desktop";
  return "Device";
}

export default function UserSessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SessionFilter>("all");
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const now = Date.now();

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await listUserSessions();
      setSessions(response.sessions);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load sessions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const activeSessions = sessions.filter(
    (session) => sessionStatus(session, now) === "active",
  );
  const expiredSessions = sessions.filter(
    (session) => sessionStatus(session, now) === "expired",
  );
  const revokedSessions = sessions.filter(
    (session) => sessionStatus(session, now) === "revoked",
  );
  const filteredSessions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sessions
      .filter((session) => {
        const status = sessionStatus(session, now);
        const matchesFilter = filter === "all" || status === filter;
        const matchesQuery =
          !normalizedQuery ||
          [
            session.ipAddress ?? "",
            session.userAgent ?? "",
            session.id,
            session.userId,
          ].some((value) => value.toLowerCase().includes(normalizedQuery));
        return matchesFilter && matchesQuery;
      })
      .sort(
        (first, second) =>
          Date.parse(second.createdAt) - Date.parse(first.createdAt),
      );
  }, [filter, now, query, sessions]);

  const sessionStats: TenantStat[] = [
    {
      label: "Total sessions",
      value: sessions.length,
      helper: "Across all users",
      tone: "blue",
      icon: MonitorSmartphone,
    },
    {
      label: "Active now",
      value: activeSessions.length,
      helper: "Currently signed in",
      tone: "green",
      icon: CheckCircle2,
    },
    {
      label: "Expired",
      value: expiredSessions.length,
      helper: "No longer valid",
      tone: "orange",
      icon: Clock3,
    },
    {
      label: "Revoked",
      value: revokedSessions.length,
      helper: "Access removed",
      tone: "red",
      icon: Ban,
    },
  ];

  async function confirmSessionAction() {
    if (!confirmTarget) return;
    setActionBusy(true);
    setActionError(null);
    try {
      if (confirmTarget.type === "revoke") {
        const { session } = await revokeUserSession(confirmTarget.session.id);
        setSessions((current) =>
          current.map((item) => (item.id === session.id ? session : item)),
        );
        setNotice("Session revoked.");
      } else if (confirmTarget.type === "revokeAll") {
        const response = await revokeAllUserSessions();
        const revokedAt = new Date().toISOString();
        setSessions((current) =>
          current.map((session) =>
            sessionStatus(session, Date.now()) === "active"
              ? { ...session, revokedAt }
              : session,
          ),
        );
        setNotice(
          `${response.revokedCount} active session${response.revokedCount === 1 ? "" : "s"} revoked.`,
        );
      } else if (confirmTarget.type === "delete") {
        const response = await deleteRevokedUserSession(
          confirmTarget.session.id,
        );
        setSessions((current) =>
          current.filter((session) => session.id !== confirmTarget.session.id),
        );
        setNotice(response.message);
      } else {
        const response = await deleteAllRevokedUserSessions();
        setSessions((current) =>
          current.filter((session) => !session.revokedAt),
        );
        setNotice(
          `${response.deletedCount} revoked session${response.deletedCount === 1 ? "" : "s"} permanently deleted.`,
        );
      }
      setConfirmTarget(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to update sessions.",
      );
    } finally {
      setActionBusy(false);
    }
  }

  const isDeleteAction =
    confirmTarget?.type === "delete" || confirmTarget?.type === "deleteAll";
  const confirmDescription =
    confirmTarget?.type === "revokeAll"
      ? "All active sessions across all user accounts will be revoked. Users may need to sign in again on their devices."
      : confirmTarget?.type === "deleteAll"
        ? "All revoked sessions across all user accounts will be permanently deleted. This cannot be undone."
        : confirmTarget?.type === "delete"
          ? "This revoked session will be permanently deleted. This cannot be undone."
          : "This session will be revoked. The device using it may need to sign in again.";

  return (
    <main className={styles.sessionPage}>
      <div className="content">
        <TenantPageHeader
          styles={styles}
          icon={ShieldCheck}
          eyebrow="Platform administration / Security"
          title="User sessions"
          subtitle="Review signed-in devices across all user accounts and revoke sessions you no longer recognize."
          action={
            <div className={styles.headerActions}>
              <Button
                type="button"
                variant="outline"
                className={styles.refreshButton}
                onClick={() => void loadSessions()}
                disabled={loading || actionBusy}
              >
                <RefreshCw className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>
              <Button
                type="button"
                variant="destructive"
                className={styles.revokeAllButton}
                onClick={() => setConfirmTarget({ type: "revokeAll" })}
                disabled={activeSessions.length === 0 || actionBusy}
              >
                <Ban />
                Revoke all
              </Button>
            </div>
          }
          details={
            <p className={styles.headerNote}>
              <CheckCircle2 size={14} />
              Platform-wide sessions can be revoked at any time.
            </p>
          }
        />

        <TenantStatsCards
          stats={sessionStats}
          loading={loading}
          className={styles.metricsGrid}
          ariaLabel="User session summary"
        />

        {(loadError || actionError || notice) && (
          <div
            role={loadError || actionError ? "alert" : "status"}
            className={
              loadError || actionError
                ? styles.errorNotice
                : styles.successNotice
            }
          >
            <span>{loadError ?? actionError ?? notice}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setLoadError(null);
                setActionError(null);
                setNotice(null);
              }}
              aria-label="Dismiss message"
            >
              <X />
            </Button>
          </div>
        )}

        <section className={`panel ${styles.sessionsPanel}`}>
          <div className="panel-heading">
            <div>
              <h2>
                Signed-in devices
                <span className={styles.directoryCount}>
                  {loading ? "…" : sessions.length}
                </span>
              </h2>
              <p>Session details for devices accessing any user account.</p>
            </div>
            <span>
              {filteredSessions.length} of {sessions.length} shown
            </span>
          </div>

          {revokedSessions.length > 0 && (
            <div className={styles.bulkActions}>
              <span>
                {revokedSessions.length} revoked session
                {revokedSessions.length === 1 ? "" : "s"} can be permanently
                deleted.
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={actionBusy || loading}
                onClick={() => setConfirmTarget({ type: "deleteAll" })}
              >
                <Trash2 />
                Delete all revoked
              </Button>
            </div>
          )}

          <div className={styles.filters}>
            <label className={styles.searchControl}>
              <Search size={16} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search IP, device, or session ID"
                aria-label="Search sessions"
              />
            </label>
            <label className={styles.filterControl}>
              <span className="sr-only">Filter sessions by status</span>
              <select
                id="session-status-filter"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as SessionFilter)
                }
                aria-label="Filter sessions by status"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </label>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device / browser</TableHead>
                <TableHead>IP address</TableHead>
                <TableHead>Signed in</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableEmpty
                  colSpan={6}
                  title="Loading sessions"
                  description="Fetching devices signed in across all user accounts."
                />
              ) : loadError ? (
                <TableEmpty
                  colSpan={6}
                  title="Sessions could not be loaded"
                  description="Refresh the page or try again in a moment."
                />
              ) : filteredSessions.length === 0 ? (
                <TableEmpty
                  colSpan={6}
                  title={
                    sessions.length
                      ? "No matching sessions"
                      : "No sessions found"
                  }
                  description={
                    sessions.length
                      ? "Try changing your search or status filter."
                      : "There are no sessions associated with any user account."
                  }
                />
              ) : (
                filteredSessions.map((session) => {
                  const status = sessionStatus(session, now);
                  const canRevoke = status === "active" && !actionBusy;
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="min-w-56">
                        <div className="flex items-start gap-2.5">
                          <MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-(--muted)" />
                          <div className="min-w-0">
                            <p className="font-semibold text-(--foreground)">
                              {sessionDevice(session.userAgent)}
                            </p>
                            <p
                              className="mt-1 max-w-sm break-all text-[11px] leading-4 text-(--muted)"
                              title={
                                session.userAgent ??
                                "Device details unavailable"
                              }
                            >
                              {session.userAgent ??
                                "Device details unavailable"}
                            </p>
                            <p className="mt-1 max-w-48 truncate font-mono text-[10px] text-(--muted)">
                              User ID: {session.userId}
                            </p>
                            <p
                              className="mt-1 max-w-48 truncate font-mono text-[10px] text-(--muted)"
                              title={session.id}
                            >
                              ID: {session.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Globe2 className="size-3.5 text-(--muted)" />
                          {session.ipAddress ?? "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(session.createdAt)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(session.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                            status === "active"
                              ? "bg-(--green)/10 text-(--green)"
                              : status === "revoked"
                                ? "bg-(--red)/10 text-(--red)"
                                : "bg-(--background) text-(--muted)"
                          }`}
                        >
                          {status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {status === "active" ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={!canRevoke}
                            onClick={() =>
                              setConfirmTarget({ type: "revoke", session })
                            }
                          >
                            Revoke
                          </Button>
                        ) : status === "revoked" ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={actionBusy}
                            onClick={() =>
                              setConfirmTarget({ type: "delete", session })
                            }
                          >
                            <Trash2 />
                            Delete
                          </Button>
                        ) : (
                          <span className="text-xs text-(--muted)">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </section>
        <Footer year={2026} />
      </div>

      <ConfirmModal
        isOpen={confirmTarget !== null}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => void confirmSessionAction()}
        title={
          confirmTarget?.type === "revokeAll"
            ? "Revoke all active sessions?"
            : confirmTarget?.type === "deleteAll"
              ? "Delete all revoked sessions?"
              : confirmTarget?.type === "delete"
                ? "Permanently delete this revoked session?"
                : "Revoke this session?"
        }
        description={confirmDescription}
        confirmText={
          confirmTarget?.type === "revokeAll"
            ? "Revoke all"
            : isDeleteAction
              ? "Delete permanently"
              : "Revoke session"
        }
        isLoading={actionBusy}
      />

      <span className="sr-only" aria-live="polite">
        {sessions.length} sessions loaded, {activeSessions.length} active and{" "}
        {revokedSessions.length} revoked.
      </span>
    </main>
  );
}
