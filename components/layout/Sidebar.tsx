"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileBarChart,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquare,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/route_protection/ProtectedRoute";

export interface NavItemDef {
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  href?: string;
}

export interface NavGroupDef {
  label: string;
  items: NavItemDef[];
}

export const defaultNavGroups: NavGroupDef[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "People",
    items: [
      { label: "Students", icon: GraduationCap },
      { label: "Staff & Teachers", icon: Users },
      { label: "Guardians", icon: ShieldCheck },
    ],
  },
  {
    label: "Academic",
    items: [
      { label: "Classes & Schedule", icon: CalendarDays },
      { label: "Attendance", icon: ClipboardCheck },
      { label: "Exams & Grades", icon: FileText },
      { label: "Curriculum", icon: BookOpen },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Fees & Invoices", icon: WalletCards },
      { label: "Payments", icon: CreditCard },
      { label: "Financial Reports", icon: CircleDollarSign },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Inventory", icon: Package },
      { label: "Library", icon: Library },
      { label: "Facilities", icon: Building2 },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Messages", icon: MessageSquare, badge: 4 },
      { label: "Announcements", icon: Bell },
    ],
  },
  {
    label: "Reports & Audit",
    items: [
      { label: "Reports", icon: FileBarChart },
      { label: "Audit Log", icon: Activity },
    ],
  },
];

export interface SidebarProps {
  isOpen?: boolean;
  onToggleOpen?: () => void;
  activeItem?: string;
  onSelectItem?: (label: string) => void;
  schools?: Array<{ id: string; name: string }>;
  currentSchool?: string;
  onSelectSchool?: (school: string) => void;
  navGroups?: NavGroupDef[];
  className?: string;
}

export function Sidebar({
  isOpen = true,
  onToggleOpen,
  activeItem = "Dashboard",
  onSelectItem,
  schools = [
    { id: "1", name: "Adams Hill Academy" },
    { id: "2", name: "Northfield Prep" },
  ],
  currentSchool = "Adams Hill Academy",
  onSelectSchool,
  navGroups = defaultNavGroups,
  className,
}: SidebarProps) {
  const [schoolMenuOpen, setSchoolMenuOpen] = React.useState(false);

  return (
    <aside className={cn("sidebar", !isOpen && "collapsed", className)}>
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>
        {isOpen && (
          <div>
            <strong>Xenon</strong>
            <span>School Management</span>
          </div>
        )}
        {onToggleOpen && (
          <button
            type="button"
            className="collapse-button"
            onClick={() => {
              setSchoolMenuOpen(false);
              onToggleOpen();
            }}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isOpen}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose size={17} />
            ) : (
              <PanelLeftOpen size={17} />
            )}
          </button>
        )}
      </div>

      {schoolMenuOpen && (
        <div className="school-menu" role="menu">
          {schools.map((school) => (
            <button
              key={school.id}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelectSchool?.(school.name);
                setSchoolMenuOpen(false);
              }}
            >
              <span>{school.name}</span>
              {currentSchool === school.name && <Check size={14} />}
            </button>
          ))}
          <button
            type="button"
            className="text-(--blue) font-medium"
            role="menuitem"
            onClick={() => setSchoolMenuOpen(false)}
          >
            <span>Add another school</span>
            <Plus size={14} />
          </button>
        </div>
      )}

      <nav className="nav" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            {isOpen && <span className="nav-label">{group.label}</span>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;
              const itemContent = (
                <>
                  <Icon size={18} />
                  <span>{isOpen && item.label}</span>
                  {isOpen && item.badge && (
                    <b className="nav-badge">{item.badge}</b>
                  )}
                </>
              );

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn("nav-item", isActive && "active")}
                  onClick={() => onSelectItem?.(item.label)}
                  title={item.label}
                >
                  {itemContent}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className={cn("nav-item", isActive && "active")}
                  onClick={() => onSelectItem?.(item.label)}
                  title={item.label}
                >
                  {itemContent}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className={cn("nav-item", activeItem === "Settings" && "active")}
          onClick={() => onSelectItem?.("Settings")}
        >
          <Settings size={18} />
          <span>{isOpen && "Settings"}</span>
        </button>
        <div className="sidebar-version">
          {isOpen && (
            <>
              <span>XENON SMS</span>
              <small>v2.4.0 • Enterprise Cloud</small>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
