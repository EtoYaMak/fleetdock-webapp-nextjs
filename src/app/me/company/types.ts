export type FormBrokerData = {
  company_name: string;
  license_number: string;
  business_license_number: string;
  business_license_expiry: string; // in YYYY-MM-DD format
  tax_id: string;
  business_type: string;
  year_established: string; // stored as string; will convert to number on submit
  insurance_policy_number: string;
  insurance_expiry: string; // in YYYY-MM-DD format
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  business_details: {
    description: string;
    website: string;
    phone: string;
    email: string;
  };
};
