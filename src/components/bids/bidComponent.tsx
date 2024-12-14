import { useState } from "react";
import { Bid, NewBid } from "@/types/bid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useBids } from "@/hooks/useBids";
import { User } from "@/types/auth";
import { Load } from "@/types/load";
interface BidComponentProps {
  bid?: Bid;
  load: Load;
  loadId: string;
  isLoadOwner: boolean;
  currentUserId: string;
  currentUser: User;
}

export default function BidComponent({
  bid,
  load,
  loadId,
  isLoadOwner,
  currentUserId,
  currentUser,
}: BidComponentProps) {
  const [bidAmount, setBidAmount] = useState<number>(bid?.bid_amount || 0);
  const [isEditing, setIsEditing] = useState<boolean>(!bid);
  const { toast } = useToast();
  const {
    createBid,
    updateBid,
    acceptBid,
    rejectBid,
    deleteBid,
    undoBidStatus,
  } = useBids();

  const placeholderBid: NewBid = {
    load_id: loadId,
    trucker_id: currentUserId,
    trucker: currentUser,
    bid_amount: 0,
    bid_status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const handleSubmitBid = async () => {
    try {
      // If editing existing bid
      if (bid) {
        // API call to update bid
        //remove trucker_id from bid
        const { trucker, ...bidData } = bid;
        //bidData without trucker; now bidData is just the bid object without the trucker
        await updateBid(bidData.id, { bid_amount: bidAmount });
        toast({
          title: "Bid Updated",
          description: `Your bid of $${bidAmount} has been updated.`,
        });
      } else {
        // API call to create new bid
        await createBid({
          ...placeholderBid,
          bid_amount: bidAmount,
        });
        toast({
          title: "Bid Placed",
          description: `Your bid of $${bidAmount} has been placed.`,
        });
      }
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptBid = async () => {
    try {
      // API call to accept bid
      await acceptBid(bid?.id || "");
      toast({
        title: "Bid Accepted",
        description: `You've accepted the bid of $${bid?.bid_amount}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectBid = async () => {
    try {
      // API call to reject bid
      await rejectBid(bid?.id || "");
      toast({
        title: "Bid Rejected",
        description: `You've rejected the bid of $${bid?.bid_amount}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUndoBidStatus = async () => {
    await undoBidStatus(bid?.id || "");
  };

  const handleDeleteBid = async () => {
    if (!bid?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this bid?"
    );
    if (!confirmed) return;

    try {
      await deleteBid(bid.id);
      // No need for page reload - the useBids hook will handle the state update
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-black";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      className="w-full border-t-0 border-b-3 border-l-0 border-r-3 border-[#111a2e] hover:shadow-md transition-shadow bg-[#4895d0]/80 
    text-[#f1f0f3]
    "
    >
      <div className="p-4">
        {/* Top Row - Status and Actions */}
        <div className="flex items-center justify-between mb-2">
          <Badge
            className={getBidStatusColor(
              !bid ? placeholderBid.bid_status : bid.bid_status
            )}
          >
            {!bid
              ? placeholderBid.bid_status?.toUpperCase()
              : bid.bid_status?.toUpperCase()}
          </Badge>
          <div className="text-sm text-[#f1f0f3]">
            {bid?.created_at
              ? new Date(bid.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  second: "numeric",
                })
              : new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  second: "numeric",
                })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 max-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-mono text-xl font-semibold flex gap-8 w-1/2">
                <span className="text-[#f1f0f3]">
                  {formatCurrency(bidAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isLoadOwner ? (
              bid?.bid_status === "pending" && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleAcceptBid}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRejectBid}
                  >
                    Reject
                  </Button>
                </div>
              )
            ) : (
              <div className="flex gap-1">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleSubmitBid}
                    >
                      {bid ? "Update" : "Submit"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  placeholderBid.bid_status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDeleteBid}
                      >
                        Delete
                      </Button>
                    </>
                  )
                )}
              </div>
            )}
            {bid?.bid_status === "rejected" && (
              <Button size="sm" variant="default" onClick={handleUndoBidStatus}>
                Undo
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
