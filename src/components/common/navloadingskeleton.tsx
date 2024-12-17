"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/common/themeToggle";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-row items-center justify-center gap-6">
      <Skeleton className="h-6 w-20 mx-auto " />
      <Skeleton className="h-6 w-20 mx-auto" />
      <ModeToggle />
    </div>
  );
}
