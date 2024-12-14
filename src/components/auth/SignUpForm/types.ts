export interface FormData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  phone: string;
}

export type SignUpStep = 'role-selection' | 'details';
export type StageErrors = string[];

export interface FormStage {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  validate: (data: FormData) => boolean | string;
} 