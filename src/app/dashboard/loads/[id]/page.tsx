//broker view load page

"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { Load } from "@/types/loads";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { useLoads } from "@/hooks/useLoads";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BidsList from "@/app/dashboard/components/broker/components/BidsList";
import { useBids } from "@/hooks/useBids";

function ViewLoad({ params }: { params: Promise<{ id: string }> }) {
  const { loads, isLoading, error } = useLoads();
  const [load, setLoad] = useState<Load | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { bids, fetchAllBids, isLoading: bidsLoading, placeBid } = useBids();
  const [, setBidsCount] = useState(0);
  const [amount, setAmount] = useState(0);
  //testing
  const fetchLoadById = useCallback(async () => {
    const { id } = await params;
    const foundLoad = loads.find((load) => load.id === id);
    if (foundLoad && foundLoad !== load) {
      setLoad(foundLoad);
    }
  }, [loads, params, load]);

  const fetchBidsCount = useCallback(async () => {
    const { id } = await params;
    await fetchAllBids(id);
    setBidsCount(bids.length);
  }, [params, fetchAllBids, bids.length]);

  useEffect(() => {
    fetchBidsCount();
    fetchLoadById();
  }, [fetchBidsCount, fetchLoadById]);

  const handlePlaceBid = useCallback(
    (loadId: string) => {
      placeBid(loadId, 100);
    },
    [placeBid]
  );
  const handleEdit = useCallback(
    (loadId: string) => {
      router.push(`/dashboard/loads/${loadId}/edit`);
    },
    [router]
  );
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
  if (!user) {
    router.push("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-[#203152] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-[#f1f0f3] bg-[#4895d0]/80 rounded-md px-4 py-2 hover:bg-[#4895d0] hover:scale-[102%] transition-all duration-300"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          {user?.role === "broker" && (
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(load.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#f1f0f3] bg-[#4895d0]/80 hover:bg-[#4895d0] hover:scale-[102%] transition-all duration-300"
              >
                <FiEdit2 className="-ml-1 mr-2 h-5 w-5 text-[#f1f0f3]" />
                Edit Load
              </button>
            </div>
          )}
        </div>

        {/* Load Details */}
        <div className="bg-[#fff] shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-[#4895d0] bg-[#4895d0] rounded-b-none rounded-lg">
            <h3 className="text-lg leading-6 font-medium text-[#f1f0f3]">
              Load Details
            </h3>
            <p className="mt-1 text-sm text-[#f1f0f3]">
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
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {load.status.toUpperCase()}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bids Section */}
        {/* Conditional Render */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bids
            </h3>
            {/* if user is trucker, and has a bid already disabled bid functionlaity and show a sleek and modern looking message informing them */}
            {/*bids.truckerprofile.id === user.id */}
            {user?.role === "trucker" &&
            bids.find((bid) => bid.trucker_id === user?.id) ? (
              <div className="text-sm text-gray-500">
                You have already bid on this load.
              </div>
            ) : (
              <div className="flex items-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-24 mr-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
                <button
                  disabled={!amount}
                  onClick={() => handlePlaceBid(load.id)}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    amount
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Place Bid
                </button>
              </div>
            )}
          </div>
          {!bids.length ? (
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <p className="mt-1 text-sm text-gray-500">No bids yet.</p>
            </div>
          ) : (
            <BidsList bids={bids} loading={bidsLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ViewLoad);
