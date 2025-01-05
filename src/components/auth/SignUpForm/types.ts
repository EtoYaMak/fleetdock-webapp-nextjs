export interface FormData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  phone: string;
  membership_tier: string;
  membership_status: string;
  stripe_customer_id: string;
  subscription_id: string;
  subscription_end_date: string;
  selectedTier: "starter" | "professional" | "enterprise";
}

export type SignUpStep = 'role-selection' | 'details';
export type StageErrors = string[];

export interface FormStage {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  validate: (data: FormData) => boolean | string;
} 