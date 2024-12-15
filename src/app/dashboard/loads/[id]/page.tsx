"use client";

import { useEffect, useState } from "react";
import { useLoads } from "@/hooks/useLoads";
import { Load } from "@/types/load";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FiArrowLeft, FiEdit2, FiTruck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBids } from "@/hooks/useBids";
import { User } from "@/types/auth";
import BidsContainer from "@/components/bids/bidsContainer";
export default function ViewLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { loads, isLoading } = useLoads();
  const { user } = useAuth();
  const [load, setLoad] = useState<Load | null>(null);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  const {
    bids,
    isLoading: bidsLoading,
    acceptBid,
    rejectBid,
    deleteBid,
    undoBidStatus,
  } = useBids(load?.id);
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
  if (isLoading || !load) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#203152]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen rounded-lg my-4 bg-[#111a2e]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-transparent">
        <Button
          variant="secondary"
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-sm text-[#111a2e] hover:text-[#f1f0f3]/80 hover:bg-[#111a2e] transition-all duration-100 border-r-2 border-b-2 border-[#4895d0] hover:scale-105"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Button>
        {user?.role === "admin" || user?.id === load?.broker_id ? (
          <Button
            onClick={() => router.push(`/dashboard/loads/${load.id}/edit`)}
            className="bg-[#4895d0] text-[#f1f0f3] hover:bg-[#4895d0]/90"
          >
            <FiEdit2 className="mr-2" /> Edit Load
          </Button>
        ) : null}
      </div>

      {/* Load Status Banner */}
      <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-6 py-4 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FiTruck className="text-2xl text-[#4895d0]" />
          <div>
            <h1 className="text-2xl font-bold text-[#f1f0f3]">
              Load #{load.id.slice(0, 8)}
            </h1>
            <p className="text-[#4895d0]">{load.load_type_name}</p>
          </div>
        </div>
        <div className="bg-[#203152] px-4 py-2 rounded-full">
          <span className="text-[#f1f0f3] font-semibold">
            {load.load_status}
          </span>
        </div>
      </section>
      {/* Load Info & Pricing */}
      <section className="LoadInfoPricing flex justify-between w-full gap-8">
        {/* Basic Load Information */}
        <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
          <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">
            Cargo Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Dimensions
                </label>
                <p className="text-[#f1f0f3]">
                  {load.dimensions?.length}m × {load.dimensions?.width}m ×{" "}
                  {load.dimensions?.height}m
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Weight
                </label>
                <p className="text-[#f1f0f3]">{load.weight_kg} kg</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Temperature Controlled
                </label>
                <p className="text-[#f1f0f3]">
                  {load.temperature_controlled ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Equipment Required
                </label>
                <p className="text-[#f1f0f3]">
                  {load.equipment_required || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Details */}
        <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
          <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">
            Pricing Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Budget
                </label>
                <p className="text-[#f1f0f3]">
                  {load.budget_amount} {load.budget_currency}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Bidding Status
                </label>
                <p className="text-[#f1f0f3]">
                  {load.bid_enabled ? "Open for Bidding" : "Fixed Rate"}
                </p>
              </div>
            </div>
            {load.bid_enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4895d0]">
                    Bidding Deadline
                  </label>
                  <p className="text-[#f1f0f3]">
                    {load.bidding_deadline
                      ? new Date(load.bidding_deadline).toLocaleDateString()
                      : "No deadline set"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* Location & Schedule & Contact */}
      <section className="LocationContact flex justify-between w-full gap-8">
        {/* Location & Schedule */}
        <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
          <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">
            Route Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Pickup Location
                </label>
                <p className="text-[#f1f0f3]">{load.pickup_location.address}</p>
                <p className="text-[#f1f0f3]">
                  {load.pickup_location.city}, {load.pickup_location.state}{" "}
                </p>
                <p className="text-[#f1f0f3]">{load.pickup_location.zip}</p>
                <p className="text-sm text-[#4895d0] mt-1">
                  {new Date(load.pickup_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Delivery Location
                </label>
                <p className="text-[#f1f0f3]">
                  {load.delivery_location.address}
                </p>
                <p className="text-[#f1f0f3]">
                  {load.delivery_location.city}, {load.delivery_location.state}{" "}
                </p>
                <p className="text-[#f1f0f3]">{load.delivery_location.zip}</p>
                <p className="text-sm text-[#4895d0] mt-1">
                  {new Date(load.delivery_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#4895d0]">
                Distance
              </label>
              <p className="text-[#f1f0f3]">{load.distance_km} km</p>
            </div>
          </div>
        </section>
        <div className="flex w-1/2 gap-8">
          {/* Contact Information */}
          <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
            <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">
              Contact Information
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Contact Name
                </label>
                <p className="text-[#f1f0f3]">{load.contact_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Phone
                </label>
                <p className="text-[#f1f0f3]">{load.contact_phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">
                  Email
                </label>
                <p className="text-[#f1f0f3]">{load.contact_email}</p>
              </div>
            </div>
          </section>
          {/* Special Instructions */}
          <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
            <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">
              Special Instructions
            </h2>
            <p className="text-[#f1f0f3] whitespace-pre-wrap">
              {load.special_instructions || "No special instructions provided"}
            </p>
          </section>
        </div>
      </section>
      {load?.bid_enabled && (
        <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg relative">
          <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">Bids</h2>
          {bidsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-2">
              <BidsContainer
                bids={bids}
                loadId={load.id}
                isLoadOwner={user?.id === load.broker_id}
                currentUserId={user?.id || ""}
                currentUser={user as User}
                bidActions={{ acceptBid, rejectBid, deleteBid, undoBidStatus }}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
