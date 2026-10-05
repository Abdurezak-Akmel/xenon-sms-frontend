"use client";

import * as React from "react";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/route_protection/ProtectedRoute";
import { Sidebar, type NavGroupDef } from "@/components/layout/Sidebar";
import {
  NavBar,
  type NavUser,
  type NavBreadcrumb,
} from "@/components/layout/NavBar";
import { Modal, ModalBody } from "@/components/ui/Modal";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  breadcrumbs?: NavBreadcrumb[];
  user?: NavUser;
  schoolName?: string;
  schools?: Array<{ id: string; name: string }>;
  navGroups?: NavGroupDef[];
  onSelectSection?: (section: string) => void;
  className?: string;
}

export function DashboardLayout({
  children,
  activeSection = "Dashboard",
  breadcrumbs,
  user = {
    name: "Dr. Jordan Miller",
    email: "admin@adamshill.edu",
    role: "School Admin",
  },
  schoolName = "Adams Hill Academy",
  schools = [
    { id: "1", name: "Adams Hill Academy" },
    { id: "2", name: "Northfield Prep" },
  ],
  navGroups,
  onSelectSection,
  className,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [dark, setDark] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(activeSection);
  const [currentSchool, setCurrentSchool] = React.useState(schoolName);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Handle section switch
  const handleSectionSelect = (section: string) => {
    setCurrentSection(section);
    onSelectSection?.(section);
  };

  // Keyboard shortcut for Cmd+K search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = [
    "Students Directory",
    "Attendance Rosters",
    "Fee Invoices & Receipts",
    "Staff & Faculty Contracts",
    "Exam Timetable Builder",
    "Branch Management",
  ].filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      className={dark ? "app dark min-h-screen flex" : "app min-h-screen flex"}
    >
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        activeItem={currentSection}
        onSelectItem={handleSectionSelect}
        currentSchool={currentSchool}
        schools={schools}
        onSelectSchool={setCurrentSchool}
        navGroups={navGroups}
      />

      {/* Main Workspace */}
      <div className="workspace flex-1 flex flex-col min-w-0">
        <NavBar
          brandName={currentSchool}
          activeSection={currentSection}
          breadcrumbs={breadcrumbs}
          user={user}
          isDark={dark}
          onThemeToggle={() => setDark(!dark)}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          search={{
            placeholder: "Search anything...",
            shortcut: "⌘ K",
            onClick: () => setSearchOpen(true),
          }}
          notifications={{
            hasUnread: true,
            count: 3,
            onClick: () => console.log("Open notifications"),
          }}
          onSignOut={() => console.log("Sign out")}
        />

        <main
          className={cn(
            "content flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto",
            className,
          )}
        >
          {children}
        </main>
      </div>

      {/* Quick Global Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        size="lg"
        showCloseButton={false}
        className="p-0 overflow-hidden"
      >
        <div className="modal-search flex items-center gap-3 border-b border-(--line) px-4 py-3 text-(--muted)">
          <Search className="size-5 shrink-0" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent text-sm text-(--foreground) outline-none placeholder:text-(--muted)"
            placeholder="Search students, teachers, invoices, or modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="rounded border border-(--line) bg-(--background) px-2 py-0.5 text-[10px] text-(--muted)">
            ESC
          </kbd>
        </div>

        <ModalBody className="p-2 max-h-72">
          <div className="search-results space-y-1">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-(--muted) block">
              Quick Navigation
            </span>
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    handleSectionSelect(item);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-(--foreground) hover:bg-(--background) transition"
                >
                  <span className="font-medium">{item}</span>
                  <ChevronRight className="size-3.5 text-(--muted)" />
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-(--muted)">
                No results found for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
