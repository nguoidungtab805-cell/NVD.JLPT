// FILE: components/ui/Input.tsx
import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-jp-navy">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-jp-orange focus:border-transparent",
            "disabled:cursor-not-allowed disabled:bg-gray-100",
            error && "border-jp-red focus:ring-jp-red",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-jp-red">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
