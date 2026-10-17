"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  CircleUserRound,
  LayoutDashboard,
  LogOut,
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

import { logoutUser } from "@/services/auth/auth.service";
import { getCurrentUser } from "@/services/auth/user.service";

import styles from "./layout.module.css";

const navGroups: NavGroupDef[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/branch_admin",
      },
      {
        label: "Memberships",
        icon: Users,
        href: "/branch_admin/memberships",
      },
      {
        label: "Profile",
        icon: CircleUserRound,
        href: "/branch_admin/profile",
      },
    ],
  },
];

const sectionByPath: Record<string, string> = {
  "/branch_admin": "Dashboard",
  "/branch_admin/memberships": "Memberships",
  "/branch_admin/profile": "Profile",
};

const quickNavigationItems: QuickNavigationItem[] = [
  {
    href: "/branch_admin/memberships",
    label: "Memberships",
    icon: Users,
  },
  {
    href: "/branch_admin/profile",
    label: "Profile",
    icon: CircleUserRound,
  },
  {
    href: "/branch_admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
];

export default function BranchAdminLayout({
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
  const [userName, setUserName] = React.useState("Branch admin");
  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const activeSection = pathname.startsWith("/branch_admin/memberships")
    ? "Memberships"
    : pathname.startsWith("/branch_admin/profile")
      ? "Profile"
      : (sectionByPath[pathname] ?? "Dashboard");

  React.useEffect(() => {
    let active = true;
    getCurrentUser()
      .then(({ user }) => {
        if (!active) return;
        const fullName = [user.firstName, user.middleName, user.lastName]
          .filter(Boolean)
          .join(" ");
        setUserName(fullName || "Branch admin");
      })
      .catch((error: unknown) => {
        console.error(
          "Unable to load the signed-in branch administrator:",
          error,
        );
      });

    return () => {
      active = false;
    };
  }, []);

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
      onClick: () => router.push("/branch_admin/profile"),
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
        currentSchool="My branch"
        schools={[{ id: "branch", name: "My branch" }]}
        navGroups={navGroups}
      />

      <section className="workspace">
        <NavBar
          className={styles.navbar}
          breadcrumbs={[{ label: "Workspace" }, { label: activeSection }]}
          user={{
            name: userName,
            role: "Branch admin",
            initials: userInitials || "BA",
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
        description="Go to a branch administration page."
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
