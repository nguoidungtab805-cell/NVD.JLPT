// FILE: components/ui/Button.tsx
import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-jp-orange text-white hover:bg-orange-600 shadow-md hover:shadow-lg",
      secondary: "bg-jp-navy text-white hover:bg-gray-800 shadow-md hover:shadow-lg",
      outline: "border-2 border-jp-navy text-jp-navy hover:bg-jp-navy hover:text-white",
      ghost: "text-jp-navy hover:bg-gray-100",
      danger: "bg-jp-red text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-300 font-medium active:scale-95 disabled:opacity-70 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
