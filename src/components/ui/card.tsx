import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border bg-card shadow-sm",
        glass: [
          "bg-[hsl(var(--glass-bg))]",
          "backdrop-blur-[20px]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_1px_3px_hsl(var(--glass-shadow)),0_4px_12px_hsl(var(--glass-shadow))]",
          "hover:shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_4px_12px_hsl(var(--glass-shadow)),0_12px_32px_hsl(var(--glass-shadow))]",
          "hover:-translate-y-0.5",
        ].join(" "),
        "glass-subtle": [
          "bg-[hsl(var(--glass-bg-subtle))]",
          "backdrop-blur-[12px]",
          "border border-[hsl(var(--glass-border-outer))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_1px_2px_hsl(var(--glass-shadow))]",
        ].join(" "),
        "glass-strong": [
          "bg-[hsl(var(--glass-bg-strong))]",
          "backdrop-blur-[32px]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_2px_6px_hsl(var(--glass-shadow)),0_8px_24px_hsl(var(--glass-shadow))]",
        ].join(" "),
        elevated: "border bg-card shadow-liquid",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
