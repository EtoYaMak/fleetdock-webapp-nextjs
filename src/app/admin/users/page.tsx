"use client";

import { useAdmin } from "@/context/AdminContext";
import { DataTable } from "@/app/admin/users/data-table";
import { columns } from "@/app/admin/users/columns";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UsersPage() {
    const { users, loading } = useAdmin();

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto py-10 w-full">
            <DataTable columns={columns} data={users} />
        </div>
    );
}
