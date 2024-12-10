"use client";

import { useEffect, useState } from "react";
import { useLoads } from "@/hooks/useLoads";
import LoadForm from "../../../components/broker/components/LoadForm";
import { Load } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

export default function EditLoad({ params }: { params: { id: string } }) {
  const { loads, updateLoad, isLoading } = useLoads();
  const { user } = useAuth();
  const [load, setLoad] = useState<Load | null>(null);

  useEffect(() => {
    const currentLoad = loads.find((l) => l.id === params.id);
    if (currentLoad) {
      setLoad(currentLoad);
    }
  }, [loads, params.id]);

  const handleSubmit = async (data: Load) => {
    if (load) {
      const updatedLoad = {
        ...data,
        id: load.id,
        broker_id: user?.id,
        updated_at: new Date(),
      };
      await updateLoad(updatedLoad as Load);
    }
  };

  if (isLoading || !load) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#203152]">
        <LoadingSpinner />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-[#f1f0f3] mb-6">Edit Load</h1>
          <LoadForm onSubmit={handleSubmit} initialData={load} isEdit />
        </div>
      </div>
    </div>
  );
}
