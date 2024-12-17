"use client";
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <Skeleton className="h-14 w-2/4 mx-auto" />
      <Skeleton className="h-14 w-1/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <Skeleton className="h-6 w-1/3 mx-auto" />
      <Skeleton className="h-12 rounded-full w-[150px] mx-auto" />
    </div>
  );
}
