"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Memoize static components
const FormIcon = function FormIcon({ icon: Icon }: { icon: typeof FiMail }) {
  return <Icon className="text-primary" />;
};

// Memoize form input component
const FormInput = function FormInput({
  id,
  type,
  name,
  placeholder,
  autoComplete,
  autoFocus,
  value,
  onChange,
  icon: Icon,
  disabled,
}: {
  id: string;
  type: string;
  name: string;
  placeholder: string;
  autoComplete: string;
  autoFocus: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: typeof FiMail;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <FormIcon icon={Icon} />
        <label htmlFor={id} className="text-sm font-medium">
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
        className="bg-input w-full px-4 py-3 rounded-lg "
        required
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        const result = await signIn(formData);
        if (result?.success) {
          toast({
            title: "Sign In Successful",
            description: "You are now signed in.",
            variant: "success",
          });
          router.push(`/loads`);
        } else if (result?.error) {
          toast({
            title: "Sign In Failed",
            description: result.error,
            variant: "destructive",
          });
          setError(result.error);
        }
      } catch (error) {
        toast({
          title: "Sign In Failed",
          description:
            error instanceof Error ? error.message : "Failed to sign in",
          variant: "destructive",
        });
        setError(error instanceof Error ? error.message : "Failed to sign in");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, signIn, router, toast]
  );

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  // Memoize form inputs
  const formInputs = useMemo(
    () => [
      {
        id: "email",
        type: "email",
        name: "email",
        autoComplete: "email",
        autoFocus: true,
        placeholder: "Enter your email",
        icon: FiMail,
        value: formData.email,
      },
      {
        id: "password",
        type: isPasswordVisible ? "text" : "password",
        name: "password",
        autoComplete: "current-password",
        autoFocus: false,
        placeholder: "Enter your password",
        icon: FiLock,
        value: formData.password,
      },
    ],
    [formData.email, formData.password, isPasswordVisible]
  );

  return (
    <div className="min-h-screen w-full min-w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary "
          >
            Welcome Back
          </motion.h1>
          <p className="mt-2">Sign in to your account</p>
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
                <div key={input.id} className="relative">
                  <FormInput
                    {...input}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {input.name === "password" && (
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-3 text-sm text-muted-foreground"
                    >
                      {isPasswordVisible ? (
                        <FiEyeOff size={24} />
                      ) : (
                        <FiEye size={24} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {error && <ErrorMessage message={error} />}

          <div className="flex items-center justify-between">
            <a
              href="/forgot-password"
              className="text-sm hover:text-secondary-foreground text-muted-foreground"
            >
              Forgot password?
            </a>
          </div>
          <span className="flex items-center justify-center">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </span>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="hover:text-primary transition-colors duration-200 underline decoration-2 underline-offset-2 decoration-primary/50"
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
