//src/types/profile.ts
export interface BrokerProfile {
  id: string;
  profile_id: string;
  business_license_number: string;
  business_license_expiry: string;
  tax_id?: string;
  business_type?: string;
  year_established?: number;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  verification_status: "pending" | "verified" | "rejected";
  verification_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BrokerProfileData {
  business?: BrokerProfile;
  isLoading: boolean;
  error?: string | null;
}
export interface CompanyProfile extends BrokerProfile {
  company_name: string;
}

export interface TruckerProfile {
  id: string;
  name: string;
  phone: string;
  license_number: string;
  license_expiry: string;
}

export interface VehicleProfile extends TruckerProfile {
  id: string;
  vehicle_type_id: string;
  license_plate: string;
  manufacturer: string;
  model: string;
  year: number;
  insurance_expiry: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  is_active: boolean;
}

export interface VehicleType {
  id: string;
  name: string;
  capacity: string;
}
export interface Vehicle {
  id: string;
  profile_id: string;
  vehicle_type_id: string;
  manufacturer: string;
  model: string;
  year: number;
  license_plate: string;
  insurance_expiry: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}
