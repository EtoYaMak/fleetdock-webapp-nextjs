export interface Load {
  id: string; // UUID
  broker_id: string; // UUID
  load_type_id: string; // UUID
  load_type_name?: string; // Text
  temperature_controlled?: boolean; // Boolean
  weight_kg: number; // Numeric
  dimensions?: object; // JSONB
  pickup_location: object; // JSONB
  delivery_location: object; // JSONB
  pickup_date: Date; // Timestamp
  delivery_date: Date; // Timestamp
  distance_km?: number; // Numeric
  special_instructions?: string; // Text
  load_status?: LoadStatus; // Text
  budget_amount?: number; // Numeric
  budget_currency?: string; // Text
  bid_enabled?: boolean | null; // Boolean
  bidding_deadline?: Date | null; // Timestamp
  fixed_rate?: number | null; // Numeric
  equipment_required?: string; // Text
  truck_type_required?: string | null; // Text
  contact_name: string | null; // Text
  contact_phone: string | null; // Text
  contact_email: string | null; // Text
  created_at?: Date; // Timestamp
  updated_at?: Date; // Timestamp
}

export enum LoadStatus {
  POSTED = "posted",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

export interface LoadType {
  id: string; // UUID
  name: string; // Text
  description?: string; // Text
  created_at?: Date; // Timestamp
}

export interface Commodity {
  id: string; // UUID
  name: string; // Text
  created_at?: Date; // Timestamp
}

export interface LoadReport {
  id: string; // UUID
  load_id: string; // UUID
  trucker_id: string; // UUID
  issue_type: string; // Text
  description?: string; // Text
  status?: string; // Text
  reported_at?: Date; // Timestamp
  resolved_at?: Date; // Timestamp
}

//combined type
export type LoadCombined = Load & LoadType;