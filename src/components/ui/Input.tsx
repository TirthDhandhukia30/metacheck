import { cn } from "../../lib/utils";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-base",
          "bg-[var(--bg-secondary)] text-[var(--text-primary)]",
          "border border-[var(--border-color)]",
          "placeholder:text-[var(--text-tertiary)]",
          "transition-all duration-150",
          "focus:border-[var(--accent-color)] focus:outline-none",
          error && "border-[var(--error-color)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
