"use client";

import { useVehicle } from "@/hooks/useVehicle";
import { VehicleWithType } from "@/types/vehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        cell: ({ row }) => {
            const vehicle = row.original;
            const { updateVehicleVerificationStatus, fetchVehicles } = useVehicle();
            const { toast } = useToast();
            const [isUpdating, setIsUpdating] = useState(false);

            const handleVerificationChange = async (checked: boolean) => {
                setIsUpdating(true);
                try {
                    await updateVehicleVerificationStatus(vehicle.id!, checked);
                    await fetchVehicles(); // Refresh the data after update
                    toast({
                        title: "Status updated",
                        description: `Vehicle verification status has been ${checked ? 'verified' : 'unverified'}`,
                    });
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
    const { vehicles, isLoading, updateVehicleVerificationStatus } = useVehicle();
    console.log(vehicles);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

    const handleUpdateVerificationStatus = async (id: string, status: boolean) => {
        await updateVehicleVerificationStatus(id, status);
    };

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

            <div className="flex flex-wrap items-center py-4 gap-2">
                <div className="flex flex-1 min-w-[300px] gap-2">
                    <Input
                        placeholder="Filter by trucker name..."
                        value={(table.getColumn("trucker_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("trucker_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-[250px]"
                    />
                    <Input
                        placeholder="Filter by license plate..."
                        value={(table.getColumn("license_plate")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("license_plate")?.setFilterValue(event.target.value)
                        }
                        className="max-w-[250px]"
                    />

                </div>
                <div className="flex gap-2 items-center">
                    <Select
                        value={(table.getColumn("is_active")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) => {
                            table.getColumn("is_active")?.setFilterValue(
                                value === "all" ? undefined : value === "true"
                            );
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={(table.getColumn("verification_status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) => {
                            table.getColumn("verification_status")?.setFilterValue(
                                value === "all" ? undefined : value === "true"
                            );
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Verifications</SelectItem>
                            <SelectItem value="true">Verified</SelectItem>
                            <SelectItem value="false">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="ml-auto" size="default">
                                Columns
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[200px]">
                            <div className="space-y-2">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <div key={column.id} className="flex items-center space-x-2">
                                                <Switch
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                    id={column.id}
                                                />
                                                <Label htmlFor={column.id} className="capitalize">
                                                    {column.id}
                                                </Label>
                                            </div>
                                        );
                                    })}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

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
        </div>
    );
} 