"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Load, LoadStatus } from "@/types/load";
import { useLoads } from "@/hooks/useLoads";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLoadTypes } from "@/hooks/useLoadTypes";
import { useVehiclesTypes } from "@/hooks/useVehicleTypes";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface LoadSheetProps {
    load: Load;
    isOpen: boolean;
    onClose: () => void;
}

export function LoadSheet({ load, isOpen, onClose }: LoadSheetProps) {
    const { updateLoad, deleteLoad } = useLoads();
    const { toast } = useToast();
    const { loadTypes, isLoading: loadTypesLoading } = useLoadTypes();
    const { vehiclesTypes, isLoading: vehiclesTypesLoading } = useVehiclesTypes();
    const [isEditing, setIsEditing] = useState(false);
    const [editedLoad, setEditedLoad] = useState<Load>(load);

    const handleSave = async () => {
        try {
            // Only include fields that are defined in the Load interface
            const loadToUpdate: Partial<Load> = {
                id: editedLoad.id,
                broker_id: editedLoad.broker_id,
                load_type_id: editedLoad.load_type_id,
                temperature_controlled: editedLoad.temperature_controlled,
                weight_kg: editedLoad.weight_kg,
                dimensions: editedLoad.dimensions,
                pickup_location: editedLoad.pickup_location,
                delivery_location: editedLoad.delivery_location,
                pickup_date: editedLoad.pickup_date,
                delivery_date: editedLoad.delivery_date,
                distance_km: editedLoad.distance_km,
                special_instructions: editedLoad.special_instructions,
                load_status: editedLoad.load_status,
                budget_amount: editedLoad.budget_amount,
                budget_currency: editedLoad.budget_currency,
                bid_enabled: editedLoad.bid_enabled,
                bidding_deadline: editedLoad.bidding_deadline,
                fixed_rate: editedLoad.fixed_rate,
                equipment_required: editedLoad.equipment_required,
                truck_type_required: editedLoad.truck_type_required,
                contact_name: editedLoad.contact_name,
                contact_phone: editedLoad.contact_phone,
                contact_email: editedLoad.contact_email
            };

            await updateLoad(loadToUpdate as Load);
            toast({
                title: "Load updated successfully",
                variant: "default",
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating load:", error);
            toast({
                title: "Failed to update load",
                description: "Please try again later",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this load?")) {
            try {
                await deleteLoad(load.id);
                toast({
                    title: "Load deleted successfully",
                    variant: "default",
                });
                onClose();
            } catch (error) {
                toast({
                    title: "Failed to delete load",
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
                    <SheetTitle>Load Details</SheetTitle>
                    <SheetDescription>
                        View and manage load information
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-end space-x-2">
                        {!isEditing ? (
                            <>
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={handleSave}>Save</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditedLoad(load);
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
                            <Label>Load Type</Label>
                            {isEditing ? (
                                <Select
                                    disabled={loadTypesLoading}
                                    value={editedLoad.load_type_id}
                                    onValueChange={(value) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            load_type_id: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select load type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadTypes?.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm">{load.load_type_name}</p>
                            )}
                        </div>

                        <div>
                            <Label>Equipment Required</Label>
                            {isEditing ? (
                                <Select
                                    disabled={vehiclesTypesLoading}
                                    value={editedLoad.equipment_required}
                                    onValueChange={(value) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            equipment_required: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select equipment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehiclesTypes?.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm">{load.equipment_required_name}</p>
                            )}
                        </div>

                        <div>
                            <Label>Truck Type Required</Label>
                            {isEditing ? (
                                <Select
                                    disabled={vehiclesTypesLoading}
                                    value={editedLoad.truck_type_required_name}
                                    onValueChange={(value) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            truck_type_required: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select truck type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehiclesTypes?.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm">{load.truck_type_required}</p>
                            )}
                        </div>

                        <div>
                            <Label>Weight (kg)</Label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editedLoad.weight_kg}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            weight_kg: Number(e.target.value),
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{load.weight_kg}</p>
                            )}
                        </div>

                        <div>
                            <Label>Status</Label>
                            {isEditing ? (
                                <select
                                    value={editedLoad.load_status}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            load_status: e.target.value as LoadStatus,
                                        })
                                    }
                                    className="w-full h-10 rounded-md border border-input px-3"
                                >
                                    {Object.values(LoadStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm capitalize">{load.load_status}</p>
                            )}
                        </div>

                        <div>
                            <Label>Budget Amount</Label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editedLoad.budget_amount}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            budget_amount: Number(e.target.value),
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">
                                    {load.budget_amount
                                        ? `${load.budget_currency || "USD"} ${load.budget_amount}`
                                        : "N/A"}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Budget Currency</Label>
                            {isEditing ? (
                                <Input
                                    value={editedLoad.budget_currency}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            budget_currency: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{load.budget_currency || "USD"}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label>Special Instructions</Label>
                            {isEditing ? (
                                <textarea
                                    className="w-full min-h-[100px] rounded-md border border-input p-3"
                                    value={editedLoad.special_instructions}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            special_instructions: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{load.special_instructions || "N/A"}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label>Pickup Location</Label>
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        placeholder="City"
                                        value={editedLoad.pickup_location.city}
                                        onChange={(e) =>
                                            setEditedLoad({
                                                ...editedLoad,
                                                pickup_location: {
                                                    ...editedLoad.pickup_location,
                                                    city: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                    <Input
                                        placeholder="State"
                                        value={editedLoad.pickup_location.state}
                                        onChange={(e) =>
                                            setEditedLoad({
                                                ...editedLoad,
                                                pickup_location: {
                                                    ...editedLoad.pickup_location,
                                                    state: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            ) : (
                                <p className="text-sm">
                                    {`${load.pickup_location.city}, ${load.pickup_location.state}`}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label>Delivery Location</Label>
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        placeholder="City"
                                        value={editedLoad.delivery_location.city}
                                        onChange={(e) =>
                                            setEditedLoad({
                                                ...editedLoad,
                                                delivery_location: {
                                                    ...editedLoad.delivery_location,
                                                    city: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                    <Input
                                        placeholder="State"
                                        value={editedLoad.delivery_location.state}
                                        onChange={(e) =>
                                            setEditedLoad({
                                                ...editedLoad,
                                                delivery_location: {
                                                    ...editedLoad.delivery_location,
                                                    state: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            ) : (
                                <p className="text-sm">
                                    {`${load.delivery_location.city}, ${load.delivery_location.state}`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
