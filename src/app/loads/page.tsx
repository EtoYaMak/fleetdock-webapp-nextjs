"use client";

import { useLoads } from "@/hooks/useLoads";
import { columns } from "@/app/loads/columns";
import { DataTable } from "@/app/loads/data-table";

export default function LoadsPage() {
  const { loads, isLoading, error } = useLoads();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10 w-full">
      <DataTable columns={columns} data={loads || []} />
    </div>
  );
}
