import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormProps = ComponentProps<"form">;

function Form({ className, ...props }: FormProps) {
  return <form className={cn("grid gap-5", className)} {...props} />;
}

type FormFieldProps = ComponentProps<"fieldset"> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
};

function FormField({
  className,
  label,
  description,
  error,
  htmlFor,
  children,
  ...props
}: FormFieldProps) {
  return (
    <fieldset className={cn("grid gap-2", className)} {...props}>
      {label && <FormLabel htmlFor={htmlFor}>{label}</FormLabel>}
      {children}
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormMessage>{error}</FormMessage>}
    </fieldset>
  );
}

type FormLabelProps = ComponentProps<"label">;

function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

type FormControlProps = ComponentProps<"div">;

function FormControl({ className, ...props }: FormControlProps) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

type FormDescriptionProps = ComponentProps<"p">;

function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

type FormMessageProps = ComponentProps<"p">;

function FormMessage({ className, ...props }: FormMessageProps) {
  return (
    <p
      role="alert"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
};
