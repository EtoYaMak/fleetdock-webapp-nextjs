import { VehicleWithType } from "@/types/vehicles";
import { TableCell } from "@/components/ui/table";

interface VehicleInfoCellProps {
  vehicle: VehicleWithType;
}

export function VehicleInfoCell({ vehicle }: VehicleInfoCellProps) {
  return (
    <TableCell>
      <div className="flex flex-col">
        <span className="font-medium">
          {vehicle.manufacturer} {vehicle.model} ({vehicle.year})
        </span>
        <span className="text-sm text-muted-foreground">
          {vehicle.license_plate}
        </span>
        <span className="text-xs text-muted-foreground">
          Type: {vehicle.vehicle_type?.name} - {vehicle.vehicle_type?.capacity}t
        </span>
      </div>
    </TableCell>
  );
} 