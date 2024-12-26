"use client";

import { useEffect, useState } from "react";
import { useLoads } from "@/hooks/useLoads";
import { Load } from "@/types/load";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FiArrowLeft, FiEdit2, FiTruck, FiInfo } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBids } from "@/hooks/useBids";
import { User } from "@/types/auth";
import BidsContainer from "@/components/bids/bidsContainer";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { TripCalculatorRes } from "@/components/ui/TripCalculatorRes";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <div className="flex justify-center items-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen rounded-lg my-4 bg-background">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-transparent">
        <Button variant="outline1" onClick={() => router.push("/loads")}>
          <FiArrowLeft className="mr-2" /> Back to Loads
        </Button>
        {user?.role === "admin" || user?.id === load?.broker_id ? (
          <Button
            variant="default"
            onClick={() => router.push(`/dashboard/loads/${load.id}/edit`)}
            className="text-white"
          >
            <FiEdit2 className="mr-2" /> Edit Load
          </Button>
        ) : null}
      </div>

      {/* Load Status Banner */}
      <section className="bg-card border border-border px-6 py-4 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FiTruck className="text-2xl text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Load #{load.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">{load.load_type_name}</p>
          </div>
        </div>
        <div className="bg-card px-4 py-2 rounded-full">
          <span className="text-foreground font-semibold">
            {load.load_status}
          </span>
        </div>
      </section>
      {/* Load Info & Pricing */}
      <section className="LoadInfoPricing flex justify-between w-full gap-8">
        {/* Basic Load Information */}
        <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Cargo Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Dimensions
                </label>
                <p className="text-muted-foreground">
                  {load.dimensions?.length}m × {load.dimensions?.width}m ×{" "}
                  {load.dimensions?.height}m
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Weight
                </label>
                <p className="text-muted-foreground">{load.weight_kg} kg</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Temperature Controlled
                </label>
                <p className="text-muted-foreground">
                  {load.temperature_controlled ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Equipment Required
                </label>
                <p className="text-muted-foreground">
                  {load.equipment_required_name || "N/A"}
                </p>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Truck Type Required
                </label>
                <p className="text-muted-foreground">
                  {load.truck_type_required || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Details */}
        <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg mb-6 w-1/2">
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Pricing Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Budget
                </label>
                <p className="text-muted-foreground">
                  {load.budget_amount} {load.budget_currency}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Bidding Status
                </label>
                <p className="text-muted-foreground">
                  {load.bid_enabled ? "Open for Bidding" : "Fixed Rate"}
                </p>
              </div>
            </div>
            {load.bid_enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sidebar-ring">
                    Bidding Deadline
                  </label>
                  <p className="text-muted-foreground">
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
        <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg mb-6 w-2/3">
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Route Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Pickup Location
                </label>
                <p className="text-muted-foreground">
                  {load.pickup_location.address}
                </p>
                <p className="text-muted-foreground">
                  {load.pickup_location.city}, {load.pickup_location.state}{" "}
                </p>
                <p className="text-muted-foreground">
                  {load.pickup_location.zip}
                </p>
                <p className="text-sm text-sidebar-ring mt-1">
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
                <label className="block text-sm font-medium text-sidebar-ring">
                  Delivery Location
                </label>
                <p className="text-muted-foreground">
                  {load.delivery_location.address}
                </p>
                <p className="text-muted-foreground">
                  {load.delivery_location.city}, {load.delivery_location.state}{" "}
                </p>
                <p className="text-muted-foreground">
                  {load.delivery_location.zip}
                </p>
                <p className="text-sm text-sidebar-ring mt-1">
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
              <label className="block text-sm font-medium text-sidebar-ring">
                Distance
              </label>
              <p className="text-muted-foreground">{load.distance_km} km</p>
            </div>
          </div>
        </section>
        <div className="flex w-1/3 gap-8">
          {/* Contact Information */}
          <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg mb-6 w-full">
            <h2 className="text-lg font-semibold mb-4 text-primary">
              Contact Information
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Contact Name
                </label>
                <p className="text-muted-foreground">{load.contact_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Phone
                </label>
                <p className="text-muted-foreground">{load.contact_phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-sidebar-ring">
                  Email
                </label>
                <p className="text-muted-foreground">{load.contact_email}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* Special Instructions */}

      <section className="flex justify-between w-full gap-8">
        <div className="flex w-full gap-8">
          <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg mb-6 w-full">
            <h2 className="text-lg font-semibold mb-4 text-primary">
              Special Instructions
            </h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {load.special_instructions || "No special instructions provided"}
            </p>
          </section>
        </div>
      </section>
      {load?.bid_enabled && (
        <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg relative">
          <span className="flex justify-between items-center w-3/4  mb-4">
            <h2 className="text-lg font-semibold text-primary">Bids</h2>
            <div className="absolute bottom-0 top-4 right-44 h-fit">
              <TripCalculatorRes />
            </div>
            {user?.role === "admin" || user?.id === load?.broker_id ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <FiInfo className="text-primary" size={24} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white">
                      Only one bid can be accepted at a time!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </span>
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
                bidActions={{
                  acceptBid,
                  rejectBid,
                  deleteBid,
                  undoBidStatus,
                }}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
