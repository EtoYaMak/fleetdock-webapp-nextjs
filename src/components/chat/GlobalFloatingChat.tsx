"use client"

import { FloatingChat } from "./FloatingChat";
import { useAuth } from "@/context/AuthContext";

export function GlobalFloatingChat() {
  const { user } = useAuth();

  if (!user) return null;

  return <FloatingChat />;
} 