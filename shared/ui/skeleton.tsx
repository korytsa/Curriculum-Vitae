import * as React from "react";
import { cn } from "@/shared/lib";
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-700", className)}
      {...props}
    />
  );
}
