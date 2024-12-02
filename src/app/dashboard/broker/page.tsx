"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiPackage, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { useLoads } from "@/hooks/useLoads";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { createClient } from "@/utils/supabase/client";
import LoadsTable from "./components/LoadsTable";
import { useLoadTypesContext } from '@/context/LoadTypesContext';

export default function BrokerDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const { isBroker } = useRole();
  const { loads, isLoading, error, stats, deleteLoad, refreshLoads } =
    useLoads();
  const { loadTypes, isLoading: loadTypesLoading } = useLoadTypesContext();

  // Set up real-time subscriptions
  useEffect(() => {
    const supabase = createClient();

    // Subscribe to loads table changes
    const loadsSubscription = supabase
      .channel("loads_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loads",
          filter: `broker_id=eq.${profile?.id}`,
        },
        () => {
          refreshLoads();
        }
      )
      .subscribe();

    // Subscribe to bids table changes
    const bidsSubscription = supabase
      .channel("bids_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
          filter: `load.broker_id=eq.${profile?.id}`,
        },
        () => {
          refreshLoads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(loadsSubscription);
      supabase.removeChannel(bidsSubscription);
    };
  }, [profile?.id, refreshLoads]);

  const handleDelete = useCallback(
    async (loadId: string) => {
      const result = await deleteLoad(loadId);
      if (!result.success) {
        console.error(result.error);
      }
    },
    [deleteLoad]
  );

  const handleEdit = useCallback(
    (loadId: string) => {
      router.push(`/dashboard/broker/loads/${loadId}/edit`);
    },
    [router]
  );

  const handleView = useCallback(
    (loadId: string) => {
      router.push(`/dashboard/broker/loads/${loadId}`);
    },
    [router]
  );

  const isPageLoading = isLoading || loadTypesLoading;

  if (!profile || !isBroker) return null;

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
            loadTypes={loadTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>
    </div>
  );
}
