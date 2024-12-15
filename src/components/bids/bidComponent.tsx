import { useState, useEffect } from "react";
import { Bid, NewBid } from "@/types/bid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useBids } from "@/hooks/useBids";
import { User } from "@/types/auth";
import { FiDollarSign, FiCheck, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
interface BidComponentProps {
  bid?: Bid;
  bids: Bid[];
  loadId: string;
  isLoadOwner: boolean;
  currentUserId: string;
  currentUser: User;
}

export default function BidComponent({
  bid,
  bids,
  loadId,
  isLoadOwner,
  currentUserId,
  currentUser,
}: BidComponentProps) {
  const [showBidCard, setShowBidCard] = useState(!!bid);
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

  useEffect(() => {
    if (showBidCard) {
      setBidAmount(bid?.bid_amount || 0);
      setIsEditing(!bid);
    }
  }, [showBidCard, bid]);

  const placeholderBid: NewBid = {
    load_id: loadId,
    trucker_id: currentUserId,
    trucker: currentUser,
    bid_amount: 0,
    bid_status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const handleSubmitBid = async () => {
    try {
      // If editing existing bid
      if (bid) {
        // API call to update bid
        await updateBid(bid.id as string, { bid_amount: bidAmount });
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
        variant: "success",
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
    try {
      await undoBidStatus(bid?.id || "");
      toast({
        title: "Bid Status Reset",
        description: "The bid status has been reset to pending.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset bid status. Please try again.",
        variant: "destructive",
      });
    }
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

  const cardVariants = {
    hidden: { opacity: 0, y: -40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const handleCancel = () => {
    if (bid) {
      // If editing an existing bid, just exit edit mode
      setIsEditing(false);
      setBidAmount(bid.bid_amount); // Reset to original amount
    } else {
      // If it's a new bid, hide the card
      setIsEditing(false);
      setBidAmount(0);
      setShowBidCard(false);
    }
  };

  if (!showBidCard && !bid) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Button
          onClick={() => setShowBidCard(true)}
          className="w-full bg-gradient-to-r from-[#4895d0] to-[#2d5f8b] hover:from-[#3784c0] hover:to-[#1d4f7b] text-white font-medium py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
        >
          Place Bid
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {showBidCard && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            {/* Status and DateTime Header */}
            <div className="flex items-center justify-between mb-4">
              <Badge
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bid?.bid_status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : bid?.bid_status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {!bid ? "NEW BID" : bid.bid_status.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">
                {bid?.created_at
                  ? new Date(bid.created_at).toLocaleString()
                  : new Date().toLocaleString()}
              </span>
            </div>

            {/* Bid Amount Section */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="pl-8 h-10 w-40 border-gray-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    ${bidAmount.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isLoadOwner ? (
                  <div className="flex gap-2">
                    {bid?.bid_status === "pending"
                      ? // Show Accept/Reject buttons only if no bid is accepted
                        !bids.some((b) => b.bid_status === "accepted") && (
                          <>
                            <Button
                              onClick={handleAcceptBid}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <FiCheck className="mr-1" /> Accept
                            </Button>
                            <Button
                              onClick={handleRejectBid}
                              variant="destructive"
                            >
                              <FiX className="mr-1" /> Reject
                            </Button>
                          </>
                        )
                      : // Show Undo button for both accepted and rejected bids
                        (bid?.bid_status === "accepted" ||
                          bid?.bid_status === "rejected") && (
                          <Button
                            onClick={handleUndoBidStatus}
                            variant="outline"
                            className="text-[#f1f0f3] bg-[#1a2b47] hover:bg-black hover:text-[#f1f0f3]"
                          >
                            Undo {bid.bid_status}
                          </Button>
                        )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSubmitBid}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {bid ? "Update" : "Submit"}
                        </Button>
                        <Button variant="ghost" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      bid?.trucker_id === currentUserId &&
                      bid?.bid_status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                          >
                            <FiEdit2 className="mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteBid}
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </Button>
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
