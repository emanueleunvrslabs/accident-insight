import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "h-10 rounded-lg border border-input bg-background px-3 py-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        glass: [
          "h-11",
          "rounded-xl",
          "px-4 py-2.5",
          "bg-[hsl(var(--glass-bg))]",
          "backdrop-blur-[20px]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_1px_3px_hsl(var(--glass-shadow))]",
          "focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
          "focus:shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_0_0_3px_hsl(var(--primary)/0.1),0_2px_8px_hsl(var(--glass-shadow))]",
        ].join(" "),
        "glass-subtle": [
          "h-10",
          "rounded-xl",
          "px-4 py-2",
          "bg-[hsl(var(--glass-bg-subtle))]",
          "backdrop-blur-[12px]",
          "border border-[hsl(var(--glass-border-outer))]",
          "focus:ring-2 focus:ring-primary/15 focus:border-primary/25",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps 
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
