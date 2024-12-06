"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const ResultsCounter = ({
  table,
  totalRows,
}: {
  table: any;
  totalRows: number;
}) => {
  const start =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const end = Math.min(
    start + table.getState().pagination.pageSize - 1,
    totalRows
  );

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-[#4895d0] font-medium">
        {start}-{end}
      </span>
      <span className="text-[#f1f0f3]">of</span>
      <span className="text-[#4895d0] font-medium">{totalRows}</span>
      <span className="text-[#f1f0f3]">results</span>
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      custom: (row, id, filterValue) => {
        const value = row.getValue(id);
        if (typeof value === "object" && value !== null && "address" in value) {
          return (value as { address: string }).address
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 py-4 max-w-7xl mx-auto">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Filter pickup location..."
            value={
              (table
                .getColumn("pickup_location")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("pickup_location")
                ?.setFilterValue(event.target.value)
            }
            className="w-full sm:w-[300px] bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3] 
              placeholder:text-gray-400 focus:border-[#4895d0] focus:ring-[#4895d0]
              rounded-lg py-2 px-4"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Filter delivery location..."
            value={
              (table
                .getColumn("delivery_location")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("delivery_location")
                ?.setFilterValue(event.target.value)
            }
            className="w-full sm:w-[300px] bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3] 
              placeholder:text-gray-400 focus:border-[#4895d0] focus:ring-[#4895d0]
              rounded-lg py-2 px-4"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Filter status..."
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("status")?.setFilterValue(event.target.value)
            }
            className="w-full sm:w-[300px] bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3] 
              placeholder:text-gray-400 focus:border-[#4895d0] focus:ring-[#4895d0]
              rounded-lg py-2 px-4"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#4895d0]/30 max-w-7xl mx-auto overflow-hidden bg-[#1a2b47]">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#4895d0] hover:bg-[#4895d0] border-b-0"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[#f1f0f3] h-12 font-semibold hover:text-white transition-colors first:rounded-tl-lg last:rounded-tr-lg"
                  >
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
          <TableBody className="bg-[#1a2b47]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-[#4895d0]/20 hover:bg-[#4895d0]/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-[#f1f0f3] py-4">
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
                  className="h-24 text-center text-[#f1f0f3]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4 max-w-7xl mx-auto">
        <ResultsCounter table={table} totalRows={data.length} />
        <Pagination className="text-[#f1f0f3]">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                className={`
                  border border-[#4895d0]/30 
                  ${
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-[#4895d0] hover:text-white transition-colors"
                  }
                `}
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex(pageNumber - 1);
                    }}
                    isActive={
                      table.getState().pagination.pageIndex === pageNumber - 1
                    }
                    className={`
                    border border-[#4895d0]/30
                    ${
                      table.getState().pagination.pageIndex === pageNumber - 1
                        ? "bg-[#4895d0] text-white border-[#4895d0]"
                        : "text-[#f1f0f3] hover:bg-[#4895d0]/10 hover:text-white transition-colors"
                    }
                  `}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.nextPage();
                }}
                className={`
                  border border-[#4895d0]/30
                  ${
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-[#4895d0] hover:text-white transition-colors"
                  }
                `}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
