"use client";

import React, { createContext, useContext } from "react";
import { useLoadTypes } from "@/hooks/useLoadTypes";

interface LoadTypesContextType {
  loadTypes: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

const LoadTypesContext = createContext<LoadTypesContextType>({
  loadTypes: {},
  isLoading: true,
  error: null,
});

export const LoadTypesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loadTypes, isLoading, error } = useLoadTypes();

  return (
    <LoadTypesContext.Provider value={{ loadTypes, isLoading, error }}>
      {children}
    </LoadTypesContext.Provider>
  );
};

export const useLoadTypesContext = () => useContext(LoadTypesContext);
