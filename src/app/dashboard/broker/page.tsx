"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import LoadsTable from "./components/LoadsTable";
import { FiAlertCircle, FiPackage, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { useLoads } from "@/hooks/useLoads";
import { useRouter } from "next/navigation";

export default function BrokerDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const { isBroker } = useRole();
  const { loads, isLoading, error, stats, deleteLoad } = useLoads();

  if (!profile || !isBroker) return null;

  const handleDelete = async (loadId: string) => {
    const result = await deleteLoad(loadId);
    if (!result.success) {
      console.error(result.error);
    }
  };

  const handleEdit = (loadId: string) => {
    router.push(`/dashboard/broker/loads/${loadId}/edit`);
  };

  const handleView = (loadId: string) => {
    router.push(`/dashboard/broker/loads/${loadId}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-600 mb-4">
              <FiAlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Loads
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (loads.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No loads</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new load.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/broker/loads/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Create New Load
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Load Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Load Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your posted loads and create new ones
            </p>
          </div>
          <Link
            href="/dashboard/broker/loads/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create New Load
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Active Loads
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.activeLoads}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Pending Assignments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.pendingAssignments}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Completed Loads
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.completedLoads}
              </dd>
            </div>
          </div>
        </div>

        {/* Loads Table */}
        <div className="bg-white shadow rounded-lg">
          <LoadsTable
            loads={loads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>
    </div>
  );
}
