import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib";
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}
const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const displayFallback = !src || imgError;
    const initials = fallback
      ? fallback
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "";
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#757575] text-neutral-800",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {" "}
        {displayFallback ? (
          <span className="font-medium">{initials}</span>
        ) : (
          <Image
            src={src!}
            alt={alt || ""}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        )}{" "}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
