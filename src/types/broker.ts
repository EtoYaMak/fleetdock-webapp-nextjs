import { DocumentMetadata } from "./trucker";

export interface BrokerBusiness {
  id: string;
  profile_id: string;
  company_name: string;
  license_number: string;
  business_license_number: string;
  business_license_expiry: Date;
  tax_id?: string;
  business_type?: string;
  year_established?: number;
  insurance_policy_number?: string;
  insurance_expiry?: Date;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  business_details?: {
    description?: string;
    website?: string;
    phone?: string;
    email?: string;
  };
  verification_status: "pending" | "verified" | "rejected";
  verification_date?: Date;
  insurance_documents: Record<string, DocumentMetadata>;
  permits: Record<string, DocumentMetadata>;
  created_at: Date;
  updated_at: Date;
}

export type BrokerFormData = Partial<
  Omit<BrokerBusiness, "id" | "profile_id" | "created_at" | "updated_at">
>;
