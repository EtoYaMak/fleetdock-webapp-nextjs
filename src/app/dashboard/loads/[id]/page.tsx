"use client";

import { useEffect, useState } from "react";
import { useLoads } from "@/hooks/useLoads";
import { Load } from "@/types/load";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { FiArrowLeft, FiEdit2, FiTruck } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ViewLoad({ params }: { params: Promise<{ id: string }> }) {
  const { loads, isLoading } = useLoads();
  const [load, setLoad] = useState<Load | null>(null);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#203152] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-[#4895d0] hover:text-[#4895d0]/80"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <Button
          onClick={() => router.push(`/dashboard/loads/${load.id}/edit`)}
          className="bg-[#4895d0] text-[#f1f0f3] hover:bg-[#4895d0]/90"
        >
          <FiEdit2 className="mr-2" /> Edit Load
        </Button>
      </div>

      {/* Load Status Banner */}
      <div className="bg-[#1a2b47] border border-[#4895d0]/30 px-6 py-4 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FiTruck className="text-2xl text-[#4895d0]" />
          <div>
            <h1 className="text-2xl font-bold text-[#f1f0f3]">Load #{load.id.slice(0, 8)}</h1>
            <p className="text-[#4895d0]">{load.load_type_name}</p>
          </div>
        </div>
        <div className="bg-[#203152] px-4 py-2 rounded-full">
          <span className="text-[#f1f0f3] font-semibold">{load.load_status}</span>
        </div>
      </div>

      {/* Basic Load Information */}
      <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">Cargo Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Dimensions</label>
              <p className="text-[#f1f0f3]">
                {load.dimensions?.length}m × {load.dimensions?.width}m × {load.dimensions?.height}m
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Weight</label>
              <p className="text-[#f1f0f3]">{load.weight_kg} kg</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Temperature Controlled</label>
              <p className="text-[#f1f0f3]">{load.temperature_controlled ? "Yes" : "No"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Equipment Required</label>
              <p className="text-[#f1f0f3]">{load.equipment_required || "N/A"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Schedule */}
      <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">Route Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Pickup Location</label>
              <p className="text-[#f1f0f3]">{load.pickup_location.address}</p>
              <p className="text-[#f1f0f3]">
                {load.pickup_location.city}, {load.pickup_location.state} {load.pickup_location.zip}
              </p>
              <p className="text-sm text-[#4895d0] mt-1">
                {new Date(load.pickup_date).toLocaleDateString()} at{" "}
                {new Date(load.pickup_date).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Delivery Location</label>
              <p className="text-[#f1f0f3]">{load.delivery_location.address}</p>
              <p className="text-[#f1f0f3]">
                {load.delivery_location.city}, {load.delivery_location.state} {load.delivery_location.zip}
              </p>
              <p className="text-sm text-[#4895d0] mt-1">
                {new Date(load.delivery_date).toLocaleDateString()} at{" "}
                {new Date(load.delivery_date).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#4895d0]">Distance</label>
            <p className="text-[#f1f0f3]">{load.distance_km} km</p>
          </div>
        </div>
      </section>

      {/* Pricing Details */}
      <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">Pricing Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Budget</label>
              <p className="text-[#f1f0f3]">
                {load.budget_amount} {load.budget_currency}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4895d0]">Bidding Status</label>
              <p className="text-[#f1f0f3]">{load.bid_enabled ? "Open for Bidding" : "Fixed Rate"}</p>
            </div>
          </div>
          {load.bid_enabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4895d0]">Bidding Deadline</label>
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

      {/* Contact Information */}
      <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4895d0]">Contact Name</label>
            <p className="text-[#f1f0f3]">{load.contact_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4895d0]">Phone</label>
            <p className="text-[#f1f0f3]">{load.contact_phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4895d0]">Email</label>
            <p className="text-[#f1f0f3]">{load.contact_email}</p>
          </div>
        </div>
      </section>

      {/* Special Instructions */}
      <section className="bg-[#1a2b47] border border-[#4895d0]/30 px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-[#f1f0f3]">Special Instructions</h2>
        <p className="text-[#f1f0f3] whitespace-pre-wrap">
          {load.special_instructions || "No special instructions provided"}
        </p>
      </section>
    </div>
  );
}
