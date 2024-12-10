export interface Bid {
  id: string; // UUID
  load_id: string; // UUID
  trucker_id: string; // UUID
  bid_amount: number; // Numeric
  bid_status?: string; // Text
  created_at?: Date; // Timestamp
  updated_at?: Date; // Timestamp
}
