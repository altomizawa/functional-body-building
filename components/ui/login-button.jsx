import React, { ReactNode } from 'react'
import { cn } from "@/lib/utils"
import { cva  } from "class-variance-authority";



export const loginButtonVariants = cva(
  "w-full border-2 py-2 rounded-md text-white",
  {
    variants: {
      variant: {
        default: "bg-black text-primary-foreground shadow hover:bg-black/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { 
        small: "text-sm", 
        default: "text-base",
        large: "text-lg",
        icon: "h-9 w-9",
      },
    },
    
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


const LoginButton = React.forwardRef(function LoginButton({ className, variant, size, ...props }, ref) {
  return (
    <button
      className={cn(loginButtonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    >
      {props.children}
    </button>
  );
});

LoginButton.displayName = "LoginButton";

export { LoginButton, loginButtonVariants };
