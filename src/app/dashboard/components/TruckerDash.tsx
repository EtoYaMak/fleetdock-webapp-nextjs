"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import LoadsTable from "@/app/dashboard/components/trucker/components/LoadsTable";
import LoadFilters from "@/app/dashboard/components/trucker/components/LoadFilters";
import { useLoads } from "@/hooks/useLoads";
import { useAuth } from "@/context/AuthContext";
import { Load, LoadType } from "@/types/loads";

export default function TruckerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { loads, isLoading, error } = useLoads();
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [loadTypes, setLoadTypes] = useState<Record<string, string>>({});

  const handleFilters = (filters: {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    pickupLocation?: string;
    deliveryLocation?: string;
  }) => {
    const filtered = loads.filter((load) => {
      if (filters.status && load.status !== filters.status) return false;
      if (filters.minPrice && load.budget_amount < filters.minPrice)
        return false;
      if (filters.maxPrice && load.budget_amount > filters.maxPrice)
        return false;
      if (
        filters.pickupLocation &&
        !load.pickup_location.address
          .toLowerCase()
          .includes(filters.pickupLocation.toLowerCase())
      )
        return false;
      if (
        filters.deliveryLocation &&
        !load.delivery_location.address
          .toLowerCase()
          .includes(filters.deliveryLocation.toLowerCase())
      )
        return false;
      return true;
    });
    setFilteredLoads(filtered);
  };

  if (!user || user.role !== "trucker") return null;

  const handleView = (loadId: string) => {
    router.push(`/dashboard/loads/trucker/${loadId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* When loadtypes not loaded, show filters component + table with headers but a loading spinner in center of table */}
        {/*  <span className="flex justify-center w-full">
          <div className="animate-pulse rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </span> */}

        <LoadFilters onFilterChange={handleFilters} />
        <div className="bg-white shadow rounded-lg">
          <LoadsTable
            loads={[]}
            loadTypes={{}}
            onView={() => {}}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <FiAlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Available Loads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and view available loads
          </p>
        </div>

        <LoadFilters onFilterChange={handleFilters} />

        <div className="bg-white shadow rounded-lg">
          <LoadsTable
            loads={filteredLoads.length > 0 ? filteredLoads : loads}
            loadTypes={loadTypes}
            onView={handleView}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}