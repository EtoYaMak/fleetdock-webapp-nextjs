"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiTruck, FiPackage } from "react-icons/fi";

type SignUpStep = "role-selection" | "details";

interface FormData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  phone: string;
}

interface FormStage {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  validate: (data: FormData) => boolean | string;
}

export default function SignUpForm() {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("role-selection");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
    full_name: "",
    role: "",
    phone: "",
  });
  const [stageErrors, setStageErrors] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const stages: FormStage[] = [
    {
      title: "Basic Information",
      subtitle: "Let's get you started with the essentials",
      icon: <FiUser className="w-6 h-6" />,
      validate: (data: FormData) => {
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
      validate: (data: FormData) => {
        if (!data.phone) {
          return "Phone number is required";
        }
        return true;
      },
    },
  ];

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

  const handleNext = useCallback(() => {
    if (!validateCurrentStage()) return;

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      handleSignup();
    }
  }, [currentStageIndex, stages.length, validateCurrentStage]);

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

  const handleSignup = async () => {
    if (!validateCurrentStage()) return;
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push("/signin");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (currentStep === "role-selection") {
    return (
      <div className="min-h-screen w-full min-w-full bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center text-white mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Welcome to FleetDock</h1>
            <p className="text-xl opacity-90">Choose your journey</p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelection("trucker")}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border-2 border-white/20 hover:border-white/40 transition-all"
            >
              <FiTruck className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-2xl font-bold mb-2">Trucker</h3>
              <p className="opacity-80">
                Find the perfect loads and maximize your earnings
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelection("broker")}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border-2 border-white/20 hover:border-white/40 transition-all"
            >
              <FiPackage className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-2xl font-bold mb-2">Broker</h3>
              <p className="opacity-80">
                Connect with reliable truckers and manage shipments
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const currentStage = stages[currentStageIndex];
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <div className="min-h-screen w-full min-w-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <div className="mb-8">
          <div className="h-1 w-full bg-gray-200 rounded-full mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-blue-600 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex items-center mb-1">
            {currentStage.icon}
            <h2 className="text-2xl font-bold ml-2">{currentStage.title}</h2>
          </div>
          <p className="text-gray-600">{currentStage.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStageIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentStageIndex === 0 ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {stageErrors[0] && (
                  <p className="text-red-500 text-sm">{stageErrors[0]}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {stageErrors[1] && (
                  <p className="text-red-500 text-sm">{stageErrors[1]}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {currentStageIndex === stages.length - 1 ? "Complete" : "Next"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
