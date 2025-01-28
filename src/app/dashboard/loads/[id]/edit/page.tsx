"use client";

import { useEffect, useState } from "react";
import { useLoads } from "@/hooks/useLoads";
import LoadForm from "../../../components/broker/components/LoadForm";
import { Load } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { loads, updateLoad, isLoading } = useLoads();
  const { user } = useAuth();
  const [load, setLoad] = useState<Load | null>(null);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      const currentLoad = loads.find((l) => l.id === id);
      if (currentLoad) {
        setLoad(currentLoad);
      }
    }
  }, [loads, id]);

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
      <div className="flex justify-center items-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      <div className="mb-8">
        <Button variant="outline1" onClick={() => router.back()}>
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
      </div>

      <div className="">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Edit Load</h1>
          <LoadForm onSubmit={handleSubmit} initialData={load} isEdit />
        </div>
      </div>
    </div>
  );
}
