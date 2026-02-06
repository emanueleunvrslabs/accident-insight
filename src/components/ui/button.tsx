import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] rounded-xl shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.97] rounded-xl shadow-sm",
        outline: "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:border-accent/30 active:scale-[0.97] rounded-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.97] rounded-xl",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground active:scale-[0.97] rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        // Liquid Glass variants
        glass: [
          "bg-[hsl(var(--glass-bg))]",
          "backdrop-blur-[20px]",
          "border border-[hsl(var(--glass-border))]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_1px_3px_hsl(var(--glass-shadow)),0_4px_12px_hsl(var(--glass-shadow))]",
          "hover:shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_2px_6px_hsl(var(--glass-shadow)),0_8px_20px_hsl(var(--glass-shadow))]",
          "active:scale-[0.97]",
          "active:shadow-[inset_0_0.5px_0_0_hsl(var(--glass-highlight)),0_1px_2px_hsl(var(--glass-shadow))]",
          "rounded-xl",
          "text-foreground",
        ].join(" "),
        "glass-primary": [
          "bg-[hsl(var(--primary)/0.12)]",
          "backdrop-blur-[20px]",
          "border border-[hsl(var(--primary)/0.25)]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--primary)/0.15),0_1px_3px_hsl(var(--primary)/0.08)]",
          "hover:bg-[hsl(var(--primary)/0.18)]",
          "hover:shadow-[inset_0_0.5px_0_0_hsl(var(--primary)/0.2),0_2px_8px_hsl(var(--primary)/0.12)]",
          "active:scale-[0.97]",
          "rounded-xl",
          "text-primary",
          "font-semibold",
        ].join(" "),
        "glass-destructive": [
          "bg-[hsl(var(--destructive)/0.12)]",
          "backdrop-blur-[20px]",
          "border border-[hsl(var(--destructive)/0.25)]",
          "shadow-[inset_0_0.5px_0_0_hsl(var(--destructive)/0.15),0_1px_3px_hsl(var(--destructive)/0.08)]",
          "hover:bg-[hsl(var(--destructive)/0.18)]",
          "active:scale-[0.97]",
          "rounded-xl",
          "text-destructive",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3.5",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
