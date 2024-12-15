import React from "react";
import { Bid } from "@/types/bid";
import { Button } from "@/components/ui/button";
import { useBids } from "@/hooks/useBids";

const BidCard = ({ bid }: { bid: Bid }) => {
  const { deleteBid } = useBids();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this bid?")) {
      deleteBid(bid.id as string);
    }
  };

  return (
    <div className="p-4 bg-[#1a2b47] rounded-lg shadow-md flex justify-between items-center w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-[#f1f0f3] text-sm   flex flex-col gap-2 items-center">
          <span className="font-semibold">Load ID</span>
          <span className="text-sm rounded-lg bg-[#fff] h-[45px] text-black p-2 font-medium uppercase flex items-center justify-center">
            {bid.load_id.slice(0, 8)}
          </span>
        </p>
        <p className="text-[#f1f0f3] text-sm   flex flex-col gap-2 items-center">
          <span className="font-semibold">My Bid</span>
          <span className="text-sm rounded-lg bg-[#111] p-2 font-bold h-[45px] flex items-center justify-center">
            {bid.bid_amount} USD
          </span>
        </p>
        <p className="text-[#f1f0f3] text-sm   flex flex-col gap-2 items-center">
          <span className="font-semibold">Status</span>
          <span className="text-[0.8em] rounded-lg bg-[#fff] h-[45px] text-black p-2 font-medium uppercase flex items-center justify-center">
            {bid.bid_status}
          </span>
        </p>
        <div className="flex flex-col items-center justify-center">
          {bid.bid_status == "accepted" ||
          bid.bid_status == "rejected" ? null : (
            <>
              <span className="font-semibold">Status</span>
              <Button
                onClick={handleDelete}
                className="bg-red-600"
                variant="destructive"
                size="lg"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidCard;
