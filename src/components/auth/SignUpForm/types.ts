// src/components/auth/SignUpForm/types.ts

import { SignUpType } from "@/types/auth";

export type SignUpStep = "role-selection" | "details";
export type StageErrors = string[];

export interface FormStage {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  validate: (data: SignUpType) => boolean | string;
}
