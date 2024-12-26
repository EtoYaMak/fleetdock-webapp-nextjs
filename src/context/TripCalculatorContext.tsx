import React, { createContext, useContext, useState } from 'react';

interface TripCosts {
  distance: number;
  mpg: number;
  fuelPrice: number;
  tollCharges: number;
  driverPay: number;
  loadingFees: number;
  unloadingFees: number;
  mealsLodging: number;
  parkingFees: number;
}

interface TripCalculatorContextType {
  costs: TripCosts;
  setCosts: React.Dispatch<React.SetStateAction<TripCosts>>;
  resetFields: () => void;
}

const TripCalculatorContext = createContext<TripCalculatorContextType | undefined>(undefined);

export function TripCalculatorProvider({ children }: { children: React.ReactNode }) {
  const [costs, setCosts] = useState<TripCosts>({
    distance: 0,
    mpg: 0,
    fuelPrice: 0,
    tollCharges: 0,
    driverPay: 0,
    loadingFees: 0,
    unloadingFees: 0,
    mealsLodging: 0,
    parkingFees: 0,
  });

  const resetFields = () => {
    setCosts({
      distance: 0,
      mpg: 0,
      fuelPrice: 0,
      tollCharges: 0,
      driverPay: 0,
      loadingFees: 0,
      unloadingFees: 0,
      mealsLodging: 0,
      parkingFees: 0,
    });
  };

  return (
    <TripCalculatorContext.Provider value={{ costs, setCosts, resetFields }}>
      {children}
    </TripCalculatorContext.Provider>
  );
}

export function useTripCalculator() {
  const context = useContext(TripCalculatorContext);
  if (context === undefined) {
    throw new Error('useTripCalculator must be used within a TripCalculatorProvider');
  }
  return context;
} 