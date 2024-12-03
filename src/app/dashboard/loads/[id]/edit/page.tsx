"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadForm from "@/app/dashboard/components/broker/components/LoadForm";
import { LoadFormData, Load } from "@/types/loads";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useLoads } from "@/hooks/useLoads";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function EditLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading } = useAuth();
  const { loads, isLoading, error } = useLoads();
  const [load, setLoad] = useState<Load | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLoadById = async () => {
      const { id } = await params;
      const foundLoad = loads.find((load) => load.id === id);
      setLoad(foundLoad || null);
    };

    fetchLoadById();
  }, [loads, params]);

  const handleSubmit = async (data: LoadFormData) => {
    try {
      delete data.load_type_name;
      const { error } = await supabase
        .from("loads")
        .update(data)
        .eq("id", load?.id);
      if (error) throw error;
      //on success to back to /dashboard/broker/loads/[id]
      router.push(`/dashboard/loads/${load?.id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update load",
      };
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !load) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || "Load not found"}
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
              Edit Load
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update the load details
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <LoadForm
              onSubmit={handleSubmit}
              initialData={load as unknown as Partial<LoadFormData>}
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
