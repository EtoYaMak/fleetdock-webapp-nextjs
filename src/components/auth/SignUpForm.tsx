"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMail } from "react-icons/fi";
import RoleSelection from "./SignUpForm/RoleSelection";
import FormStages from "./SignUpForm/FormStages";
import ProgressBar from "./SignUpForm/ProgressBar";
import { SignUpStep, FormStage } from "./SignUpForm/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SignUpType } from "@/types/auth";
import { calculateSubscriptionEndDate } from "@/types/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCheckEmail } from '@/hooks/useCheckEmail';

const SignUpForm = function SignUpForm() {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("details");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Replace useParams with useSearchParams
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const tier = searchParams.get('tier');

  const [formData, setFormData] = useState<SignUpType>({
    email: "",
    password: "",
    username: "",
    full_name: "",
    role: role || "", // Use the query param with fallback
    phone: "",
    membership_tier: tier || "", // Use the query param with fallback
    membership_status: "",
    stripe_customer_id: "",
    subscription_id: "",
    subscription_end_date: calculateSubscriptionEndDate() as string | null,
    selectedTier: (tier as "starter" | "professional" | "enterprise") || "starter",
  });
  const [stageErrors, setStageErrors] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const { emailExists, loading: emailLoading, verifyEmail } = useCheckEmail();
  const [emailChecked, setEmailChecked] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Memoize form stages configuration
  const stages: FormStage[] = useMemo(
    () => [
      {
        title: "Basic Information",
        subtitle: "Let's get you started with the essentials",
        icon: <FiUser className="w-6 h-6" />,
        validate: (data: SignUpType) => {
          if (
            !data.email ||
            !data.password ||
            !data.username ||
            !data.full_name

          ) {
            return "All fields are required";
          }
          if (data.username.length < 3) {
            return "Username must be at least 3 characters";
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(data.email)) {
            return "Please enter a valid email";
          }
          if (data.password.length < 8) {
            return "Password must be at least 8 characters";
          }
          return true;
        },
      },
      {
        title: "Contact Details",
        subtitle: "How can we reach you?",
        icon: <FiMail className="w-6 h-6" />,
        validate: (data: SignUpType) => {
          if (!data.phone) {
            return "Phone number is required";
          }
          return true;
        },
      },
    ],
    []
  );

  const validateCurrentStage = useCallback(() => {
    const result = stages[currentStageIndex].validate(formData);
    if (result !== true) {
      setStageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[currentStageIndex] = result as string;
        return newErrors;
      });
      return false;
    }

    // Check if email exists when validating the first stage
    if (currentStageIndex === 0 && emailExists) {
      setStageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[currentStageIndex] = "This email is already registered";
        return newErrors;
      });
      return false;
    }

    setStageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[currentStageIndex] = "";
      return newErrors;
    });
    return true;
  }, [currentStageIndex, formData, stages, emailExists]);

  const handleSignup = useCallback(async () => {
    if (!validateCurrentStage()) return;
    setError(null);

    try {
      setLoading(true);

      // Store the form data in session storage for later
      const formDataToStore = {
        ...formData,
        // Ensure these fields are included
        email: formData.email,
        password: formData.password,
        username: formData.username,
        full_name: formData.full_name,
        role: formData.role,
        phone: formData.phone,
        tier: formData.selectedTier,
      };

      // Add logging to verify data is being stored
      console.log("Storing signup data:", formDataToStore);
      sessionStorage.setItem("signupFormData", JSON.stringify(formDataToStore));

      // Create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToStore),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (!data.sessionUrl) {
        throw new Error("No checkout URL returned");
      }

      // Redirect to Stripe checkout
      window.location.href = data.sessionUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [validateCurrentStage, formData, toast]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStage()) return;

    // Prevent proceeding if email is still being checked
    if (currentStageIndex === 0 && !emailChecked) {
      setStageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[currentStageIndex] = "Please wait while we verify your email";
        return newErrors;
      });
      return;
    }

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      handleSignup();
    }
  }, [currentStageIndex, stages.length, validateCurrentStage, handleSignup, emailChecked]);

  const handleBack = useCallback(() => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    } else {
      setCurrentStep("role-selection");
    }
  }, [currentStageIndex]);

  const handleRoleSelection = useCallback((selectedRole: string) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    setCurrentStep("details");
  }, []);

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setStageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[currentStageIndex] = "";
        return newErrors;
      });

      // Check email when it changes
      if (name === 'email') {
        setEmailChecked(false);
        if (value && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          verifyEmail(value);
          setEmailChecked(true);
        }
      }
    },
    [currentStageIndex, verifyEmail]
  );
  if (loading) {
    return <LoadingSpinner />
  }
  if (currentStep === "role-selection") {
    return <RoleSelection onRoleSelect={handleRoleSelection} />;
  }

  const currentStage = stages[currentStageIndex];
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <div className="min-h-screen w-full min-w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card ring-1 ring-ring/50 rounded-2xl w-full max-w-md p-8"
      >
        <ProgressBar progress={progress} />

        <div className="mb-8">
          <div className="flex items-center mb-1 text-primary">
            {currentStage.icon}
            <h2 className="text-2xl font-bold ml-2">{currentStage.title}</h2>
          </div>
          <p className="">{currentStage.subtitle}</p>
        </div>

        <FormStages
          currentStageIndex={currentStageIndex}
          formData={formData}
          stageErrors={stageErrors}
          handleInputChange={handleInputChange}
          emailLoading={emailLoading}
          emailExists={emailExists as boolean}

        />

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button type="button" onClick={handleBack} variant="ghost" size="lg">
            Back
          </Button>
          <Button onClick={handleNext} size="lg">
            {currentStageIndex === stages.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;