"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadForm from "../../../components/LoadForm";
import { LoadFormData, Load } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { use } from "react";

export default function EditLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [load, setLoad] = useState<Load | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        const response = await fetch(`/api/loads/${resolvedParams.id}`);
        const data = await response.json();

        console.log('Edit Load Response:', data);

        if (!response.ok) throw new Error(data.error);
        
        if (!data.data?.load) {
          throw new Error("Load data is missing");
        }

        setLoad(data.data.load);
      } catch (err) {
        console.error("Error fetching load:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch load");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoad();
  }, [resolvedParams.id]);

  const handleSubmit = async (data: LoadFormData) => {
    try {
      const response = await fetch(`/api/loads/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      router.push("/dashboard/broker");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update load",
      };
    }
  };

  if (isLoading) {
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
