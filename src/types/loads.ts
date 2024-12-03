export interface Load {
  id: string;
  broker_id: string;
  pickup_location: {
    address: string;
  };
  delivery_location: {
    address: string;
  };
  distance_manual: number;
  budget_amount: number;
  budget_currency: string;
  weight_kg: number;
  pickup_deadline: string;
  delivery_deadline: string;
  load_type_name: string;
  status:
    | "available"
    | "assigned"
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "posted";
  created_at: string;
  updated_at: string;
  bid_enabled: boolean;
  fixed_rate: number;
}
export interface LoadType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface LoadFormData {
  id?: string;
  load_type_id?: string;
  load_type_name?: string;
  weight_kg: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  pickup_location: { address: string };
  delivery_location: { address: string };
  distance_manual: number;
  pickup_deadline: string;
  delivery_deadline: string;
  budget_amount: number;
  budget_currency: string;
  special_instructions?: string;
  bid_enabled: boolean;
  fixed_rate: number;
}

export interface LoadsTableProps {
  loads: Load[];
  onDelete: (loadId: string) => void;
  onView: (loadId: string) => void;
}

export interface ValidationErrors {
  pickup_location?: string;
  delivery_location?: string;
  weight_kg?: string;
  pickup_deadline?: string;
  delivery_deadline?: string;
  distance_manual?: string;
  budget_amount?: string;
  load_type_name?: string;
  load_type_id?: string;
}
