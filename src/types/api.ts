export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface LoadResponse {
  load: {
    id: string;
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
    status: 'posted' | 'in_progress' | 'completed' | 'cancelled';
    broker_id: string;
    created_at: string;
    updated_at: string;
  };
} 