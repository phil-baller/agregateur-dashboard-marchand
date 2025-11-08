"use client";

import { LoadingSpinner } from "./loading-spinner";

interface PageLoaderProps {
  text?: string;
}

export const PageLoader = ({ text = "Loading..." }: PageLoaderProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center animate-fade-in">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

