import { Skeleton } from "@/components/ui/skeleton";

export const ChatLoadingSkeleton = () => {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Simulate 3 messages */}
      <div className="flex justify-start">
        <Skeleton className="h-16 w-2/3 rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-1/2 rounded-lg" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-20 w-3/4 rounded-lg" />
      </div>
      
      {/* Input field skeleton */}
      <div className="mt-auto pt-4">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
};
