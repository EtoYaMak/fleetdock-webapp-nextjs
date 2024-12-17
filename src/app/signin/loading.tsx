"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center p-8 w-1/3 mx-auto gap-4 bg-muted-foreground/5 rounded-xl">
        <Skeleton className="h-14 w-1/2 mb-3 rounded-md" /> {/* Title */}
        <Skeleton className="h-8 w-2/3 mb-3 rounded-md" /> {/* Title */}
        <span className="w-full flex flex-col gap-2">
          <Skeleton className="h-6 w-1/4 rounded-md" /> {/* Password label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Password input */}
        </span>
        <span className="w-full flex flex-col gap-2">
          <Skeleton className="h-6 w-1/4 rounded-md" /> {/* Password label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Password input */}
        </span>
        <Skeleton className="h-10 w-1/2 rounded-md mt-4" />{" "}
        {/* Sign In button */}
        <Skeleton className="h-5 w-2/3 mx-auto mt-4" />{" "}
        {/* Forgot password text */}
        <Skeleton className="h-5 w-2/3 mx-auto" /> {/* Sign up text */}
      </div>
    </div>
  );
}
