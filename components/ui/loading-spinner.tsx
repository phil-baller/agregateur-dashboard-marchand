"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export const LoadingSpinner = ({
  className,
  size = "md",
  text,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Spinner className={cn(sizeClasses[size], "animate-spin")} />
      {text && (
        <p className="text-sm text-muted-foreground animate-fade-in">
          {text}
        </p>
      )}
    </div>
  );
};

