"use client";
//hello
import { useLoads } from "@/hooks/useLoads";
import { getColumns } from "@/app/loads/columns";
import { DataTable } from "@/app/loads/data-table";
import { LoadCombined } from "@/types/load";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
export default function LoadsPage() {
  const { user } = useAuth();
  const { loads, isLoading, error } = useLoads();
  const router = useRouter();

  const MemoizedColumns = useMemo(
    () => getColumns(user as User, router),
    [user, router]
  );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#111a2e]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10 w-full">
      <DataTable columns={MemoizedColumns} data={loads as LoadCombined[]} />
    </div>
  );
}
