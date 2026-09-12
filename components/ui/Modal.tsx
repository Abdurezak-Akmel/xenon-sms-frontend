"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ModalProps {
  /** Controls if the modal is visible */
  isOpen: boolean;
  /** Callback fired when modal requested to close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Width preset of modal window */
  size?: ModalSize;
  /** Close modal when clicking on the backdrop backdrop */
  closeOnBackdropClick?: boolean;
  /** Close modal when pressing Escape key */
  closeOnEscape?: boolean;
  /** Extra classname for outer backdrop */
  backdropClassName?: string;
  /** Extra classname for modal card container */
  className?: string;
  /** Optional title to automatically render in header */
  title?: React.ReactNode;
  /** Optional subtitle or description */
  description?: React.ReactNode;
  /** Shows standard close X icon button in header */
  showCloseButton?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
  full: "max-w-[96vw] max-h-[96vh]",
};

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  backdropClassName,
  className,
  title,
  description,
  showCloseButton = true,
}: ModalProps) {
  // Handle ESC key press
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
        "bg-[#0f1b2e]/45 backdrop-blur-[2px] animate-in fade-in duration-150",
        backdropClassName,
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnBackdropClick) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-xl border border-(--line) bg-(--card) text-(--foreground) shadow-2xl animate-in zoom-in-95 duration-150",
          sizeClasses[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <ModalHeader
            title={title}
            description={description}
            onClose={showCloseButton ? onClose : undefined}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  description,
  onClose,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-(--line) px-6 py-4.5",
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        {title && <ModalTitle>{title}</ModalTitle>}
        {description && <ModalDescription>{description}</ModalDescription>}
        {children}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="icon-button flex size-8 shrink-0 items-center justify-center rounded-lg text-(--muted) hover:bg-(--background) hover:text-(--foreground) transition-colors"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function ModalTitle({
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-6 text-(--foreground) tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function ModalDescription({
  children,
  className,
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-1 text-xs text-(--muted) leading-relaxed",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function ModalBody({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 max-h-[75vh] overflow-y-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-2.5 border-t border-(--line) px-6 py-4 bg-(--background)/30",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Pre-configured confirmation modal for delete, warning, or state change actions */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "destructive" | "primary" | "warning";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "destructive",
  isLoading = false,
}: ConfirmModalProps) {
  const iconMap = {
    destructive: (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#fdeaea] text-(--red) dark:bg-[#3d1818] dark:text-[#f27e7e]">
        <AlertTriangle className="size-5" />
      </div>
    ),
    warning: (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#fff2df] text-(--orange) dark:bg-[#3d2a13] dark:text-[#f3a456]">
        <AlertTriangle className="size-5" />
      </div>
    ),
    primary: (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#edf3ff] text-(--blue) dark:bg-[#1e3765] dark:text-[#6a9bf7]">
        <Info className="size-5" />
      </div>
    ),
  };

  const buttonVariantMap = {
    destructive: "destructive" as const,
    warning: "default" as const,
    primary: "default" as const,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      className="p-6"
    >
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
        {iconMap[tone]}
        <div>
          <ModalTitle className="text-lg">{title}</ModalTitle>
          <ModalDescription className="text-sm mt-1.5">
            {description}
          </ModalDescription>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={buttonVariantMap[tone]}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
