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
import Loading from "./loading";
export default function LoadsPage() {
  const { user } = useAuth();
  const { loads, isLoading, error } = useLoads();
  const router = useRouter();

  const MemoizedColumns = useMemo(
    () => getColumns(user as User, router),
    [user, router]
  );
  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10 w-full">
      <DataTable columns={MemoizedColumns} data={loads as LoadCombined[]} />
    </div>
  );
}
