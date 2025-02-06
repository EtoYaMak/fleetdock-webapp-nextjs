"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMail } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import RoleSelection from "./SignUpForm/RoleSelection";
import FormStages from "./SignUpForm/FormStages";
import ProgressBar from "./SignUpForm/ProgressBar";
import { SignUpStep, FormStage } from "./SignUpForm/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SignUpType } from "@/types/auth";

const SignUpForm = function SignUpForm() {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("role-selection");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [formData, setFormData] = useState<SignUpType>({
    email: "",
    password: "",
    username: "",
    full_name: "",
    role: "",
    phone: "",
    membership_tier: "",
    membership_status: "",
    stripe_customer_id: "",
    subscription_id: "",
    subscription_end_date: null,
    selectedTier: "starter" as "starter" | "professional" | "enterprise",
  });
  const [stageErrors, setStageErrors] = useState<string[]>(["", ""]);

  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { signUp } = useAuth();

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
    setStageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[currentStageIndex] = "";
      return newErrors;
    });
    return true;
  }, [currentStageIndex, formData, stages]);

  const handleSignup = useCallback(async () => {
    if (!validateCurrentStage()) return;
    setError(null);

    try {
      const result = await signUp(formData);
      if (result?.success) {
        toast({
          title: "Sign Up Successful",
          description: "You are now signed up. Please sign in.",
          variant: "success",
        });
        router.push("/signin");
      } else if (result?.error) {
        toast({
          title: "Sign Up Failed",
          description: result.error,
          variant: "destructive",
        });
        setError(result.error);
      }
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }, [validateCurrentStage, formData, router, signUp, toast]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStage()) return;

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      handleSignup();
    }
  }, [currentStageIndex, stages.length, validateCurrentStage, handleSignup]);

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setStageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[currentStageIndex] = "";
        return newErrors;
      });
    },
    [currentStageIndex]
  );

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