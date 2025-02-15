"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentFailedPage() {
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            setError(decodeURIComponent(error));
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Payment Failed</span>
                    </div>
                    <CardTitle className="text-2xl">Payment Unsuccessful</CardTitle>
                    <CardDescription>
                        We were unable to process your payment. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Common reasons for payment failure:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                            <li>Insufficient funds</li>
                            <li>Incorrect card details</li>
                            <li>Card expired or invalid</li>
                            <li>Transaction declined by bank</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button
                        onClick={() => router.push("/signup")}
                        className="flex-1"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/contact")}
                        className="flex-1"
                    >
                        Contact Support
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 