"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadForm from "../../components/LoadForm";
import { LoadFormData } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function CreateLoad() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: LoadFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      router.push("/dashboard/broker");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create load",
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/broker"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Create New Load
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details for your new load posting
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <LoadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
} 