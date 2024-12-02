"use client";

import { useState, useEffect } from "react";
import { Load } from "@/types/load";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { use } from "react";
import { LoadType } from "@/types/load-type";
import { useRouter } from "next/navigation";
import { Bid } from "@/types/bids";

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
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const router = useRouter();
  const [ownBid, setOwnBid] = useState<Bid | null>(null);
  const [competingBids, setCompetingBids] = useState<Bid[]>([]);

  useEffect(() => {
    const fetchLoadAndBids = async () => {
      try {
        const [loadResponse, typeResponse, bidsResponse] = await Promise.all([
          fetch(`/api/loads/${resolvedParams.id}`),
          fetch(`/api/load-types`),
          fetch(`/api/loads/${resolvedParams.id}/bids`),
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

        const bidsData = await bidsResponse.json();
        if (!bidsResponse.ok) throw new Error(bidsData.error);

        setOwnBid(bidsData.ownBid);
        setCompetingBids(bidsData.competingBids);
      } catch (err) {
        console.error("Error details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadAndBids();
  }, [resolvedParams.id]);

  const handlePlaceBid = async () => {
    if (!load || !load.bid_enabled || load.status !== "posted") {
      setBidError("This load is not available for bidding");
      return;
    }

    setIsSubmitting(true);
    setBidError(null);

    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          load_id: load.id,
          bid_amount: bidAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place bid");
      }

      router.push("/dashboard/trucker/bids");
    } catch (error) {
      console.error("Error placing bid:", error);
      setBidError(
        error instanceof Error ? error.message : "Failed to place bid"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptFixedRate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bids/accept-fixed-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ load_id: load?.id }),
      });

      if (!response.ok) throw new Error("Failed to accept load");
      router.push("/dashboard/trucker/bids");
    } catch (error) {
      console.error("Error accepting load:", error);
    } finally {
      setIsSubmitting(false);
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

            {/* Updated bidding section with better validation */}
            {load.status === "posted" && load.bid_enabled ? (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Place a Bid</h4>
                  {bidError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      {bidError}
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={bidAmount || ""}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-48 rounded-md border-gray-300"
                      placeholder="Enter bid amount"
                      disabled={!load.bid_enabled || load.status !== "posted"}
                    />
                    <button
                      onClick={handlePlaceBid}
                      disabled={
                        isSubmitting ||
                        bidAmount <= 0 ||
                        !load.bid_enabled ||
                        load.status !== "posted"
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Place Bid"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Add Bids Comparison Section */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium mb-4">Bids Overview</h4>

              {ownBid && (
                <div className="mb-6">
                  <h5 className="text-md font-medium text-gray-700 mb-2">
                    Your Bid
                  </h5>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-800">
                      Amount: {ownBid.bid_amount} {load.budget_currency}
                    </p>
                    <p className="text-sm text-blue-600">
                      Submitted:{" "}
                      {new Date(
                        ownBid.created_at ?? Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {competingBids.length > 0 && (
                <div>
                  <h5 className="text-md font-medium text-gray-700 mb-2">
                    Other Bids
                  </h5>
                  <div className="space-y-3">
                    {competingBids.map((bid) => (
                      <div key={bid.id} className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-800">
                          Amount: {bid.bid_amount} {load.budget_currency}
                        </p>
                        <p className="text-sm text-gray-600">
                          Submitted:{" "}
                          {new Date(
                            bid.created_at ?? Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!ownBid && competingBids.length === 0 && (
                <p className="text-gray-500 italic">No bids placed yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
