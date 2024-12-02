"use client";

import { useState, useEffect } from "react";
import { Load } from "@/types/load";
import { Bid, BidStatus } from "@/types/bids";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { use } from "react";
import { LoadType } from "@/types/load-type";
import BidsList from "../../components/BidsList";

export default function ViewLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [load, setLoad] = useState<Load | null>(null);
  const [loadTypes, setLoadTypes] = useState<Record<string, string>>({});
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch load, load types, and bids in parallel
        const [loadResponse, typeResponse, bidsResponse] = await Promise.all([
          fetch(`/api/loads/${resolvedParams.id}`),
          fetch(`/api/load-types`),
          fetch(`/api/bids?load_id=${resolvedParams.id}`),
        ]);

        // Handle load data
        const loadData = await loadResponse.json();
        if (!loadResponse.ok) throw new Error(loadData.error);
        if (!loadData.data?.load) throw new Error("Load data is missing");
        setLoad(loadData.data.load);

        // Handle load types data
        const typeData = await typeResponse.json();
        if (!typeResponse.ok) throw new Error(typeData.error);
        const typeMap = typeData.loadTypes.reduce(
          (acc: Record<string, string>, type: LoadType) => {
            acc[type.id] = type.name;
            return acc;
          },
          {}
        );
        setLoadTypes(typeMap);

        // Handle bids data
        const bidsData = await bidsResponse.json();
        if (!bidsResponse.ok) throw new Error(bidsData.error);
        setBids(bidsData.bids || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleUpdateBidStatus = async (bidId: string, status: BidStatus) => {
    try {
      const response = await fetch(`/api/bids/${bidId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bid_status: status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update bid status");
      }

      // Refresh bids after update
      const updatedBids = bids.map((bid) =>
        bid.id === bidId ? { ...bid, bid_status: status } : bid
      );
      setBids(updatedBids);
    } catch (error) {
      console.error("Error updating bid status:", error);
      // Optionally show error to user via toast or alert
    }
  };

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
            href="/dashboard/broker"
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

          <div className="px-4 py-5 sm:p-6">
            {bids.length > 0 ? (
              <BidsList bids={bids} onUpdateBidStatus={handleUpdateBidStatus} />
            ) : (
              <p className="text-gray-500 text-center py-4">
                No bids have been placed on this load yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
