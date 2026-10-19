"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  CircleUserRound,
  Files,
  LayoutDashboard,
  LogOut,
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

import {
  getAuthenticatedTenantId,
  getCurrentUser,
} from "@/services/auth/user.service";

import { getTenant } from "@/services/tenancy/tenant.service";

import styles from "./layout.module.css";

const navGroups: NavGroupDef[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/librarian",
      },
      {
        label: "Resources",
        icon: Files,
        href: "/librarian/resources",
      },
      {
        label: "Profile",
        icon: CircleUserRound,
        href: "/librarian/profile",
      },
    ],
  },
];

const sectionByPath: Record<string, string> = {
  "/librarian": "Dashboard",
  "/librarian/resources": "Resources",
  "/librarian/profile": "Profile",
};

const quickNavigationItems: QuickNavigationItem[] = [
  {
    href: "/librarian/resources",
    label: "Resources",
    icon: Files,
  },
  {
    href: "/librarian/profile",
    label: "Profile",
    icon: CircleUserRound,
  },
];

export default function LibrarianLayout({
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
  const [userName, setUserName] = React.useState("Librarian");
  const [schoolName, setSchoolName] = React.useState("Assigned school");
  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const activeSection = pathname.startsWith("/librarian/resources")
    ? "Resources"
    : pathname.startsWith("/librarian/profile")
      ? "Profile"
      : (sectionByPath[pathname] ?? "Dashboard");

  React.useEffect(() => {
    let active = true;
    Promise.all([getCurrentUser(), getTenant(getAuthenticatedTenantId())])
      .then(([{ user }, { tenant }]) => {
        if (active) {
          const fullName = [user.firstName, user.middleName, user.lastName]
            .filter(Boolean)
            .join(" ");
          setUserName(fullName || "Librarian");
          setSchoolName(tenant.displayName);
        }
      })
      .catch((error: unknown) => {
        console.error("Unable to load librarian workspace details:", error);
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
      onClick: () => router.push("/librarian/profile"),
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
        currentSchool={schoolName}
        schools={[{ id: "school", name: schoolName }]}
        navGroups={navGroups}
      />

      <section className="workspace">
        <NavBar
          className={styles.navbar}
          breadcrumbs={[{ label: "Workspace" }, { label: activeSection }]}
          user={{
            name: userName,
            role: "Librarian",
            initials: userInitials || "LI",
          }}
          isDark={isDark}
          onThemeToggle={() => setIsDark((dark) => !dark)}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
          search={{
            placeholder: "Search librarian workspace...",
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
        description="Go to a librarian workspace page."
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
