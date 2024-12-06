"use client";

import { useLoads } from "@/hooks/useLoads";
import { columns } from "@/app/loads/columns";
import { DataTable } from "@/app/loads/data-table";

export default function LoadsPage() {
  const { loads, isLoading, error } = useLoads();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={loads || []} />
    </div>
  );
}
