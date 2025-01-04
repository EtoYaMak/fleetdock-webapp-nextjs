import { VehicleWithType } from "@/types/vehicles";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { VehicleInfoCell } from "@/app/me/vehicles/components/VehicleInfoCell";

interface VehiclesListProps {
  vehicles: VehicleWithType[];
  onDelete: (vehicle: VehicleWithType) => Promise<void>;
  onEdit: (vehicle: VehicleWithType) => void;
}

export function VehiclesList({
  vehicles,
  onDelete,
  onEdit,
}: VehiclesListProps) {
  return (
    <div className="rounded-lg border bg-card h-full">
      <Table>
        <TableHeader>
          <TableRow className="p-4">
            <TableHead className="w-[40%]">Vehicle</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[30%]">Insurance & Maintenance</TableHead>
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
                    <span className="text-muted-foreground">Insurance:</span>
                    <span className="font-medium">
                      {new Date(vehicle.insurance_expiry).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Maintenance:</span>
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
                    onClick={() => onEdit(vehicle)}
                    className="h-8 w-8"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(vehicle)}
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
  );
}
