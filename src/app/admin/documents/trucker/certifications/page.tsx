"use client";

import { useTrucker } from "@/hooks/useTrucker";
import { DocumentMetadata, TruckerDetails } from "@/types/trucker";
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChevronDown } from "lucide-react";
import React from "react";
import { DocumentViewer } from "@/components/ui/document-viewer";

// Define the type for our document row
type DocumentRow = {
    id: string;
    truckerId: string;
    truckerName: string;
    documentName: string;
    uploadedAt: string;
    verification_status: string;
    url: string;
    name: string; // Original file name
};

// Define columns for the data table
const columns: ColumnDef<DocumentRow>[] = [
    {
        accessorKey: "truckerName",
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
        accessorKey: "documentName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Document Name
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "uploadedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Upload Date
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => format(new Date(row.getValue("uploadedAt")), "PPP"),
    },
    {
        accessorKey: "verification_status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize text-white
                ${row.getValue("verification_status") === "verified" ? "bg-green-500" :
                    row.getValue("verification_status") === "pending" ? "bg-yellow-500" :
                        "bg-red-500"}`}>
                {row.getValue("verification_status")}
            </span>
        ),
        filterFn: "equals",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const doc = row.original;
            const [isViewerOpen, setIsViewerOpen] = useState(false);

            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsViewerOpen(true)}
                    >
                        View
                    </Button>
                    <UpdateStatusPopover
                        truckerId={doc.truckerId}
                        documentName={doc.documentName}
                        currentStatus={doc.verification_status}
                    />
                    <DocumentViewer
                        url={doc.url}
                        fileName={doc.name}
                        isOpen={isViewerOpen}
                        onClose={() => setIsViewerOpen(false)}
                    />
                </div>
            );
        },
    },
];

// Component for the status update popover
function UpdateStatusPopover({ truckerId, documentName, currentStatus }: {
    truckerId: string;
    documentName: string;
    currentStatus: string;
}) {
    const { toast } = useToast();
    const { fetchTrucker } = useTrucker();
    const [updating, setUpdating] = useState(false);

    const updateStatus = async (newStatus: string) => {
        try {
            setUpdating(true);
            const { data: truckerData } = await supabase
                .from("trucker_details")
                .select("certifications")
                .eq("id", truckerId)
                .single();

            if (!truckerData) return;

            const updatedCertifications = {
                ...truckerData.certifications,
                [documentName]: {
                    ...truckerData.certifications[documentName],
                    verification_status: newStatus
                }
            };

            const { error } = await supabase
                .from("trucker_details")
                .update({ certifications: updatedCertifications })
                .eq("id", truckerId);

            if (error) throw error;

            toast({
                title: "Status updated",
                description: "Document verification status has been updated successfully",
            });

            fetchTrucker();
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "Failed to update verification status",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    Update Status
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
                <div className="flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        disabled={updating}
                        onClick={() => updateStatus("verified")}
                        className="justify-start"
                    >
                        Verify
                    </Button>
                    <Button
                        variant="ghost"
                        disabled={updating}
                        onClick={() => updateStatus("rejected")}
                        className="justify-start"
                    >
                        Reject
                    </Button>
                    <Button
                        variant="ghost"
                        disabled={updating}
                        onClick={() => updateStatus("pending")}
                        className="justify-start"
                    >
                        Mark Pending
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function CertificationsPage() {
    const { truckers, isLoading } = useTrucker();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Transform the truckers data into a flat array of documents
    const documents: DocumentRow[] = React.useMemo(
        () => truckers.flatMap((trucker: TruckerDetails) =>
            Object.entries(trucker.certifications || {}).map(([key, doc]) => ({
                id: `${trucker.id}-${key}`,
                truckerId: trucker.id,
                truckerName: trucker.profile_id,
                documentName: key,
                uploadedAt: doc.uploadedAt,
                verification_status: doc.verification_status,
                url: doc.url,
                name: doc.name,
            }))
        ),
        [truckers]
    );

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const table = useReactTable({
        data: documents,
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
        pageCount: Math.ceil(documents.length / pageSize),
        manualPagination: false,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Trucker Certifications</h1>

            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Filter by trucker name..."
                    value={(table.getColumn("truckerName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("truckerName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Input
                    placeholder="Filter by document name..."
                    value={(table.getColumn("documentName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("documentName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <select
                    value={(table.getColumn("verification_status")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("verification_status")?.setFilterValue(event.target.value)
                    }
                    className="h-10 rounded-md border border-input px-3"
                >
                    <option value="">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
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

            <div className="flex items-center justify-end space-x-2 py-4">
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
    );
}

