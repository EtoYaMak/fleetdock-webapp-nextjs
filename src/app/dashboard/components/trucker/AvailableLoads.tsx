import React, { memo } from "react";
import { useTruckerDash } from "@/hooks/useTruckerDash";
import LoadCard from "../loads/LoadCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AvailableLoads = () => {
  const { loads, isLoading, error } = useTruckerDash();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        Available Loads ({loads.length})
      </h2>
      <div className="space-y-4">
        {loads.length > 0 ? (
          loads.map((load) => <LoadCard key={load.id} load={load} />)
        ) : (
          <p>No available loads at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default AvailableLoads;
