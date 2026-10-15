"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Building2,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  Users,
  X,
} from "lucide-react";

import { NavBar, type ProfileMenuItem } from "@/components/layout/NavBar";

import {
  QuickNavigationModal,
  type QuickNavigationItem,
} from "@/components/layout/QuickNavigationModal";

import { Sidebar, type NavGroupDef } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";

// Service Functions
import { logoutUser } from "@/services/auth/auth.service";

import styles from "./layout.module.css";

const navGroups: NavGroupDef[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/super_admin",
      },
      {
        label: "Schools",
        icon: Building2,
        href: "/super_admin/tenants",
      },
      {
        label: "Memberships",
        icon: Users,
        href: "/super_admin/tenant_membership",
      },
      {
        label: "User sessions",
        icon: MonitorSmartphone,
        href: "/super_admin/user_sessions",
      },
      {
        label: "Profile",
        icon: CircleUserRound,
        href: "/super_admin/profile",
      },
    ],
  },
];

const sectionByPath: Record<string, string> = {
  "/super_admin": "Dashboard",
  "/super_admin/tenants": "Schools",
  "/super_admin/tenant_membership": "Memberships",
  "/super_admin/user_sessions": "User sessions",
  "/super_admin/profile": "Profile",
};

const quickNavigationItems: QuickNavigationItem[] = [
  {
    href: "/super_admin/tenants",
    label: "Schools & tenants",
    icon: Building2,
  },
  {
    href: "/super_admin/tenant_membership",
    label: "Memberships",
    icon: Users,
  },
  {
    href: "/super_admin/user_sessions",
    label: "User sessions",
    icon: MonitorSmartphone,
  },
  {
    href: "/super_admin/profile",
    label: "Profile",
    icon: CircleUserRound,
  },
  {
    href: "/super_admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
];

export default function SuperAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false);
  const [themeInitialized, setThemeInitialized] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notification, setNotification] = React.useState("");
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState(false);
  const activeSection = pathname.startsWith("/super_admin/tenants")
    ? "Schools"
    : (sectionByPath[pathname] ?? "Dashboard");

  React.useEffect(() => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      setSidebarOpen(false);
    }
  }, []);

  React.useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("xenon_theme");
    } catch (error) {
      console.error("Unable to read the saved theme preference:", error);
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
    setThemeInitialized(true);
  }, []);

  React.useEffect(() => {
    if (!themeInitialized) return;

    const theme = isDark ? "dark" : "light";
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem("xenon_theme", theme);
    } catch (error) {
      console.error("Unable to persist the selected theme:", error);
    }
  }, [isDark, themeInitialized]);

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

  const profileMenuItems: ProfileMenuItem[] = [
    {
      label: "Profile",
      icon: CircleUserRound,
      onClick: () => router.push("/super_admin/profile"),
    },
    {
      label: "Sign Out",
      icon: LogOut,
      onClick: () => void handleLogout(),
      destructive: true,
    },
  ];

  return (
    <div
      className={`app ${isDark ? "dark" : ""} ${styles.shell} ${sidebarOpen ? "" : styles.sidebarCollapsed}`}
    >
      <Sidebar
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen((open) => !open)}
        activeItem={activeSection}
        onSelectItem={handleSectionSelect}
        currentSchool="Xenon"
        schools={[{ id: "platform", name: "Xenon Platform" }]}
        navGroups={navGroups}
      />

      <section className="workspace">
        <NavBar
          className={styles.navbar}
          breadcrumbs={[{ label: "Workspace" }, { label: activeSection }]}
          user={{
            name: "Abdurezak Akmel",
            role: "Super admin",
            initials: "AA",
          }}
          isDark={isDark}
          onThemeToggle={() => setIsDark((dark) => !dark)}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
          search={{
            placeholder: "Search anything...",
            shortcut: "⌘ K",
            onClick: () => setSearchOpen(true),
          }}
          notifications={{
            hasUnread: true,
            onClick: () => {
              setNotification("You are all caught up.");
              window.setTimeout(() => setNotification(""), 2800);
            },
          }}
          profileMenuItems={profileMenuItems}
          extraActions={
            <Button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              aria-label={loggingOut ? "Signing out" : "Log out"}
              title={loggingOut ? "Signing out…" : "Log out"}
              variant="destructive"
              size="lg"
              className="gap-2 border border-(--red)/20 px-3 text-xs font-semibold disabled:cursor-wait"
            >
              {loggingOut ? (
                <span
                  className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              ) : (
                <LogOut className="size-4" />
              )}
              <span className="hidden sm:inline">
                {loggingOut ? "Signing out…" : "Log out"}
              </span>
            </Button>
          }
        />
        <div className={styles.pageBody}>{children}</div>
      </section>

      <QuickNavigationModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Quick navigation"
        description="Go to a super-admin workspace."
        items={quickNavigationItems}
      />
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
