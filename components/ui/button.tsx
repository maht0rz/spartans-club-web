import React from "react";
import { cn } from "../../lib/utils";

type Variant = "default" | "outline" | "ghost";
type Size = "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full transition-[transform,background,border-color] duration-200 hover:scale-105";
  const sizes = {
    md: "px-4 py-3 text-sm",
    sm: "px-3 py-2 text-xs"
  }[size];
  const variants = {
    default: "bg-primary text-primary-foreground border border-black/10 shadow-elevation  ",
    outline: "bg-transparent border border-black/20  ",
    ghost: "bg-transparent hover:bg-accent"
  }[variant];
  return <button className={cn(base, sizes, variants, className)} {...props} />;
}

