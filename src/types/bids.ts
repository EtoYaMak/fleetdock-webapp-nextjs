import { TruckerProfile } from "./profile";

export type Bid = {
  id: string;
  load_id: string;
  trucker_id: string;
  bid_amount: number;
  bid_status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
};

export type BidWithProfile = Bid & {
  trucker_profile: TruckerProfile;
};

interface BidContextType {
  bids: Bid[];
  fetchBids: () => Promise<void>;
}
