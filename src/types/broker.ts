export interface BrokerBusiness {
  id: string;
  profile_id: string;
  business_license_number: string;
  business_license_expiry: string;
  tax_id?: string;
  business_type?: string;
  year_established?: number;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BrokerProfileData {
  business?: BrokerBusiness;
  isLoading: boolean;
  error?: string;
}

export interface LoadType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Load {
  id: string;
  broker_id: string;
  load_type_id: string;
  status:
    | "posted"
    | "assigned"
    | "in_transit"
    | "delivered"
    | "completed"
    | "cancelled";
  weight_kg?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  pickup_location: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  delivery_location: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pickup_deadline?: string;
  delivery_deadline?: string;
  budget_amount: number;
  budget_currency: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}
