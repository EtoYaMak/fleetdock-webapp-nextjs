//broker view load page

"use client";

import { useState, useEffect } from "react";
import { Load } from "@/types/loads";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { useLoads } from "@/hooks/useLoads";

export default function ViewLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { loads, isLoading, error } = useLoads();
  const [load, setLoad] = useState<Load | null>(null);

  useEffect(() => {
    const fetchLoadById = async () => {
      const { id } = await params;
      const foundLoad = loads.find((load) => load.id === id);
      setLoad(foundLoad || null);
    };

    fetchLoadById();
  }, [loads, params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !load) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-600 p-4">
            {error || "Load not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <div className="flex space-x-4">
            <Link
              href={`/dashboard/broker/loads/${load.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
            >
              <FiEdit2 className="-ml-1 mr-2 h-5 w-5" />
              Edit Load
            </Link>
          </div>
        </div>

        {/* Load Details */}
        <div className="bg-white shadow rounded-lg mb-8">
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
                  {load.load_type_name}
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

        {/* Bids Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bids
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage bids placed on this load
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
