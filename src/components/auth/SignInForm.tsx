"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

export default function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(formData);
      router.push(`/profile`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full min-w-full bg-gradient-to-b to-[#283d67] from-[#203152] flex items-center justify-center p-4">
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
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <FiMail className="text-gray-400" />
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#f1f0f3]"
                  >
                    Email
                  </label>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#203152] w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <FiLock className="text-gray-400" />
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#f1f0f3]"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-[#203152] w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

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
            className="w-full px-6 py-3 bg-[#203152]/80 text-[#f1f0f3]/90 hover:text-white rounded-lg hover:bg-[#203152] focus:outline-none focus:ring-2 focus:ring-[#4895d0]/100 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
}
