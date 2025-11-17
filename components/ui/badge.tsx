import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-black/15 bg-black/5 text-muted-foreground text-xs px-2.5 py-1",
        "dark:border-white/15 dark:bg-white/10 dark:text-foreground",
        className
      )}
      {...props}
    />
  );
}

