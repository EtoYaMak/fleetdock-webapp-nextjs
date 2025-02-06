"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignUpType } from "@/types/auth";

export default function SignupSuccessPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { signUp } = useAuth();

    useEffect(() => {
        const getStoredData = async (retries = 3, delay = 1000): Promise<string> => {
            const storedData = sessionStorage.getItem("signupFormData");
            if (storedData) return storedData;

            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return getStoredData(retries - 1, delay);
            }

            throw new Error("No signup data found");
        };
        const completeSignup = async () => {
            try {
                // 1. Get the stored form data
                const storedData = await getStoredData();
                if (!storedData) {
                    throw new Error("No signup data found");

                }

                // 2. Get the session ID from URL
                const sessionId = searchParams.get("session_id");
                if (!sessionId) {
                    throw new Error("No session ID found");
                }

                // 3. Get the Stripe session data
                const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`);
                const { data: session, error: stripeError } = await response.json();

                if (stripeError || !session) {
                    throw new Error("Failed to verify payment");
                }

                if (session.payment_status !== "paid") {
                    throw new Error("Payment not completed");
                }

                if (!session.customer || !session.subscription) {
                    throw new Error("Missing customer or subscription data");
                }

                // 4. Combine form data with Stripe data
                const formData: SignUpType = JSON.parse(storedData);
                const signupData: SignUpType = {
                    ...formData,
                    stripe_customer_id: session.customer,
                    subscription_id: session.subscription,
                    membership_status: "active",
                };

                // 5. Create the account
                const result = await signUp(signupData);
                if (!result.success) {
                    throw new Error(result.error || "Failed to create account");
                }

                // 6. Clean up and redirect
                sessionStorage.removeItem("signupFormData");
                router.push("/dashboard");
            } catch (error) {
                console.error("Signup error:", error);
                setError(error instanceof Error ? error.message : "Failed to complete signup");
            } finally {
                setIsLoading(false);
            }
        };

        completeSignup();
    }, [searchParams, router, signUp]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold mb-2">Completing Your Registration</h1>
                <p className="text-muted-foreground">Please wait while we set up your account...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
                    <h2 className="font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
                <Button onClick={() => router.push("/signup")}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to FleetDock!</h1>
            <p className="text-muted-foreground mb-8">Setting up your account...</p>
            <div className="animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    );
} 