"use client";

import * as React from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id?: string;
  label: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  badge?: React.ReactNode;
  shortcut?: string;
  href?: string;
}

export interface DropdownProps {
  /** Trigger element. If omitted, default button is used */
  trigger?: React.ReactNode;
  /** Label for default trigger button */
  label?: React.ReactNode;
  /** Icon for default trigger button */
  icon?: LucideIcon | React.ReactNode;
  /** List of dropdown items or pass compound children */
  items?: DropdownItem[];
  /** Alignment of dropdown menu */
  align?: "left" | "right";
  /** Placement direction */
  placement?: "bottom" | "top";
  /** Width class */
  menuClassName?: string;
  /** Controlled open state */
  isOpen?: boolean;
  /** Open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Children for compound composition */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  className?: string;
}

export function Dropdown({
  trigger,
  label = "Options",
  icon,
  items,
  align = "right",
  placement = "bottom",
  menuClassName,
  isOpen: controlledIsOpen,
  onOpenChange,
  children,
  disabled = false,
  className,
}: DropdownProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (disabled) return;
    const next = !isOpen;
    if (onOpenChange) {
      onOpenChange(next);
    } else {
      setUncontrolledIsOpen(next);
    }
  };

  const close = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setUncontrolledIsOpen(false);
    }
  };

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const renderIcon = (iconItem?: LucideIcon | React.ReactNode) => {
    if (!iconItem) return null;
    if (React.isValidElement(iconItem)) return iconItem;
    const IconComponent = iconItem as LucideIcon;
    return <IconComponent className="size-4 shrink-0" />;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      {/* Trigger */}
      {trigger ? (
        <div onClick={toggle} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 rounded-lg border border-(--line) bg-(--card) px-3 py-1.5 text-xs font-medium text-(--foreground) shadow-sm hover:bg-(--background) focus:outline-none transition disabled:opacity-50"
        >
          {renderIcon(icon)}
          <span>{label}</span>
          <ChevronDown
            className={cn(
              "size-3.5 text-(--muted) transition-transform duration-150",
              isOpen && "rotate-180",
            )}
          />
        </button>
      )}

      {/* Menu dropdown */}
      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 min-w-[190px] rounded-xl border border-(--line) bg-(--card) p-1 text-(--foreground) shadow-xl animate-in fade-in zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0",
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            menuClassName,
          )}
        >
          {items && items.length > 0
            ? items.map((item, idx) => (
                <button
                  key={item.id ?? idx}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onClick?.();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                    item.disabled && "opacity-40 cursor-not-allowed",
                    item.destructive
                      ? "text-(--red) hover:bg-[#fdeaea] dark:hover:bg-[#3d1818]"
                      : "text-(--foreground) hover:bg-(--background)",
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {renderIcon(item.icon)}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && <div className="shrink-0">{item.badge}</div>}
                  {item.shortcut && (
                    <kbd className="text-[10px] text-(--muted) font-mono">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              ))
            : children}
        </div>
      )}
    </div>
  );
}

export function DropdownHeader({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted)",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownDivider({
  className,
}: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("my-1 border-t border-(--line)", className)} />;
}

export function DropdownItem({
  children,
  icon,
  destructive,
  disabled,
  onClick,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
        disabled && "opacity-40 cursor-not-allowed",
        destructive
          ? "text-(--red) hover:bg-[#fdeaea] dark:hover:bg-[#3d1818]"
          : "text-(--foreground) hover:bg-(--background)",
        className,
      )}
    >
      {icon && (
        <span className="size-4 shrink-0 flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}
