import { useTripCalculator } from "@/context/TripCalculatorContext";
import { useState } from "react";

import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";

interface TripCosts {
  // Load Specific
  distance: number;
  mpg: number;
  fuelPrice: number;
  tollCharges: number;

  // Driver Specific
  driverPay: number;
  loadingFees: number;
  unloadingFees: number;
  mealsLodging: number;
  parkingFees: number;
}

export function TripCostCalculator() {
  const { costs, setCosts, resetFields } = useTripCalculator();

  const handleInputChange = (field: keyof TripCosts, value: string) => {
    setCosts((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const calculateFuelCost = () => {
    if (!costs.distance || !costs.mpg || !costs.fuelPrice || costs.mpg === 0) {
      return 0;
    }
    return (costs.distance / costs.mpg) * costs.fuelPrice;
  };

  const calculateTotalCost = () => {
    const fuelCost = calculateFuelCost();
    return (
      fuelCost +
      (costs.tollCharges || 0) +
      (costs.driverPay || 0) +
      (costs.loadingFees || 0) +
      (costs.unloadingFees || 0) +
      (costs.mealsLodging || 0) +
      (costs.parkingFees || 0)
    );
  };

  return (
    <div className="flex flex-col space-y-6 py-6">
      {/* Reset Button at the top */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={resetFields}
          className="text-white bg-red-500 hover:bg-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset Fields
        </Button>
      </div>

      {/* Main Calculator Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Load Specific Costs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h3 className="font-semibold text-base">Load Specific Costs</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="distance"
                className="text-xs text-muted-foreground"
              >
                Distance
              </Label>
              <Input
                id="distance"
                type="number"
                placeholder="0"
                value={costs.distance || ""}
                onChange={(e) => handleInputChange("distance", e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="mpg" className="text-xs text-muted-foreground">
                MPG/KPG
              </Label>
              <Input
                id="mpg"
                type="number"
                placeholder="0"
                value={costs.mpg || ""}
                onChange={(e) => handleInputChange("mpg", e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label
                htmlFor="fuelPrice"
                className="text-xs text-muted-foreground"
              >
                Fuel Price
              </Label>
              <Input
                id="fuelPrice"
                type="number"
                placeholder="0"
                value={costs.fuelPrice || ""}
                onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label
                htmlFor="tollCharges"
                className="text-xs text-muted-foreground"
              >
                Tolls
              </Label>
              <Input
                id="tollCharges"
                type="number"
                placeholder="0"
                value={costs.tollCharges || ""}
                onChange={(e) =>
                  handleInputChange("tollCharges", e.target.value)
                }
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Driver Specific Costs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h3 className="font-semibold text-base">Driver Specific Costs</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="driverPay"
                className="text-xs text-muted-foreground"
              >
                Driver Pay
              </Label>
              <Input
                id="driverPay"
                type="number"
                placeholder="0"
                value={costs.driverPay || ""}
                onChange={(e) => handleInputChange("driverPay", e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label
                htmlFor="loadingFees"
                className="text-xs text-muted-foreground"
              >
                Loading
              </Label>
              <Input
                id="loadingFees"
                type="number"
                placeholder="0"
                value={costs.loadingFees || ""}
                onChange={(e) =>
                  handleInputChange("loadingFees", e.target.value)
                }
                className="h-9"
              />
            </div>
            <div>
              <Label
                htmlFor="unloadingFees"
                className="text-xs text-muted-foreground"
              >
                Unloading
              </Label>
              <Input
                id="unloadingFees"
                type="number"
                placeholder="0"
                value={costs.unloadingFees || ""}
                onChange={(e) =>
                  handleInputChange("unloadingFees", e.target.value)
                }
                className="h-9"
              />
            </div>
            <div>
              <Label
                htmlFor="mealsLodging"
                className="text-xs text-muted-foreground"
              >
                Meals/Lodge
              </Label>
              <Input
                id="mealsLodging"
                type="number"
                placeholder="0"
                value={costs.mealsLodging || ""}
                onChange={(e) =>
                  handleInputChange("mealsLodging", e.target.value)
                }
                className="h-9"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="parkingFees"
              className="text-xs text-muted-foreground"
            >
              Parking
            </Label>
            <Input
              id="parkingFees"
              type="number"
              placeholder="0"
              value={costs.parkingFees || ""}
              onChange={(e) => handleInputChange("parkingFees", e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Fuel Cost</span>
          <span className="text-2xl font-bold">
            ${calculateFuelCost().toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Total Cost</span>
          <span className="text-2xl font-bold text-primary">
            ${calculateTotalCost().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
