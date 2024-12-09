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
import { RangeSlider } from "@/components/ui/range-slider";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

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
  data,
}: {
  table: any;
  showFilters: boolean;
  data: any[];
}) => {
  const budgetRange = data.reduce(
    (acc, curr) => ({
      min: Math.min(acc.min, curr.budget_amount),
      max: Math.max(acc.max, curr.budget_amount),
    }),
    { min: Infinity, max: -Infinity }
  );

  const currentBudgetRange = table
    .getColumn("budget_amount")
    ?.getFilterValue() || [budgetRange.min, budgetRange.max];

  const weightRange = data.reduce(
    (acc, curr) => ({
      min: Math.min(acc.min, curr.weight_kg),
      max: Math.max(acc.max, curr.weight_kg),
    }),
    { min: Infinity, max: -Infinity }
  );

  const currentWeightRange = table.getColumn("weight_kg")?.getFilterValue() || [
    weightRange.min,
    weightRange.max,
  ];

  return (
    <div
      className={cn(
        "flex flex-1 items-start gap-4 overflow-hidden transition-all duration-300",
        showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-6 bg-[#1a2b47] rounded-lg border border-[#4895d0]/30">
        {/* Locations Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#f1f0f3]">Locations</h3>
          <div className="space-y-3">
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
        </div>

        {/* Load Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#f1f0f3]">Load Details</h3>
          <div className="space-y-3">
            <Select
              value={
                (table
                  .getColumn("load_type_name")
                  ?.getFilterValue() as string) || "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("load_type_name")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]">
                <SelectValue placeholder="Load Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Hazardous">Hazardous</SelectItem>
                <SelectItem value="FMCG">FMCG</SelectItem>
                <SelectItem value="Perishables">Perishables</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
                <SelectItem value="Heavy Equipment">Heavy Equipment</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#f1f0f3]">
                Weight Range
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-[#f1f0f3] mb-1.5 block">
                      Min (kg)
                    </label>
                    <input
                      type="number"
                      value={currentWeightRange[0]}
                      onChange={(e) =>
                        table
                          .getColumn("weight_kg")
                          ?.setFilterValue([
                            Number(e.target.value),
                            currentWeightRange[1],
                          ])
                      }
                      className="flex h-9 w-full rounded-md border border-[#4895d0]/30 bg-[#1a2b47] px-3 py-1 text-sm text-[#f1f0f3] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4895d0]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#f1f0f3] mb-1.5 block">
                      Max (kg)
                    </label>
                    <input
                      type="number"
                      value={currentWeightRange[1]}
                      onChange={(e) =>
                        table
                          .getColumn("weight_kg")
                          ?.setFilterValue([
                            currentWeightRange[0],
                            Number(e.target.value),
                          ])
                      }
                      className="flex h-9 w-full rounded-md border border-[#4895d0]/30 bg-[#1a2b47] px-3 py-1 text-sm text-[#f1f0f3] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4895d0]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[60px] text-xs text-[#f1f0f3]">
                    {currentWeightRange[0].toLocaleString()} kg
                  </span>
                  <RangeSlider
                    defaultValue={[weightRange.min, weightRange.max]}
                    value={currentWeightRange}
                    min={weightRange.min}
                    max={weightRange.max}
                    step={100}
                    minStepsBetweenThumbs={1}
                    onValueChange={(value) =>
                      table.getColumn("weight_kg")?.setFilterValue(value)
                    }
                    className="flex-1"
                  />
                  <span className="min-w-[60px] text-right text-xs text-[#f1f0f3]">
                    {currentWeightRange[1].toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Status Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#f1f0f3]">
            Payment & Status
          </h3>
          <div className="space-y-3">
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) || "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("status")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#f1f0f3]">
                Budget Range
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-[#f1f0f3] mb-1.5 block">
                      Min
                    </label>
                    <input
                      type="number"
                      value={currentBudgetRange[0]}
                      onChange={(e) =>
                        table
                          .getColumn("budget_amount")
                          ?.setFilterValue([
                            Number(e.target.value),
                            currentBudgetRange[1],
                          ])
                      }
                      className="flex h-9 w-full rounded-md border border-[#4895d0]/30 bg-[#1a2b47] px-3 py-1 text-sm text-[#f1f0f3] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4895d0]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#f1f0f3] mb-1.5 block">
                      Max
                    </label>
                    <input
                      type="number"
                      value={currentBudgetRange[1]}
                      onChange={(e) =>
                        table
                          .getColumn("budget_amount")
                          ?.setFilterValue([
                            currentBudgetRange[0],
                            Number(e.target.value),
                          ])
                      }
                      className="flex h-9 w-full rounded-md border border-[#4895d0]/30 bg-[#1a2b47] px-3 py-1 text-sm text-[#f1f0f3] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4895d0]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[60px] text-xs text-[#f1f0f3]">
                    {formatCurrency(currentBudgetRange[0])}
                  </span>
                  <RangeSlider
                    defaultValue={[budgetRange.min, budgetRange.max]}
                    value={currentBudgetRange}
                    min={budgetRange.min}
                    max={budgetRange.max}
                    step={100}
                    minStepsBetweenThumbs={1}
                    onValueChange={(value) =>
                      table.getColumn("budget_amount")?.setFilterValue(value)
                    }
                    className="flex-1"
                  />
                  <span className="min-w-[60px] text-right text-xs text-[#f1f0f3]">
                    {formatCurrency(currentBudgetRange[1])}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
          <FilterPanel table={table} showFilters={showFilters} data={data} />
        </div>
      </div>

      <Table className="w-full ">
        <TableHeader className="bg-[#4895d0]/50 backdrop-blur-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-[#4895d0]/50 backdrop-blur-sm hover:bg-[#4895d0]/50 border-b-0"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-[#f1f0f3] h-12 font-semibold hover:text-white transition-colors duration-100"
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
        <TableBody className="bg-[hsl(217,46%,10%)]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-[#4895d0]/20 hover:bg-[#4895d0]/10 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-[#f1f0f3] py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
