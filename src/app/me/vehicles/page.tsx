"use client";

import { useProfileSidebar } from "../layout";
import RegisterVehicle from "../components/RegisterVehicle";
import { useVehicle } from "@/hooks/useVehicle";
import { useState } from "react";
import { VehicleFormData, VehicleWithType } from "@/types/vehicles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FiTruck, FiEdit2, FiTrash } from "react-icons/fi";

const VehicleInfoCell = ({ vehicle }: { vehicle: VehicleWithType }) => {
  return (
    <TableCell>
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FiTruck className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-base">
            {vehicle.vehicle_type.name || "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">
            {vehicle.manufacturer} {vehicle.model} • {vehicle.year}
          </div>
          <div className="text-xs text-muted-foreground">
            License: {vehicle.license_plate}
          </div>
        </div>
      </div>
    </TableCell>
  );
};

export default function Vehicles() {
  const { auth } = useProfileSidebar();
  const { createVehicle, vehicles, deleteVehicle } = useVehicle();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithType | null>(null);
  if (!auth.user) {
    return null;
  }
  const handleSubmit = async (data: VehicleFormData) => {
    try {
      setIsLoading(true);
      await createVehicle(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (vehicle: VehicleWithType) => {
    await deleteVehicle(vehicle.id as string);
  };
  const handleEdit = (vehicle: VehicleWithType) => {
    setSelectedVehicle(vehicle);
  };
  if (auth.user?.role === "trucker") {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-primary">
            Registered Vehicles ({vehicles.length})
          </h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(true)}
                disabled={isLoading}
              >
                <span className="hidden sm:inline">Register New Vehicle</span>
                <span className="sm:hidden">Add Vehicle</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Register Vehicle</DialogTitle>
              <RegisterVehicle
                user={auth.user || null}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>

        {vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-xl text-muted-foreground">
                No vehicles registered
              </CardTitle>
              <CardDescription>
                Register your first vehicle to get started
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="p-4">
                  <TableHead className="w-[40%]">Vehicle</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[30%]">
                    Insurance & Maintenance
                  </TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <VehicleInfoCell vehicle={vehicle} />
                    <TableCell>
                      <Badge
                        variant={vehicle.is_active ? "default" : "secondary"}
                        className={`${
                          vehicle.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        } px-3 py-1`}
                      >
                        {vehicle.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Insurance:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              vehicle.insurance_expiry
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Maintenance:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              vehicle.next_maintenance_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(vehicle)}
                          className="h-8 w-8"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <FiTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}
