"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { SignUpType } from "@/types/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { signUp } = useAuth();

    useEffect(() => {
        // Add check for existing user session
        const isAlreadySignedUp = sessionStorage.getItem("signupComplete");
        if (isAlreadySignedUp) {
            setIsComplete(true);
            setIsLoading(false);
            return;
        }

        const getStoredData = async (retries = 5, delay = 1000): Promise<string> => {
            const storedData = sessionStorage.getItem("signupFormData");
            if (storedData) return storedData;

            if (retries > 0) {
                console.log(`Retrying to get signup data... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return getStoredData(retries - 1, delay);
            }

            throw new Error("Unable to retrieve signup data. Please try the signup process again.");
        };

        const completeSignup = async () => {
            try {
                // 1. Verify session ID first
                const sessionId = searchParams.get("session_id");
                if (!sessionId) {
                    throw new Error("No session ID found in URL. Please try the signup process again.");
                }

                // 2. Get the Stripe session data first
                const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`);
                const { data: session, error: stripeError } = await response.json();

                if (stripeError || !session) {
                    throw new Error("Failed to verify payment status. Please contact support.");
                }

                if (session.payment_status !== "paid") {
                    throw new Error("Payment has not been completed. Please try again or contact support.");
                }

                // 3. Now get the stored form data with retries
                const storedData = await getStoredData();
                const formData: SignUpType = JSON.parse(storedData);

                // 4. Validate customer and subscription data
                if (!session.customer || !session.subscription) {
                    throw new Error("Missing payment details. Please contact support.");
                }

                // 5. Combine form data with Stripe data
                const signupData: SignUpType = {
                    ...formData,
                    stripe_customer_id: session.customer,
                    subscription_id: session.subscription,
                    membership_status: "active",
                };

                // 6. Create the account
                const result = await signUp(signupData);
                if (!result.success) {
                    throw new Error(result.error || "Failed to create account. Please try again.");
                }

                // 7. Clean up and set success
                sessionStorage.removeItem("signupFormData");
                sessionStorage.setItem("signupComplete", "true");
                setIsComplete(true);

                // 8. Wait for database to fully process the new user
                await new Promise(resolve => setTimeout(resolve, 3000));

                // 9. Redirect to dashboard
                router.push("/dashboard");

            } catch (error) {
                console.error("Signup error:", error);
                // If it's an email exists error, redirect to login
                const errorMessage = error instanceof Error ? error.message : "Failed to complete signup";
                if (errorMessage.toLowerCase().includes("email already") ||
                    errorMessage.toLowerCase().includes("email is already registered")) {
                    sessionStorage.removeItem("signupFormData");
                    router.push("/login?error=email_exists");
                    return;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        completeSignup();
    }, [searchParams, router, signUp]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-destructive mb-2">
                            <Loader2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Error</span>
                        </div>
                        <CardTitle className="text-2xl">Signup Error</CardTitle>
                        <CardDescription>
                            We encountered an error while setting up your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
                            <p>{error}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => router.push("/signup")}
                            className="w-full"
                        >
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
                    {isComplete && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Your account is ready! You'll be redirected to your dashboard in a moment.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 