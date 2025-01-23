/* TODO: Global loads CRUD access for admin */
"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useLoads } from "@/hooks/useLoads";

export default function LoadsPage() {
    const { loads, isLoading } = useLoads();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={loads} />
        </div>
    );
}

