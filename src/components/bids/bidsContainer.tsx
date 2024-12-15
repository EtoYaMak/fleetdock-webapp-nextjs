import { Bid } from "@/types/bid";
import { User } from "@/types/auth";
import BidComponent from "@/components/bids/bidComponent";

interface BidsContainerProps {
  bids: Bid[];
  loadId: string;
  isLoadOwner: boolean;
  currentUserId: string;
  currentUser: User;
  bidActions: {
    acceptBid: (id: string) => Promise<void>;
    rejectBid: (id: string) => Promise<void>;
    deleteBid: (id: string) => Promise<void>;
    undoBidStatus: (id: string) => Promise<void>;
  };
}

export default function BidsContainer({
  bids,
  loadId,
  isLoadOwner,
  currentUserId,
  currentUser,
  bidActions,
}: BidsContainerProps) {
  const userHasPlacedBid = bids.some((bid) => bid.trucker_id === currentUserId);

  return (
    <div className="space-y-4">
      {/* Show "Place Bid" button only for truckers who haven't bid yet */}
      {!isLoadOwner && !userHasPlacedBid && (
        <BidComponent
          loadId={loadId}
          bids={bids as Bid[]}
          isLoadOwner={isLoadOwner}
          currentUserId={currentUserId}
          currentUser={currentUser}
          bidActions={bidActions}
        />
      )}
      {/* Show all bids */}
      {bids.map((bid) => (
        <BidComponent
          key={bid.id}
          bid={bid}
          bids={bids as Bid[]}
          loadId={loadId}
          isLoadOwner={isLoadOwner}
          currentUserId={currentUserId}
          currentUser={currentUser}
          bidActions={bidActions}
        />
      ))}
    </div>
  );
}
