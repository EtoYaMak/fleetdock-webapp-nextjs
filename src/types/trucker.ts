export interface TruckerDetails {
  id: string;
  profile_id: string;
  certifications: any;
  licenses: any;
  contact_details: any;
  verification_status: string;
}

export type TruckerFormData = Partial<
  Omit<TruckerDetails, "id" | "profile_id" | "created_at" | "updated_at">
>;

export interface TruckerActivityFormData {
  id: string;
  trucker_id: string;
  load_id: string;
  action: string;
  details: any;
}
