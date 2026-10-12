"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  Users,
  X,
} from "lucide-react";
import { Sidebar, type NavGroupDef } from "@/components/layout/Sidebar";
import { Modal, ModalBody } from "@/components/ui/Modal";
import { logoutUser } from "@/services/auth/auth.service";
import styles from "./layout.module.css";

const navGroups: NavGroupDef[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/super_admin",
      },
      {
        label: "Schools & tenants",
        icon: Building2,
        href: "/super_admin/tenants",
      },
      {
        label: "Memberships",
        icon: Users,
        href: "/super_admin/tenant_membership",
      },
    ],
  },
];

const sectionByPath: Record<string, string> = {
  "/super_admin": "Overview",
  "/super_admin/tenants": "Schools & tenants",
  "/super_admin/tenant_membership": "Memberships",
};

export default function SuperAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notification, setNotification] = React.useState("");
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState(false);
  const activeSection = pathname.startsWith("/super_admin/tenants")
    ? "Schools & tenants"
    : (sectionByPath[pathname] ?? "Overview");

  React.useEffect(() => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      setSidebarOpen(false);
    }
  }, []);

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSectionSelect = () => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError(false);
    try {
      await logoutUser();
    } catch (error) {
      setLogoutError(true);
      setNotification(
        error instanceof Error
          ? `Signed out locally, but server logout failed: ${error.message}`
          : "Signed out locally, but server logout failed.",
      );
      window.setTimeout(() => router.replace("/auth/login"), 1800);
      return;
    }

    router.replace("/auth/login");
  };

  return (
    <div className={`app ${isDark ? "dark" : ""} ${styles.shell}`}>
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeSection}
        onSelectItem={handleSectionSelect}
        currentSchool="Xenon Platform"
        schools={[{ id: "platform", name: "Xenon Platform" }]}
        navGroups={navGroups}
      />
      <section className="workspace">
        <header className={styles.navbar}>
          <div className={styles.navbarStart}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <span>Workspace</span>
              <i>/</i>
              <strong>{activeSection}</strong>
            </nav>
          </div>
          <div className={styles.navbarActions}>
            <button
              type="button"
              className={styles.searchBox}
              onClick={() => setSearchOpen(true)}
              aria-label="Search or navigate"
            >
              <Search size={16} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setIsDark((dark) => !dark)}
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              title={`Switch to ${isDark ? "light" : "dark"} theme`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.notificationButton}`}
              onClick={() => {
                setNotification("You are all caught up.");
                window.setTimeout(() => setNotification(""), 2800);
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <i />
            </button>
            <span className={styles.navbarDivider} />
            <button
              type="button"
              className={styles.logoutButton}
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              aria-label={loggingOut ? "Signing out" : "Log out"}
              title={loggingOut ? "Signing out…" : "Log out"}
            >
              {loggingOut ? (
                <span className={styles.logoutSpinner} aria-hidden="true" />
              ) : (
                <LogOut size={16} />
              )}
              <span>{loggingOut ? "Signing out…" : "Log out"}</span>
            </button>
            <button type="button" className={styles.userMenu}>
              <span className={styles.userAvatar}>AA</span>
              <span className={styles.userCopy}>
                <strong>Abdurezak Akmel</strong>
                <small>Super admin</small>
              </span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <div className={styles.pageBody}>{children}</div>
      </section>

      <Modal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Quick navigation"
        description="Go to a super-admin workspace."
      >
        <ModalBody className="p-2">
          <Link
            className={styles.searchResult}
            href="/super_admin/tenants"
            onClick={() => setSearchOpen(false)}
          >
            <Building2 size={17} /> Schools &amp; tenants
          </Link>
          <Link
            className={styles.searchResult}
            href="/super_admin/tenant_membership"
            onClick={() => setSearchOpen(false)}
          >
            <Users size={17} /> Memberships
          </Link>
          <Link
            className={styles.searchResult}
            href="/super_admin"
            onClick={() => setSearchOpen(false)}
          >
            <LayoutDashboard size={17} /> Overview
          </Link>
        </ModalBody>
      </Modal>
      {notification && (
        <div
          className={`toast ${logoutError ? styles.logoutError : ""}`}
          role={logoutError ? "alert" : "status"}
        >
          {notification}
          <button
            type="button"
            onClick={() => setNotification("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
