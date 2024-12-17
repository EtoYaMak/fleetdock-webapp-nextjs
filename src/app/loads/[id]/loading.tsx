import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full p-4">
      <Skeleton className="rounded-md" />
    </div>
  );
}
