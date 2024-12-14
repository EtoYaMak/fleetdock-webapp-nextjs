"use client";

import { useState, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Memoize static components
const FormIcon = function FormIcon({ icon: Icon }: { icon: typeof FiMail }) {
  return <Icon className="text-gray-400" />;
};

// Memoize form input component
const FormInput = function FormInput({
  id,
  type,
  name,
  placeholder,
  value,
  onChange,
  icon: Icon,
  disabled,
}: {
  id: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: typeof FiMail;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <FormIcon icon={Icon} />
        <label htmlFor={id} className="text-sm font-medium text-[#f1f0f3]">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </label>
      </div>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-[#203152] w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
        disabled={disabled}
      />
    </div>
  );
};

// Memoize error message component
const ErrorMessage = function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm"
    >
      {message}
    </motion.div>
  );
};

const SignInForm = function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        await signIn(formData);
        router.push(`/loads`);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to sign in");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, signIn, router]
  );

  // Memoize form inputs
  const formInputs = useMemo(
    () => [
      {
        id: "email",
        type: "email",
        name: "email",
        placeholder: "Enter your email",
        icon: FiMail,
        value: formData.email,
      },
      {
        id: "password",
        type: "password",
        name: "password",
        placeholder: "Enter your password",
        icon: FiLock,
        value: formData.password,
      },
    ],
    [formData.email, formData.password]
  );

  return (
    <div className="min-h-screen w-full min-w-full bg-gradient-to-t to-[#111a2e] from-[#17233e]/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#4895d0]/10 backdrop-blur-sm rounded-2xl p-8 
        text-[#f1f0f3] border-2 border-[#f1f0f3]/20 hover:border-[#f1f0f3]/40 transition-all w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#f1f0f3]"
          >
            Welcome Back
          </motion.h1>
          <p className="text-[#f1f0f3] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {formInputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {error && <ErrorMessage message={error} />}

          <div className="flex items-center justify-between">
            <a
              href="/forgot-password"
              className="text-sm text-[#f1f0f3]/90 hover:text-white"
            >
              Forgot password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 bg-[#203152]/80 text-[#f1f0f3]/90 hover:text-white rounded-lg 
              hover:bg-[#203152] focus:outline-none focus:ring-2 focus:ring-[#4895d0]/100 
              focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>

          <div className="text-center text-sm text-[#f1f0f3]">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-[#f1f0f3]/90 font-bold hover:text-white"
            >
              Sign up
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignInForm;
