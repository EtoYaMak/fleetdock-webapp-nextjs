"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) redirect("/");
  return <div>{children}</div>;
}
