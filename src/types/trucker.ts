import { Bid } from "@/types/bid";
import { User } from "@/types/auth";

export type Trucker = {
  trucker: User;
};

export type TruckerWithBid = Trucker & {
  bids: Bid[];
};

export interface ContactDetails {
  work_phone: string;
  personal_phone: string;
  email: string;
}

export interface DocumentMetadata {
  name: string;
  url: string;
  uploadedAt: string;
  verification_status: string;
}

export interface TruckerDetails {
  id: string;
  profile_id: string;
  certifications: Record<string, DocumentMetadata>;
  licenses: Record<string, DocumentMetadata>;
  contact_details: ContactDetails;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export type TruckerFormData = Partial<
  Omit<TruckerDetails, "id" | "created_at" | "updated_at">
>;

export interface TruckerActivityFormData {
  id: string;
  trucker_id: string;
  load_id: string;
  action: string;
  details: any;
}
