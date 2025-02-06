import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { VehicleWithType } from "@/types/vehicles";

interface VehicleTableProps {
    vehicles: VehicleWithType[];
    onEdit: (vehicle: VehicleWithType) => void;
    onDelete: (vehicle: VehicleWithType) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onDelete }) => {
    return (
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
                                <span>{vehicle.vehicle_type.name || "N/A"}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                            <div className="flex flex-col gap-4">
                                <span className="font-medium flex gap-2">
                                    <span className="bg-primary/10 px-2 py-0.5 rounded">
                                        {vehicle?.manufacturer}
                                    </span>
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
                            <span className={
                                vehicle.verification_status
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                            }>
                                {vehicle.verification_status ? "Verified" : "Unverified"}
                            </span>
                        </TableCell>
                        <TableCell className="text-foreground">
                            <div className="space-y-1">
                                <div>
                                    Expires: {new Date(vehicle.insurance_expiry).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-foreground">
                                    Renewal: {new Date(vehicle.next_maintenance_date).toLocaleDateString()}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(vehicle)}
                                className="hover:bg-primary/20 text-primary hover:text-foreground"
                            >
                                <FiEdit2 className="mr-2" /> Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(vehicle)}
                                className="hover:bg-primary/20 text-primary hover:text-foreground"
                            >
                                <FiTrash className="mr-2" /> Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default VehicleTable; 