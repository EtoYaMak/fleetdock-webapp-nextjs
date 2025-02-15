"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCanceledPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 mb-2">
                        <XCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Payment Canceled</span>
                    </div>
                    <CardTitle className="text-2xl">Payment Process Canceled</CardTitle>
                    <CardDescription>
                        You've canceled the payment process. No charges have been made to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            What would you like to do next?
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                            <li>Return to signup and try again</li>
                            <li>Contact our support team for assistance</li>
                            <li>Learn more about our pricing plans</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        onClick={() => router.push("/signup")}
                        className="w-full"
                    >
                        Return to Signup
                    </Button>
                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/pricing")}
                            className="flex-1"
                        >
                            View Plans
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/contact")}
                            className="flex-1"
                        >
                            Contact Support
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
} 