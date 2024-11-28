export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'trucker' | 'broker';
  phone_number?: string;
  company_name?: string;
  created_at: string;
} 