"use client";

import { VehicleWithType } from "@/types/vehicles";
import { Button } from "@/components/ui/button";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useVehicles } from "@/context/VehicleContext";
import { VehicleSheet } from "./VehicleSheet";
import VehicleTable from "./components/VehicleTable";

// Define columns for the data table
const columns: ColumnDef<VehicleWithType>[] = [
    /*  {
         id: "actions",
         header: "Actions",
         cell: ({ row }) => {
             const vehicle = row.original;
             const { deleteVehicle } = useVehicle();
             const { toast } = useToast();
             const [isOpen, setIsOpen] = useState(false);
 
             const handleDelete = async () => {
                 try {
                     await deleteVehicle(vehicle.id!);
                     toast({
                         title: "Vehicle deleted",
                         description: "Vehicle has been deleted successfully",
                     });
                     setIsOpen(false);
                 } catch (error) {
                     toast({
                         title: "Error",
                         description: "Failed to delete vehicle",
                         variant: "destructive",
                     });
                 }
             };
 
             return (
                 <Popover open={isOpen} onOpenChange={setIsOpen}>
                     <PopoverTrigger asChild>
                         <Button variant="ghost" className="h-8 w-8 p-0">
                             <MoreHorizontal className="h-4 w-4" />
                         </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-28" align="start">
                         <div className="flex flex-col gap-2">
                             <Button
                                 variant="ghost"
                                 className="justify-start"
                                 onClick={() => {
                                     // TODO: Implement edit functionality
                                     setIsOpen(false);
                                 }}
                             >
                                 Edit
                             </Button>
                             <Button
                                 variant="ghost"
                                 className="justify-start text-red-600"
                                 onClick={handleDelete}
                             >
                                 Delete
                             </Button>
                         </div>
                     </PopoverContent>
                 </Popover>
             );
         },
     }, */
    {
        accessorKey: "trucker_id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Trucker ID
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.trucker_id.slice(0, 12),
    },
    {
        id: "trucker_name",
        accessorFn: (row) => row.trucker?.full_name,
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Trucker Name
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "license_plate",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                License Plate
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "vehicle_type.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Vehicle Type
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "manufacturer",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Manufacturer
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "model",
        header: "Model",
    },
    {
        accessorKey: "year",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Year
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "dimensions",
        header: "Dimensions",
        cell: ({ row }) => {
            const dimensions = row.original.dimensions;
            return `${dimensions.length}L × ${dimensions.width}W × ${dimensions.height}H`;
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize text-white
                ${row.original.is_active ? "bg-green-500" : "bg-red-500"}`}>
                {row.original.is_active ? "Active" : "Inactive"}
            </span>
        ),
        filterFn: "equals",
    },
    {
        accessorKey: "verification_status",
        header: "Verification",
        cell: function VerificationCell({ row }) {
            const vehicle = row.original;
            const { updateVehicleVerificationStatus } = useVehicles();
            const [isUpdating, setIsUpdating] = useState(false);
            const { toast } = useToast();

            const handleVerificationChange = async (checked: boolean) => {
                setIsUpdating(true);
                try {
                    await updateVehicleVerificationStatus(vehicle.id!, checked);
                } catch (error) {
                    toast({
                        title: "Error",
                        description: "Failed to update verification status",
                        variant: "destructive",
                    });
                } finally {
                    setIsUpdating(false);
                }
            };

            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={Boolean(vehicle.verification_status)}
                        onCheckedChange={handleVerificationChange}
                        disabled={isUpdating}
                    />
                    <Label>{vehicle.verification_status ? "Verified" : "Pending"}</Label>
                </div>
            );
        },
        filterFn: "equals",
    },

];

export default function VehiclesPage() {
    const { vehicles, isLoading, deleteVehicle } = useVehicles();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );
    const table = useReactTable({
        data: vehicles,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
        },
        pageCount: Math.ceil(vehicles.length / pageSize),
        manualPagination: false,
    });

    const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithType | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleEdit = (vehicle: VehicleWithType) => {
        setSelectedVehicle(vehicle);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setSelectedVehicle(null);
    };

    const handleDelete = (vehicle: VehicleWithType) => {
        if (vehicle.id) {
            deleteVehicle(vehicle.id);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10 max-w-[95vw]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vehicles</h1>
                <Button
                    onClick={() => {
                        // TODO: Implement create functionality
                    }}
                >
                    Add Vehicle
                </Button>
            </div>

            <VehicleTable
                vehicles={vehicles}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} vehicle(s) total
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {selectedVehicle && (
                <VehicleSheet
                    vehicle={selectedVehicle}
                    isOpen={isSheetOpen}
                    onClose={handleCloseSheet}
                />
            )}
        </div>
    );
} 