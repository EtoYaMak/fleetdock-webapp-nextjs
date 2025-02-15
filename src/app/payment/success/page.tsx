"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SignUpType } from "@/types/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { signUp } = useAuth();
    const hasAttempted = useRef(false);

    const completeSignup = async () => {
        try {
            // Check if already completed
            if (sessionStorage.getItem("signupComplete")) {
                setIsComplete(true);
                setIsLoading(false);
                router.push("/dashboard");
                return;
            }

            // Verify Stripe session
            const sessionId = searchParams.get("session_id");
            if (!sessionId) throw new Error("No session ID found");

            const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`);
            const { data: session, error: stripeError } = await response.json();

            if (stripeError || !session || session.payment_status !== "paid") {
                throw new Error("Payment verification failed");
            }

            // Get stored signup data
            const storedData = sessionStorage.getItem("signupFormData");
            if (!storedData) throw new Error("No signup data found");

            // Create account
            const signupData: SignUpType = {
                ...JSON.parse(storedData),
                stripe_customer_id: session.customer,
                subscription_id: session.subscription,
                membership_status: "active"
            };

            const result = await signUp(signupData);
            if (!result.success) throw new Error(result.error || '');

            // Success cleanup
            sessionStorage.removeItem("signupFormData");
            sessionStorage.setItem("signupComplete", "true");
            setIsComplete(true);

            // Brief delay before redirect
            setTimeout(() => router.push("/dashboard"), 1500);

        } catch (error) {
            console.error("Signup error:", error);
            setError(error instanceof Error ? error.message : "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!hasAttempted.current) {
            hasAttempted.current = true;
            completeSignup();
        }
    }, []); // Empty dependency array since we use the ref to control execution

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Signup Error</CardTitle>
                        <CardDescription>We encountered an error while setting up your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                            <p>{error}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => router.push("/signup")} className="w-full">
                            Try Again
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        {isComplete ? (
                            <CheckCircle2 className="h-5 w-5" />
                        ) : (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        )}
                        <span className="text-sm font-medium">
                            {isComplete ? "Setup Complete" : "Setting Up"}
                        </span>
                    </div>
                    <CardTitle className="text-2xl">
                        {isComplete ? "Welcome to FleetDock!" : "Completing Your Registration"}
                    </CardTitle>
                    <CardDescription>
                        {isComplete
                            ? "Your account has been created successfully. Redirecting to dashboard..."
                            : "Please wait while we set up your account..."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex flex-col items-center py-6">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                            <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 