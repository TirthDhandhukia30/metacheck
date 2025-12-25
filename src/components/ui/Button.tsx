import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Size variants
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        // Style variants
        variant === "primary" && [
          "bg-[var(--accent-color)] text-[var(--bg-primary)]",
          "hover:bg-[var(--accent-hover)]",
        ],
        variant === "secondary" && [
          "bg-[var(--bg-tertiary)] text-[var(--text-primary)]",
          "hover:bg-[var(--border-color)]",
        ],
        variant === "ghost" && [
          "text-[var(--text-secondary)]",
          "hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
        ],
        variant === "outline" && [
          "border border-[var(--border-color)] text-[var(--text-primary)]",
          "hover:bg-[var(--bg-tertiary)]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
