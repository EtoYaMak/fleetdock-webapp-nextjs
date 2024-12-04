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
  const handleSubmit = async (data: LoadFormData) => {
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
    <div className="min-h-screen bg-[#203152] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto ">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-[#f1f0f3] hover:text-[#f1f0f3] bg-[#4895d0]/80 px-4 py-2 rounded-md hover:bg-[#4895d0] hover:scale-[102%]  ease-in-out transition-colors "
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className=" shadow rounded-lg bg-white">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-[#4895d0]/90 rounded-t-lg">
            <h3 className="text-lg leading-6 font-medium text-[#f1f0f3]">
              Create New Load
            </h3>
            <p className="mt-1 text-sm text-[#f1f0f3]">
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
