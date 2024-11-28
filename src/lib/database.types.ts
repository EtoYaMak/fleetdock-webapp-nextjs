export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          email: string;
          role: string;
          phone: string;
          address: string | null;
          company_name: string | null;
          vehicle_details: JSON | null;
          broker_details: JSON | null;
          profile_picture: string | null;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          // Define insert types if needed
        };
        Update: {
          // Define update types if needed
        };
      };
      // Add other tables as needed
    };
  };
}
