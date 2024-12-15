import { Bid } from "@/types/bid";
import { User } from "@/types/auth";
import BidComponent from "@/components/bids/bidComponent";

interface BidsContainerProps {
  bids: Bid[];
  loadId: string;
  isLoadOwner: boolean;
  currentUserId: string;
  currentUser: User;
}

export default function BidsContainer({
  bids,
  loadId,
  isLoadOwner,
  currentUserId,
  currentUser,
}: BidsContainerProps) {
  const userHasPlacedBid = bids.some((bid) => bid.trucker_id === currentUserId);

  return (
    <div className="space-y-4">
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
        />
      ))}

      {/* Show "Place Bid" button only for truckers who haven't bid yet */}
      {!isLoadOwner && !userHasPlacedBid && (
        <BidComponent
          loadId={loadId}
          bids={bids as Bid[]}
          isLoadOwner={isLoadOwner}
          currentUserId={currentUserId}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
