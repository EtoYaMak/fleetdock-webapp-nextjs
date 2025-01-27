//map through all the truckers and broker businesses and display the documents
//
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Document Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push("/admin/documents/trucker/certifications")}
                >
                    <CardHeader>
                        <CardTitle>Certifications</CardTitle>
                        <CardDescription>
                            View and manage trucker certifications
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push("/admin/documents/trucker/licenses")}
                >
                    <CardHeader>
                        <CardTitle>Licenses</CardTitle>
                        <CardDescription>
                            View and manage trucker licenses
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
