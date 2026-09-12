"use client";

import * as React from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavUser {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
}

export interface NavBreadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ProfileMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
}

export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  /** School name or top-level organization title */
  brandName?: string;
  /** Active page/section name */
  activeSection?: string;
  /** Dynamic breadcrumb trail */
  breadcrumbs?: NavBreadcrumb[];
  /** Current logged in user information */
  user?: NavUser;
  /** Whether dark mode is currently active */
  isDark?: boolean;
  /** Callback fired when theme toggle button is clicked */
  onThemeToggle?: () => void;
  /** Callback fired when mobile menu button is clicked */
  onMenuToggle?: () => void;
  /** Search button configuration */
  search?: {
    placeholder?: string;
    shortcut?: string;
    onClick?: () => void;
  };
  /** Notification indicator and click handler */
  notifications?: {
    count?: number;
    hasUnread?: boolean;
    onClick?: () => void;
  };
  /** Custom menu items inside profile dropdown */
  profileMenuItems?: ProfileMenuItem[];
  /** Shortcut callback when Settings is selected */
  onSettingsClick?: () => void;
  /** Shortcut callback when Sign Out is selected */
  onSignOut?: () => void;
  /** Additional action elements rendered before the profile */
  extraActions?: React.ReactNode;
  /** Whether the profile menu dropdown is open (controlled mode) */
  profileOpen?: boolean;
  /** Callback when profile dropdown open state changes */
  onProfileOpenChange?: (open: boolean) => void;
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function NavBar({
  brandName = "Adams Hill Academy",
  activeSection,
  breadcrumbs,
  user = {
    name: "Jordan Miller",
    email: "admin@adamshill.edu",
    role: "School Admin",
  },
  isDark,
  onThemeToggle,
  onMenuToggle,
  search = {
    placeholder: "Search anything",
    shortcut: "⌘ K",
  },
  notifications,
  profileMenuItems,
  onSettingsClick,
  onSignOut,
  extraActions,
  profileOpen: controlledProfileOpen,
  onProfileOpenChange,
  className,
  children,
  ...props
}: NavBarProps) {
  const [uncontrolledProfileOpen, setUncontrolledProfileOpen] = React.useState(false);
  const isProfileOpen = controlledProfileOpen ?? uncontrolledProfileOpen;

  const profileRef = React.useRef<HTMLDivElement>(null);

  const setProfileOpen = (open: boolean) => {
    if (onProfileOpenChange) {
      onProfileOpenChange(open);
    } else {
      setUncontrolledProfileOpen(open);
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const userInitials = user?.initials || (user?.name ? getInitials(user.name) : "US");

  return (
    <header
      className={cn(
        "topbar sticky top-0 z-30 flex h-[70px] w-full items-center justify-between border-b border-(--line) bg-(--card)/95 px-5 sm:px-8 backdrop-blur transition-colors",
        className,
      )}
      {...props}
    >
      {/* Left side: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            className="mobile-menu flex size-9 items-center justify-center rounded-lg text-(--foreground) hover:bg-(--background) transition-colors lg:hidden"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu className="size-5" />
          </button>
        )}

        <nav aria-label="Breadcrumbs" className="breadcrumbs flex items-center gap-2 text-xs text-(--muted) truncate">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-(--muted)/60" />}
                  {crumb.onClick ? (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className={cn(
                        "hover:text-(--foreground) transition-colors truncate",
                        isLast && "font-semibold text-(--foreground)",
                      )}
                    >
                      {crumb.label}
                    </button>
                  ) : crumb.href ? (
                    <a
                      href={crumb.href}
                      className={cn(
                        "hover:text-(--foreground) transition-colors truncate",
                        isLast && "font-semibold text-(--foreground)",
                      )}
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={cn(
                        "truncate",
                        isLast && "font-semibold text-(--foreground)",
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>
              {brandName && (
                <span className="truncate hover:text-(--foreground) transition-colors cursor-default">
                  {brandName}
                </span>
              )}
              {activeSection && (
                <>
                  <ChevronRight className="size-3.5 shrink-0 text-(--muted)/60" />
                  <strong className="truncate font-semibold text-(--foreground)">
                    {activeSection}
                  </strong>
                </>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Center content (if custom children passed) */}
      {children && <div className="hidden md:flex items-center gap-2">{children}</div>}

      {/* Right side actions */}
      <div className="top-actions flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search trigger */}
        {search?.onClick && (
          <button
            type="button"
            className="search-trigger group flex items-center gap-2 rounded-lg border border-(--line) bg-(--background) px-3 py-1.5 text-xs text-(--muted) transition hover:border-(--blue)/40 hover:bg-(--card)"
            onClick={search.onClick}
            aria-label="Search"
          >
            <Search className="size-4 text-(--muted) group-hover:text-(--foreground)" />
            <span className="hidden sm:inline-block font-normal">
              {search.placeholder || "Search anything..."}
            </span>
            {search.shortcut && (
              <kbd className="hidden sm:inline-block rounded border border-(--line) bg-(--card) px-1.5 py-0.5 text-[10px] text-(--muted)">
                {search.shortcut}
              </kbd>
            )}
          </button>
        )}

        {/* Notifications */}
        {notifications && (
          <button
            type="button"
            className="icon-button relative flex size-9 items-center justify-center rounded-lg text-(--muted) hover:bg-(--background) hover:text-(--foreground) transition-colors"
            onClick={notifications.onClick}
            aria-label={`Notifications ${notifications.count ? `(${notifications.count} unread)` : ""}`}
          >
            <Bell className="size-4.5" />
            {(notifications.hasUnread || (notifications.count && notifications.count > 0)) && (
              <span className="notification-dot absolute top-2 right-2 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--red) opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-(--red)" />
              </span>
            )}
          </button>
        )}

        {/* Dark/Light mode toggle */}
        {onThemeToggle && (
          <button
            type="button"
            className="icon-button flex size-9 items-center justify-center rounded-lg text-(--muted) hover:bg-(--background) hover:text-(--foreground) transition-colors"
            onClick={onThemeToggle}
            aria-label="Toggle color theme"
          >
            {isDark ? (
              <Sun className="size-4.5 text-(--orange)" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </button>
        )}

        {/* Custom actions slot */}
        {extraActions}

        {/* User profile with dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="profile flex items-center gap-2.5 rounded-lg p-1.5 text-left text-(--foreground) hover:bg-(--background) transition-colors"
              onClick={() => setProfileOpen(!isProfileOpen)}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              aria-label="User account menu"
            >
              <div className="profile-avatar flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d9efe5] text-xs font-bold text-[#267a52] dark:bg-[#153e2d] dark:text-[#52c98d]">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>

              <div className="profile-copy hidden md:block leading-tight">
                <strong className="block text-xs font-semibold text-(--foreground)">
                  {user.name}
                </strong>
                {user.role && (
                  <span className="block text-[11px] text-(--muted)">
                    {user.role}
                  </span>
                )}
              </div>

              <ChevronDown
                className={cn(
                  "hidden md:block size-3.5 text-(--muted) transition-transform duration-200",
                  isProfileOpen && "rotate-180",
                )}
              />
            </button>

            {/* Profile Menu Dropdown */}
            {isProfileOpen && (
              <div
                className="profile-menu absolute right-0 mt-2 w-56 rounded-xl border border-(--line) bg-(--card) p-1.5 text-(--foreground) shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                role="menu"
              >
                <div className="px-3 py-2 border-b border-(--line) mb-1">
                  <strong className="block text-xs font-semibold truncate">
                    {user.name}
                  </strong>
                  {user.email && (
                    <span className="block text-[11px] text-(--muted) truncate mt-0.5">
                      {user.email}
                    </span>
                  )}
                  {user.role && (
                    <span className="inline-block mt-1.5 rounded bg-(--blue-soft) px-1.5 py-0.5 text-[10px] font-medium text-(--blue)">
                      {user.role}
                    </span>
                  )}
                </div>

                {profileMenuItems && profileMenuItems.length > 0 ? (
                  profileMenuItems.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                          item.destructive
                            ? "text-(--red) hover:bg-[#fdeaea] dark:hover:bg-[#3d1818]"
                            : "text-(--foreground) hover:bg-(--background)",
                        )}
                        onClick={() => {
                          setProfileOpen(false);
                          item.onClick();
                        }}
                        role="menuitem"
                      >
                        {IconComponent && <IconComponent className="size-3.5" />}
                        <span>{item.label}</span>
                      </button>
                    );
                  })
                ) : (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-(--foreground) hover:bg-(--background) transition-colors"
                      onClick={() => {
                        setProfileOpen(false);
                        onSettingsClick?.();
                      }}
                      role="menuitem"
                    >
                      <Settings className="size-3.5 text-(--muted)" />
                      <span>Account Settings</span>
                    </button>

                    {onSignOut && (
                      <div className="border-t border-(--line) mt-1 pt-1">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-(--red) hover:bg-[#fdeaea] dark:hover:bg-[#3d1818] transition-colors"
                          onClick={() => {
                            setProfileOpen(false);
                            onSignOut();
                          }}
                          role="menuitem"
                        >
                          <LogOut className="size-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
