"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/route_protection/ProtectedRoute";

export function Table({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrap relative w-full overflow-x-auto rounded-xl border border-(--line) bg-(--card) shadow-sm">
      <table
        className={cn("w-full caption-bottom text-xs text-left", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-(--line) bg-(--background)/60", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-(--line)", className)} {...props} />
  );
}

export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t border-(--line) bg-(--background)/50 font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  selected,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-(--background)/50",
        selected && "bg-(--blue-soft) dark:bg-[#1e3765]",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  sortable,
  sortDirection,
  onSort,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}) {
  return (
    <th
      className={cn(
        "h-10 px-4 py-2.5 text-left align-middle font-bold text-[11px] uppercase tracking-wider text-(--muted)",
        sortable && "cursor-pointer select-none hover:text-(--foreground)",
        className,
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="inline-flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="text-(--muted)">
            {sortDirection === "asc" ? (
              <ArrowUp className="size-3.5 text-(--blue)" />
            ) : sortDirection === "desc" ? (
              <ArrowDown className="size-3.5 text-(--blue)" />
            ) : (
              <ArrowUpDown className="size-3 text-(--muted)/60" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-3 align-middle text-(--foreground)", className)}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("mt-3 text-xs text-(--muted)", className)}
      {...props}
    />
  );
}

export function TableEmpty({
  colSpan = 5,
  title = "No records found",
  description = "There are no matching items in this directory.",
  icon,
}: {
  colSpan?: number;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-xs">
        <div className="flex flex-col items-center justify-center gap-2">
          {icon && <div className="text-(--muted) mb-1">{icon}</div>}
          <strong className="text-sm font-semibold text-(--foreground)">
            {title}
          </strong>
          <p className="text-xs text-(--muted) max-w-sm">{description}</p>
        </div>
      </td>
    </tr>
  );
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const from = totalItems
    ? (currentPage - 1) * (pageSize ?? 10) + 1
    : undefined;
  const to = totalItems
    ? Math.min(currentPage * (pageSize ?? 10), totalItems)
    : undefined;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-(--line) bg-(--card) text-xs text-(--muted)",
        className,
      )}
    >
      <div>
        {totalItems && from && to ? (
          <span>
            Showing{" "}
            <strong className="font-semibold text-(--foreground)">
              {from}
            </strong>{" "}
            to{" "}
            <strong className="font-semibold text-(--foreground)">{to}</strong>{" "}
            of{" "}
            <strong className="font-semibold text-(--foreground)">
              {totalItems}
            </strong>{" "}
            entries
          </span>
        ) : (
          <span>
            Page{" "}
            <strong className="font-semibold text-(--foreground)">
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-(--foreground)">
              {totalPages}
            </strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex size-7.5 items-center justify-center rounded-lg border border-(--line) bg-(--card) text-(--foreground) hover:bg-(--background) disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="px-2 font-medium text-(--foreground)">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex size-7.5 items-center justify-center rounded-lg border border-(--line) bg-(--card) text-(--foreground) hover:bg-(--background) disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
