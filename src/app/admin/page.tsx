"use client";

import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboard() {
    const { users, loading } = useAdmin();
    if (loading) return <LoadingSpinner />;
    if (!users || users.length <= 0) return <div>No users found</div>;
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{users.length}</p>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}