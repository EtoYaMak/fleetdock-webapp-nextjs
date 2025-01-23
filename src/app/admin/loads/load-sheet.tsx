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

interface LoadSheetProps {
    load: Load;
    isOpen: boolean;
    onClose: () => void;
}

export function LoadSheet({ load, isOpen, onClose }: LoadSheetProps) {
    const { updateLoad, deleteLoad } = useLoads();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedLoad, setEditedLoad] = useState<Load>(load);

    const handleSave = async () => {
        try {
            await updateLoad(editedLoad);
            toast({
                title: "Load updated successfully",
                variant: "default",
            });
            setIsEditing(false);
        } catch (error) {
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
                                <Input
                                    value={editedLoad.load_type_name}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            load_type_name: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{load.load_type_name}</p>
                            )}
                        </div>

                        <div>
                            <Label>Equipment Required</Label>
                            {isEditing ? (
                                <Input
                                    value={editedLoad.equipment_required_name}
                                    onChange={(e) =>
                                        setEditedLoad({
                                            ...editedLoad,
                                            equipment_required_name: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm">{load.equipment_required_name}</p>
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
