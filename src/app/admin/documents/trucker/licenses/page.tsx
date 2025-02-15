"use client";

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
import { ChevronDown } from "lucide-react";
import React from "react";
import { DocumentViewer } from "@/components/ui/document-viewer";
import { useDocuments } from "@/context/DocumentContext";

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

// Create a new component for the cell content
function DocumentActionCell({ doc }: { doc: DocumentRow }) {
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
}

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
        cell: ({ row }) => <DocumentActionCell doc={row.original} />
    },
];

// Component for the status update popover
function UpdateStatusPopover({ truckerId, documentName, currentStatus }: {
    truckerId: string;
    documentName: string;
    currentStatus: string;
}) {
    const { updateDocumentStatus } = useDocuments();
    const [updating, setUpdating] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            await updateDocumentStatus({
                truckerId,
                documentName,
                documentType: "licenses",
                newStatus,
            });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" disabled={updating}>
                    Update Status
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
                <div className="flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        disabled={updating}
                        onClick={() => handleStatusUpdate("verified")}
                        className="justify-start"
                    >
                        Verify
                    </Button>
                    <Button
                        variant="ghost"
                        disabled={updating}
                        onClick={() => handleStatusUpdate("rejected")}
                        className="justify-start"
                    >
                        Reject
                    </Button>
                    <Button
                        variant="ghost"
                        disabled={updating}
                        onClick={() => handleStatusUpdate("pending")}
                        className="justify-start"
                    >
                        Mark Pending
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function LicensesPage() {
    const { documents, isLoading } = useDocuments();
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
        data: documents.licenses,
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
        pageCount: Math.ceil(documents.licenses.length / pageSize),
        manualPagination: false,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Trucker Licenses</h1>

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
