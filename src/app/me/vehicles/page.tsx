"use client";
import { memo, useState } from "react";
import VehicleRegisterForm from "@/app/me/vehicles/components/VehicleRegisterForm";
import { VehicleFormData, VehicleWithType } from "@/types/vehicles";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useVehicle } from "@/hooks/useVehicle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiEdit2, FiPlus, FiTrash, FiTruck } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfileSidebar } from "../layout";

const ViewTruckerVehicles = memo(function ViewTruckerVehicles() {
  const {
    vehicles,
    isLoading: vehiclesLoading,
    error: vehiclesError,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicle();
  const { trucker } = useProfileSidebar();
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (data: VehicleWithType | VehicleFormData) => {
    if (selectedVehicle) {
      await updateVehicle(data as VehicleWithType);
    } else {
      await createVehicle(data as VehicleFormData);
    }
    setIsDialogOpen(false);
    setSelectedVehicle(null);
  };

  const handleEdit = (vehicle: VehicleWithType) => {
    setSelectedVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedVehicle(null);
    setIsDialogOpen(true);
  };
  const handleDelete = async (vehicle: VehicleWithType) => {
    await deleteVehicle(vehicle.id as string);
  };

  if (trucker.isLoading || vehiclesLoading) return <LoadingSpinner />;
  if (trucker.error || vehiclesError)
    return (
      <div className="text-red-500">
        Error: {trucker.error || vehiclesError}
      </div>
    );

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className=" p-2 font-semibold leading-none tracking-tight">
          Manage Your Vehicles
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNew}
              variant={"default"}
              className="text-white"
            >
              <FiPlus className="mr-2" /> Add New Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>
                {selectedVehicle ? "Edit Vehicle" : "Register New Vehicle"}
              </DialogTitle>
              <DialogDescription>
                {selectedVehicle
                  ? "Update your vehicle information below"
                  : "Fill in the details to register a new vehicle"}
              </DialogDescription>
            </DialogHeader>
            <VehicleRegisterForm
              initialData={
                selectedVehicle || {
                  trucker_id: trucker.trucker?.id || "",
                  vehicle_type_id: "",
                  license_plate: "",
                  manufacturer: "",
                  model: "",
                  year: new Date().getFullYear(),
                  insurance_expiry: new Date(),
                  last_maintenance_date: new Date(),
                  next_maintenance_date: new Date(),
                  dimensions: { length: 0, width: 0, height: 0 },
                  is_active: true,
                  verification_status: false,
                  verified_at: new Date(),
                }
              }
              onSubmit={handleSubmit}
              isLoading={vehiclesLoading || trucker.isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {vehicles.length === 0 ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary">No Vehicles</CardTitle>
            <CardDescription className="text-muted-foreground">
              You haven't registered any vehicles yet. Add your first vehicle to
              start bidding on loads.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary text-xl">
              Registered Vehicles ({vehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="h-14">
                  <TableHead className="text-primary">Vehicle Type</TableHead>
                  <TableHead className="text-primary">Details</TableHead>
                  <TableHead className="text-primary">Status</TableHead>
                  <TableHead className="text-primary">Insurance</TableHead>
                  <TableHead className="text-primary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center space-x-2">
                        <FiTruck className="text-primary" />
                        <span>{vehicle.vehicle_type.name || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex flex-col gap-4">
                        <span className="font-medium flex gap-2">
                          <span className="bg-primary/10 px-2 py-0.5 rounded">
                            {vehicle?.manufacturer}
                          </span>{" "}
                          <span className="bg-primary/10 px-2 py-0.5 rounded">
                            {vehicle?.model}
                          </span>
                        </span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground ">
                          <span className="bg-primary/10 px-2 py-0.5 rounded">
                            {vehicle?.year}
                          </span>
                          <span className="bg-primary/10 px-2 py-0.5 rounded">
                            {vehicle.license_plate}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={vehicle.is_active ? "outline" : "outline"}
                        className={
                          vehicle.is_active
                            ? "bg-green-500/20 text-green-500 pointer-events-none"
                            : "bg-gray-500/20 text-gray-500 pointer-events-none"
                        }
                      >
                        {vehicle.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="space-y-1">
                        <div>
                          Expires:{" "}
                          {new Date(
                            vehicle.insurance_expiry
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-foreground">
                          Renewal:{" "}
                          {new Date(
                            vehicle.next_maintenance_date
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                        className="hover:bg-primary/20 text-primary hover:text-foreground"
                      >
                        <FiEdit2 className="mr-2" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vehicle)}
                        className="hover:bg-primary/20 text-primary hover:text-foreground"
                      >
                        <FiTrash className="mr-2" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default ViewTruckerVehicles;
