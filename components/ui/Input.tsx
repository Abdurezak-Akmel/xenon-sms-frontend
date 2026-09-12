"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "flex w-full rounded-lg border bg-(--card) text-(--foreground) transition-all duration-150 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--muted) disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-(--line) focus:border-(--blue) focus:ring-3 focus:ring-(--blue)/15",
        filled:
          "border-transparent bg-(--background) focus:border-(--blue) focus:bg-(--card) focus:ring-3 focus:ring-(--blue)/15",
        subtle:
          "border-(--line) bg-transparent hover:bg-(--background)/60 focus:border-(--blue) focus:bg-(--card) focus:ring-3 focus:ring-(--blue)/15",
      },
      inputSize: {
        sm: "h-8 px-2.5 text-xs py-1.5",
        default: "h-9.5 px-3.5 text-sm py-2",
        lg: "h-11 px-4 text-base py-2.5",
      },
      hasError: {
        true: "border-(--red) focus:border-(--red) focus:ring-(--red)/20 text-(--foreground)",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      hasError: false,
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Label displayed above the input */
  label?: React.ReactNode;
  /** Helper or description text displayed below the input */
  helperText?: React.ReactNode;
  /** Error message or boolean indicating error state */
  error?: React.ReactNode | boolean;
  /** Optional icon or element to display at the beginning of the input */
  startIcon?: React.ReactNode;
  /** Optional icon or element to display at the end of the input */
  endIcon?: React.ReactNode;
  /** Show a clear button when the input has value */
  clearable?: boolean;
  /** Callback fired when clear button is clicked */
  onClear?: () => void;
  /** Enable password toggle button when type is password */
  showPasswordToggle?: boolean;
  /** Container classname for wrapper element */
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type = "text",
      variant,
      inputSize,
      hasError,
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      clearable,
      onClear,
      showPasswordToggle,
      disabled,
      value,
      defaultValue,
      onChange,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      value ?? defaultValue ?? "",
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      if (onClear) {
        onClear();
      }
    };

    const isPasswordType = type === "password";
    const resolvedType = isPasswordType && showPassword ? "text" : type;
    const isError = Boolean(error) || Boolean(hasError);
    const errorMessage = typeof error === "string" || React.isValidElement(error) ? error : null;

    const hasStartIcon = Boolean(startIcon);
    const hasEndContent =
      Boolean(endIcon) ||
      (clearable && Boolean(currentValue)) ||
      (isPasswordType && showPasswordToggle) ||
      isError;

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-(--foreground) select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && (
              <span className="text-(--red) text-[11px] font-normal">*required</span>
            )}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {hasStartIcon && (
            <div className="absolute left-3 flex items-center justify-center text-(--muted) pointer-events-none z-1 [&_svg]:size-4">
              {startIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={handleInputChange}
            aria-invalid={isError ? "true" : undefined}
            aria-describedby={
              errorMessage
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              inputVariants({
                variant,
                inputSize,
                hasError: isError,
                className,
              }),
              hasStartIcon && "pl-9",
              hasEndContent && "pr-10",
            )}
            {...props}
          />

          {hasEndContent && (
            <div className="absolute right-2.5 flex items-center gap-1 text-(--muted) z-1">
              {clearable && Boolean(currentValue) && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  className="p-1 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--background) transition-colors"
                  aria-label="Clear input"
                >
                  <X className="size-3.5" />
                </button>
              )}

              {isPasswordType && showPasswordToggle && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="p-1 rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--background) transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              )}

              {isError && !endIcon && (
                <AlertCircle className="size-4 text-(--red) shrink-0" />
              )}

              {endIcon && (
                <div className="flex items-center justify-center [&_svg]:size-4">
                  {endIcon}
                </div>
              )}
            </div>
          )}
        </div>

        {errorMessage ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-[11px] font-medium text-(--red) flex items-center gap-1"
          >
            {errorMessage}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="text-[11px] text-(--muted)"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
