export interface BrokerBusiness {
  id: string; // UUID
  profile_id?: string; // UUID
  business_license_number: string; // Text
  business_license_expiry: Date; // Date
  tax_id?: string; // Text
  business_type?: string; // Text
  year_established?: number; // Integer
  insurance_policy_number?: string; // Text
  insurance_expiry?: Date; // Date
  verification_status?: string; // Text
  verification_date?: Date; // Timestamp
  created_at?: Date; // Timestamp
  updated_at?: Date; // Timestamp
}

export interface BrokerDetail {
  id: string; // UUID
  profile_id: string; // UUID
  company_name: string; // Text
  license_number: string; // Text
  location?: object; // JSONB
  business_details?: object; // JSONB
  verification_status?: string; // Text
  created_at?: Date; // Timestamp
  updated_at?: Date; // Timestamp
}

//combined type
export type Broker = BrokerBusiness & BrokerDetail;
