import { memo, useState } from "react";
import VehicleRegisterForm from "@/app/profile/components/components/VehicleRegisterForm";
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
import { TruckerDetails } from "@/types/trucker";
const ViewTruckerVehicles = memo(function ViewTruckerVehicles({
  trucker,
  isLoading,
  error,
}: {
  trucker: TruckerDetails;
  isLoading: boolean;
  error: string;
}) {
  const {
    vehicles,
    isLoading: vehiclesLoading,
    error: vehiclesError,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicle();
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

  if (isLoading || vehiclesLoading) return <LoadingSpinner />;
  if (error || vehiclesError)
    return <div className="text-red-500">Error: {error || vehiclesError}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#f1f0f3]">My Vehicles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNew}
              className="bg-[#4895d0] hover:bg-[#4895d0]/90"
            >
              <FiPlus className="mr-2" /> Add New Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]">
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
                  trucker_id: trucker.id,
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
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {vehicles.length === 0 ? (
        <Card className="bg-[#1a2b47] border-[#4895d0]/30">
          <CardHeader>
            <CardTitle className="text-[#f1f0f3]">No Vehicles</CardTitle>
            <CardDescription>
              You haven't registered any vehicles yet. Add your first vehicle to
              start bidding on loads.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-[#1a2b47] border-[#4895d0]/30">
          <CardHeader>
            <CardTitle className="text-[#f1f0f3]">
              Registered Vehicles ({vehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#4895d0]/30">
                  <TableHead className="text-[#4895d0]">Vehicle Type</TableHead>
                  <TableHead className="text-[#4895d0]">Details</TableHead>
                  <TableHead className="text-[#4895d0]">Status</TableHead>
                  <TableHead className="text-[#4895d0]">Insurance</TableHead>
                  <TableHead className="text-[#4895d0]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow
                    key={vehicle.id}
                    className="border-[#4895d0]/30 hover:bg-[#203152]"
                  >
                    <TableCell className="font-medium text-[#f1f0f3]">
                      <div className="flex items-center space-x-2">
                        <FiTruck className="text-[#4895d0]" />
                        <span>{vehicle.vehicle_type.name || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#f1f0f3]">
                      <div className="space-y-1">
                        <div>
                          {vehicle?.manufacturer} {vehicle?.model} (
                          {vehicle?.year})
                        </div>
                        <div className="text-sm text-[#4895d0]">
                          {vehicle.license_plate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={vehicle.is_active ? "default" : "secondary"}
                        className={
                          vehicle.is_active
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-500"
                        }
                      >
                        {vehicle.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#f1f0f3]">
                      <div className="space-y-1">
                        <div>
                          Expires:{" "}
                          {new Date(
                            vehicle.insurance_expiry
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-[#4895d0]">
                          Next Maintenance:{" "}
                          {new Date(
                            vehicle.next_maintenance_date
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                        className="hover:bg-[#4895d0]/20 text-[#4895d0] hover:text-[#f1f0f3]"
                      >
                        <FiEdit2 className="mr-2" /> Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vehicle)}
                        className="hover:bg-[#4895d0]/20 text-[#4895d0] hover:text-red-500"
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
