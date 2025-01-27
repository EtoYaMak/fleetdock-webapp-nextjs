"use client";

import { useTrucker } from "@/hooks/useTrucker";
import { DocumentMetadata } from "@/types/trucker";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function LicensesPage() {
    const { truckers, isLoading, fetchTrucker } = useTrucker();
    const { toast } = useToast();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const updateVerificationStatus = async (
        truckerId: string,
        docKey: string,
        newStatus: string
    ) => {
        try {
            setUpdatingId(`${truckerId}-${docKey}`);
            const trucker = truckers.find(t => t.id === truckerId);
            if (!trucker) return;

            const updatedLicenses = {
                ...trucker.licenses,
                [docKey]: {
                    ...trucker.licenses[docKey],
                    verification_status: newStatus
                }
            };

            const { error } = await supabase
                .from("trucker_details")
                .update({ licenses: updatedLicenses })
                .eq("id", truckerId);

            if (error) throw error;

            toast({
                title: "Status updated",
                description: "Document verification status has been updated successfully",
            });

            // Refresh the data
            fetchTrucker();
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "Failed to update verification status",
                variant: "destructive",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Trucker Licenses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {truckers.map((trucker) => (
                    Object.entries(trucker.licenses || {}).map(([key, doc]) => (
                        <Card key={`${trucker.id}-${key}`}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {doc.name}
                                </CardTitle>
                                <CardDescription>
                                    Uploaded: {format(new Date(doc.uploadedAt), "PPP")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                            ${doc.verification_status === "verified" ? "bg-green-500 text-white" :
                                                doc.verification_status === "pending" ? "bg-yellow-500 text-white" :
                                                    "bg-red-500 text-white"}`}>
                                            {doc.verification_status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(doc.url, "_blank")}
                                        >
                                            View Document
                                        </Button>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline">
                                                    Update Status
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40">
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        disabled={updatingId === `${trucker.id}-${key}`}
                                                        onClick={() => updateVerificationStatus(trucker.id, key, "verified")}
                                                        className="justify-start"
                                                    >
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        disabled={updatingId === `${trucker.id}-${key}`}
                                                        onClick={() => updateVerificationStatus(trucker.id, key, "rejected")}
                                                        className="justify-start"
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        disabled={updatingId === `${trucker.id}-${key}`}
                                                        onClick={() => updateVerificationStatus(trucker.id, key, "pending")}
                                                        className="justify-start"
                                                    >
                                                        Mark Pending
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ))}
            </div>
        </div>
    );
}
