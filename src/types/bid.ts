import { User } from "@/types/auth";

export type BidStatus = "pending" | "accepted" | "rejected";

export type Bid = {
  id: string;
  load_id: string;
  trucker_id: string;
  trucker: User;
  bid_amount: number;
  bid_status: BidStatus;
  created_at: Date;
  updated_at: Date;
};
export type NewBid = Omit<Bid, "id"> & {
  bid_status?: BidStatus;
};
