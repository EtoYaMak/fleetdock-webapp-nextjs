"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { VehicleWithType } from "@/types/vehicles";
import { useVehicles } from "@/context/VehicleContext";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface VehicleSheetProps {
    vehicle: VehicleWithType;
    isOpen: boolean;
    onClose: () => void;
}

export function VehicleSheet({ vehicle, isOpen, onClose }: VehicleSheetProps) {
    const { updateVehicle, deleteVehicle } = useVehicles();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedVehicle, setEditedVehicle] = useState<VehicleWithType>({
        ...vehicle,
        license_plate: vehicle.license_plate || "",
        manufacturer: vehicle.manufacturer || "",
        model: vehicle.model || "",
        year: vehicle.year || 0,
        dimensions: {
            length: vehicle.dimensions.length || 0,
            width: vehicle.dimensions.width || 0,
            height: vehicle.dimensions.height || 0,
        },
    });

    const handleSave = async () => {
        try {
            await updateVehicle(editedVehicle);
            toast({
                title: "Vehicle updated successfully",
                variant: "default",
            });
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error("Error updating vehicle:", error);
            toast({
                title: "Failed to update vehicle",
                description: "Please try again later",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await deleteVehicle(vehicle.id!);
                toast({
                    title: "Vehicle deleted successfully",
                    variant: "default",
                });
                onClose();
            } catch (error) {
                toast({
                    title: "Failed to delete vehicle",
                    description: "Please try again later",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Vehicle Details</SheetTitle>
                    <SheetDescription>
                        View and manage vehicle information
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-end space-x-2">
                        {!isEditing ? (
                            <>
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit
                                </Button>
                                {/*   <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button> */}
                            </>
                        ) : (
                            <>
                                <Button onClick={handleSave}>Save</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditedVehicle(vehicle);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>License Plate</Label>
                            {isEditing ? (
                                <Input
                                    value={editedVehicle.license_plate}
                                    onChange={(e) =>
                                        setEditedVehicle({
                                            ...editedVehicle,
                                            license_plate: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{vehicle.license_plate}</p>
                            )}
                        </div>

                        <div>
                            <Label>Manufacturer</Label>
                            {isEditing ? (
                                <Input
                                    value={editedVehicle.manufacturer}
                                    onChange={(e) =>
                                        setEditedVehicle({
                                            ...editedVehicle,
                                            manufacturer: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{vehicle.manufacturer}</p>
                            )}
                        </div>

                        <div>
                            <Label>Model</Label>
                            {isEditing ? (
                                <Input
                                    value={editedVehicle.model}
                                    onChange={(e) =>
                                        setEditedVehicle({
                                            ...editedVehicle,
                                            model: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{vehicle.model}</p>
                            )}
                        </div>

                        <div>
                            <Label>Year</Label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editedVehicle.year}
                                    onChange={(e) =>
                                        setEditedVehicle({
                                            ...editedVehicle,
                                            year: Number(e.target.value),
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{vehicle.year}</p>
                            )}
                        </div>

                        <div>
                            <Label>Dimensions</Label>
                            {isEditing ? (
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        placeholder="Length"
                                        value={editedVehicle.dimensions.length}
                                        onChange={(e) =>
                                            setEditedVehicle({
                                                ...editedVehicle,
                                                dimensions: {
                                                    ...editedVehicle.dimensions,
                                                    length: Number(e.target.value),
                                                },
                                            })
                                        }
                                    />
                                    <Input
                                        placeholder="Width"
                                        value={editedVehicle.dimensions.width}
                                        onChange={(e) =>
                                            setEditedVehicle({
                                                ...editedVehicle,
                                                dimensions: {
                                                    ...editedVehicle.dimensions,
                                                    width: Number(e.target.value),
                                                },
                                            })
                                        }
                                    />
                                    <Input
                                        placeholder="Height"
                                        value={editedVehicle.dimensions.height}
                                        onChange={(e) =>
                                            setEditedVehicle({
                                                ...editedVehicle,
                                                dimensions: {
                                                    ...editedVehicle.dimensions,
                                                    height: Number(e.target.value),
                                                },
                                            })
                                        }
                                    />
                                </div>
                            ) : (
                                <p className="text-sm">
                                    {`${vehicle.dimensions.length}L × ${vehicle.dimensions.width}W × ${vehicle.dimensions.height}H`}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Verification Status</Label>
                            {isEditing ? (
                                <Select
                                    value={String(editedVehicle.verification_status)}
                                    onValueChange={(value) =>
                                        setEditedVehicle({
                                            ...editedVehicle,
                                            verification_status: value === "true",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Verified</SelectItem>
                                        <SelectItem value="false">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm">
                                    {vehicle.verification_status ? "Verified" : "Pending"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
} 
