"use client";

import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import LoadsTable from "@/app/dashboard/components/broker/components/LoadsTable";
import { useLoads } from "@/hooks/useLoads";
import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";

export default function BrokerDashboard() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const {
    stats,
    loads,
    isLoading: loadsLoading,
    error,
    deleteLoad,
  } = useLoads();

  const handleDelete = useCallback(
    async (loadId: string) => {
      await deleteLoad(loadId);
      if (error) {
        console.error(error);
      }
    },
    [deleteLoad, error]
  );

  const handleCreate = useCallback(() => {
    router.push("/dashboard/loads/create");
  }, [router]);

  const handleView = useCallback(
    (loadId: string) => {
      router.push(`/dashboard/loads/${loadId}`);
    },
    [router]
  );

  if (loadsLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t to-[#283d67] from-[#203152] py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Load Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f0f3]">
              Load Management
            </h1>
            <p className="mt-1 text-sm text-[#f1f0f3]">
              Manage your posted loads and create new ones
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#f1f0f3] bg-[#4895d0]/80 hover:bg-[#4895d0] transition-colors duration-200"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create New Load
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-gradient-to-r to-[#4895d0]/20 from-[#4895d0]/30 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-[#f1f0f3] truncate">
                Total Active Loads
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-[#f1f0f3]">
                {stats.activeLoads}
              </dd>
            </div>
          </div>
          <div className="bg-gradient-to-r to-[#4895d0]/20 from-[#4895d0]/30 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-[#f1f0f3] truncate">
                Pending Assignments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-[#f1f0f3]">
                {stats.pendingAssignments}
              </dd>
            </div>
          </div>
          <div className="bg-gradient-to-r to-[#4895d0]/20 from-[#4895d0]/30 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-[#f1f0f3] truncate">
                Completed Loads
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-[#f1f0f3]">
                {stats.completedLoads}
              </dd>
            </div>
          </div>
        </div>

        {/* Loads Table */}
        <div className="bg-[#4895d0]/10 shadow rounded-lg">
          <LoadsTable
            loads={loads}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>
    </div>
  );
}
