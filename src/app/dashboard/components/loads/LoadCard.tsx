import React from "react";
import { Load } from "@/types/load";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoadCard = ({ load }: { load: Load }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/loads/${load.id}`);
  };

  return (
    <div className="p-4 bg-[#1a2b47] rounded-lg shadow-md ">
      <h3 className="text-base font-semibold ">Load #{load.id.slice(0, 8)}</h3>
      <span className="flex justify-between items-center">
        <p className="text-[#f1f0f3] text-sm">{load.load_type_name}</p>
        <p className="text-[#f1f0f3] text-sm">
          Budget: {load.budget_amount} {load.budget_currency}
        </p>
        <Button onClick={handleView} className=" bg-[#4895d0] " size={"sm"}>
          View Details
        </Button>
      </span>
    </div>
  );
};

export default LoadCard;
