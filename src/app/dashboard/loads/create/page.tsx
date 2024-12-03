"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadForm from "@/app/dashboard/components/broker/components/LoadForm";
import { LoadFormData } from "@/types/loads";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function CreateLoad() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent, data: LoadFormData) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      delete data.load_type_name;
      const { error } = await supabase.from("loads").insert({
        ...data,
        broker_id: user?.id,
        status: "posted",
      });
      if (error) throw error;
      router.push("/dashboard");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!user || user.role !== "broker") {
    router.push("/unauthorized");
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
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
