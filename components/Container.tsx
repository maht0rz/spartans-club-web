import React from "react";
import { cn } from "../lib/utils";

export default function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container", className)} {...props} />;
}

