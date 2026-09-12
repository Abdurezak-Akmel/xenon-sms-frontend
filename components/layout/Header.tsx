import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";

export type HeaderProps = {
  activeSection: string;
  dark: boolean;
  profileOpen: boolean;
  schoolName?: string;
  onAction: (message: string) => void;
  onMenuToggle: () => void;
  onProfileToggle: () => void;
  onSearchOpen: () => void;
  onThemeToggle: () => void;
};

export function Header({
  activeSection,
  dark,
  profileOpen,
  schoolName = "Adams Hill Academy",
  onAction,
  onMenuToggle,
  onProfileToggle,
  onSearchOpen,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu"
        onClick={onMenuToggle}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>
      <div className="breadcrumbs">
        <span>{schoolName}</span>
        <ChevronRight size={14} />
        <strong>{activeSection}</strong>
      </div>
      <div className="top-actions">
        <button className="search-trigger" onClick={onSearchOpen}>
          <Search size={17} />
          <span>Search anything</span>
          <kbd>⌘ K</kbd>
        </button>
        <button
          className="icon-button"
          onClick={() => onAction("You are all caught up")}
          aria-label="Notifications"
        >
          <Bell size={19} />
          <i className="notification-dot" />
        </button>
        <button
          className="icon-button"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button
          className="profile"
          onClick={onProfileToggle}
          aria-expanded={profileOpen}
        >
          <div className="profile-avatar">JM</div>
          <div className="profile-copy">
            <strong>Jordan Miller</strong>
            <span>School Admin</span>
          </div>
          <ChevronDown size={15} />
        </button>
      </div>
      {profileOpen && (
        <div className="profile-menu">
          <strong>Jordan Miller</strong>
          <span>admin@adamshill.edu</span>
          <hr />
          <button onClick={() => onAction("Profile settings selected")}>
            Profile settings
          </button>
          <button onClick={() => onAction("Signed out of demo session")}>
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
