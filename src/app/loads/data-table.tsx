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
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { Slider } from "@/components/ui/slider";

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

const FilterPanel = ({
  table,
  showFilters,
}: {
  table: any;
  showFilters: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-1 items-start gap-4 overflow-hidden transition-all duration-300",
        showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#f1f0f3]">
            Locations
          </label>
          <Input
            placeholder="Pickup location..."
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
            className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]"
          />
          <Input
            placeholder="Delivery location..."
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
            className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#f1f0f3]">
            Load Details
          </label>
          <Select
            onValueChange={(value) =>
              table.getColumn("load_type_name")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]">
              <SelectValue placeholder="Load Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flatbed">Flatbed</SelectItem>
              <SelectItem value="dry_van">Dry Van</SelectItem>
              <SelectItem value="reefer">Reefer</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-1">
            <label className="text-xs text-[#f1f0f3]">Weight Range (kg)</label>
            <Slider
              defaultValue={[0, 45000]}
              min={0}
              max={45000}
              step={100}
              onValueChange={(value) =>
                table.getColumn("weight_kg")?.setFilterValue(value)
              }
              className="py-4"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#f1f0f3]">
            Payment & Status
          </label>
          <div className="space-y-1">
            <label className="text-xs text-[#f1f0f3]">Budget Range</label>
            <Slider
              defaultValue={[0, 10000]}
              min={0}
              max={10000}
              step={100}
              onValueChange={(value) =>
                table.getColumn("budget_amount")?.setFilterValue(value)
              }
              className="py-4"
            />
          </div>
          <Select
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#f1f0f3]">
            Deadlines
          </label>
          <DatePicker
            placeholder="Pickup deadline from"
            onChange={(date) =>
              table.getColumn("pickup_deadline")?.setFilterValue(date)
            }
            className="w-full"
          />
          <DatePicker
            placeholder="Delivery deadline from"
            onChange={(date) =>
              table.getColumn("delivery_deadline")?.setFilterValue(date)
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);

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

        if (Array.isArray(filterValue) && typeof value === "number") {
          const [min, max] = filterValue;
          return value >= min && value <= max;
        }

        if (filterValue instanceof Date && typeof value === "string") {
          const dateValue = new Date(value);
          return dateValue >= filterValue;
        }

        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      },
    },
  });

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 transition-colors",
                showFilters && "bg-[#4895d0] text-white"
              )}
            >
              <Filter className="h-4 w-4" />
              Refine Search
            </Button>
          </div>
          <FilterPanel table={table} showFilters={showFilters} />
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
