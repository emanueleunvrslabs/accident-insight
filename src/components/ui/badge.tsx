import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        // Glass variants
        glass: [
          "bg-[hsl(var(--glass-bg-subtle))]",
          "backdrop-blur-[12px]",
          "border-[hsl(var(--glass-border-outer))]",
          "text-foreground",
        ].join(" "),
        "glass-primary": [
          "bg-[hsl(var(--primary)/0.12)]",
          "backdrop-blur-[12px]",
          "border-[hsl(var(--primary)/0.25)]",
          "text-primary",
        ].join(" "),
        "glass-success": [
          "bg-[hsl(var(--success)/0.12)]",
          "backdrop-blur-[12px]",
          "border-[hsl(var(--success)/0.25)]",
          "text-success",
        ].join(" "),
        "glass-warning": [
          "bg-[hsl(var(--warning)/0.12)]",
          "backdrop-blur-[12px]",
          "border-[hsl(var(--warning)/0.25)]",
          "text-warning",
        ].join(" "),
        "glass-destructive": [
          "bg-[hsl(var(--destructive)/0.12)]",
          "backdrop-blur-[12px]",
          "border-[hsl(var(--destructive)/0.25)]",
          "text-destructive",
        ].join(" "),
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
