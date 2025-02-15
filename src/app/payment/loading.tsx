"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">Processing</span>
                    </div>
                    <CardTitle className="text-2xl">Processing Payment</CardTitle>
                    <CardDescription>
                        Please wait while we process your payment...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm text-muted-foreground">
                            This may take a few moments
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 