"use client";

import { useState, useEffect, memo, Suspense, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoadForm from "@/app/dashboard/components/broker/components/LoadForm";
import { LoadFormData, Load } from "@/types/loads";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useLoads } from "@/hooks/useLoads";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

function EditLoad({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const { loads, isLoading, error } = useLoads();
  const [load, setLoad] = useState<Load | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  const loadId = useMemo(async () => (await params).id, [params]);

  useEffect(() => {
    const fetchLoadById = async () => {
      if (!loads.length) return;
      
      const id = await loadId;
      const foundLoad = loads.find(load => load.id === id);
      
      if (!load || (foundLoad && foundLoad.id !== load.id)) {
        setLoad(foundLoad || null);
      }
      setIsFetching(false);
    };

    fetchLoadById();
  }, [loads, loadId, load]);

  const handleSubmit = useCallback(async (data: LoadFormData) => {
    try {
      delete data.load_type_name;
      const { error } = await supabase
        .from("loads")
        .update(data)
        .eq("id", load?.id);
      
      if (error) throw error;
      router.push(`/dashboard/loads/${load?.id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update load",
      };
    }
  }, [load?.id, router]);

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
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <div className="min-h-screen bg-[#203152] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-[#f1f0f3] bg-[#4895d0]/80 rounded-md px-4 py-2 hover:bg-[#4895d0] hover:scale-[102%] transition-all duration-300"
            >
              <FiArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
          </div>

          <div className="bg-[#f1f0f3] shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-[#4895d0] bg-[#4895d0] rounded-b-none rounded-lg">
              <h3 className="text-lg leading-6 font-medium text-[#f1f0f3]">
                Edit Load
              </h3>
              <p className="mt-1 text-sm text-[#f1f0f3]">
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
    </Suspense>
  );
}

export default memo(EditLoad);
