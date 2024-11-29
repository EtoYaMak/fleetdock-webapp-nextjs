export interface Load {
  id: string;
  broker_id: string;
  pickup_location: {
    address: string;
  };
  delivery_location: {
    address: string;
  };
  distance: string;
  budget_amount: number;
  budget_currency: string;
  weight_kg: number;
  pickup_deadline: string;
  delivery_deadline: string;
  load_type_id: string;
  status:
    | "available"
    | "assigned"
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface LoadFormData {
  load_type_id: string;
  weight_kg: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  pickup_location: { address: string };
  delivery_location: { address: string };
  pickup_deadline: string;
  delivery_deadline: string;
  budget_amount: number;
  budget_currency: string;
  special_instructions?: string;
}

export interface ValidationErrors {
  pickup_location?: string;
  delivery_location?: string;
  weight_kg?: string;
  pickup_deadline?: string;
  delivery_deadline?: string;
  budget_amount?: string;
  load_type_id?: string;
}
