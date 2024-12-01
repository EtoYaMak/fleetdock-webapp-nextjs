"use client";

import { useState, useEffect } from "react";
import { Load } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { use } from "react";
import { LoadType } from "@/types/load-type";

export default function ViewLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [load, setLoad] = useState<Load | null>(null);
  const [loadTypes, setLoadTypes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoadAndType = async () => {
      try {
        const [loadResponse, typeResponse] = await Promise.all([
          fetch(`/api/loads/${resolvedParams.id}`),
          fetch(`/api/load-types`),
        ]);

        const loadData = await loadResponse.json();
        const typeData = await typeResponse.json();

        if (!loadResponse.ok) throw new Error(loadData.error);
        if (!typeResponse.ok) throw new Error(typeData.error);

        const loadDetails = loadData.data?.load;
        if (!loadDetails) {
          throw new Error("Load data is missing");
        }

        setLoad(loadDetails);

        const typeMap = typeData.loadTypes.reduce(
          (acc: Record<string, string>, type: LoadType) => {
            acc[type.id] = type.name;
            return acc;
          },
          {}
        );
        setLoadTypes(typeMap);
      } catch (err) {
        console.error("Error details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadAndType();
  }, [resolvedParams.id]);

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
            href="/dashboard/trucker"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Available Loads
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Load Details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete information about the load
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* Using the same structure as broker view page */}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Pickup Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.pickup_location.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Delivery Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.delivery_location.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Distance (KM)
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.distance_manual}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.budget_amount} {load.budget_currency}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="mt-1 text-sm text-gray-900">{load.weight_kg}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Load Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loadTypes[load.load_type_id] || "Unknown Type"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Pickup Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(load.pickup_deadline).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Delivery Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(load.delivery_deadline).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {load.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
