"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  "rounded-xl border bg-(--card) text-(--foreground) transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-(--line) shadow-[var(--shadow)]",
        outline: "border-(--line) shadow-none",
        subtle: "border-transparent bg-(--background)",
        elevated: "border-(--line) shadow-lg hover:shadow-xl",
        interactive:
          "border-(--line) shadow-sm hover:border-(--blue)/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
      },
      padding: {
        none: "p-0",
        sm: "p-3.5",
        default: "p-5 sm:p-6",
        lg: "p-6 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

export function Card({
  as: Component = "div",
  className,
  variant,
  padding,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  className,
  children,
  action,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { action?: React.ReactNode }) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 mb-4", className)}
      {...props}
    >
      <div className="flex-1 min-w-0 space-y-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-bold tracking-tight text-(--foreground)",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-(--muted) leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-5 pt-4 border-t border-(--line) flex items-center justify-between gap-3 text-xs text-(--muted)",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
