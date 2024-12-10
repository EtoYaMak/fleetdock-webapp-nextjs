"use client";

import { useLoads } from "@/hooks/useLoads";
import LoadForm from "../../components/broker/components/LoadForm";
import { Load } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CreateLoad() {
  const { createLoad } = useLoads();
  const { user } = useAuth();

  const handleSubmit = async (data: Load) => {
    const loadData = {
      ...data,
      broker_id: user?.id,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await createLoad(loadData as Load);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#203152] min-h-screen">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-[#4895d0] hover:text-[#4895d0]/80"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-[#1a2b47] shadow rounded-lg border border-[#4895d0]/30">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-[#f1f0f3] mb-6">Create New Load</h1>
          <LoadForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}