"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full">
      <span className="flex justify-end mt-10 pr-10">
        <Skeleton className="h-8 w-44 mb-12 rounded-md" />
      </span>
      <span className="flex flex-col">
        <Skeleton className="h-10  mb-10 rounded-md" />
        <Skeleton className="h-10  mb-10 rounded-md" />
        <Skeleton className="h-10  mb-10 rounded-md" />
        <Skeleton className="h-10  mb-10 rounded-md" />
        <Skeleton className="h-10  mb-10 rounded-md" />
        <Skeleton className="h-10  mb-10 rounded-md" />
        <Skeleton className="h-10  mb-10 rounded-md" />
      </span>
    </div>
  );
}
