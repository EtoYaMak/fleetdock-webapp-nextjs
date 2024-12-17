"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-start w-2/3 top-20 absolute h-screen">
      <Skeleton className="h-16 w-2/3 mb-3 rounded-md" /> {/* Title */}
      <Skeleton className="h-10 w-1/2 mb-8 rounded-md" /> {/* Title */}
      <span className="w-full flex justify-between gap-14 ">
        <Skeleton className="h-48 w-1/2 rounded-md" /> {/* Title */}
        <Skeleton className="h-48 w-1/2 rounded-md" /> {/* Title */}
      </span>
    </div>
  );
}
