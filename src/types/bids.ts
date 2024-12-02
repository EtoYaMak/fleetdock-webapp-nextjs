import { Load } from "./load";
export type BidStatus = "pending" | "accepted" | "rejected";

export interface Bid {
  id: string; // UUID
  load_id: string; // UUID, references loads table
  trucker_id: string; // UUID, references profiles table
  bid_amount: number; // numeric
  bid_status: BidStatus; // text with default 'pending'
  created_at?: Date; // timestamp with timezone
  updated_at?: Date; // timestamp with timezone
}

export interface BidWithTrucker extends Bid {
  trucker: {
    full_name: string;
    email: string;
  };
}

// For creating new bids (omitting auto-generated fields)
export type CreateBidDTO = Omit<
  Bid,
  "id" | "bid_status" | "created_at" | "updated_at"
>;

// For updating existing bids
export type UpdateBidDTO = Partial<
  Omit<Bid, "id" | "created_at" | "updated_at">
>;

export interface BidWithTrucker extends Bid {
  trucker: {
    full_name: string;
    email: string;
  };
}

export interface BidSummary {
  ownBid: Bid | null;
  competingBids: {
    bid_amount: number;
    created_at: Date;
    bid_status: BidStatus;
  }[];
  totalBids: number;
  lowestBid: number | null;
}
