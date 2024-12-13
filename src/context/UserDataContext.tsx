"use client";
import { createContext, useContext } from "react";
import { User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
const UserDataContext = createContext<User | null>(null);

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  //  const brokerData = user?.role === "broker" ? useBroker() : null;

  if (!user) return null;
  if (loading) return null;
  return (
    <UserDataContext.Provider value={user as User}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
