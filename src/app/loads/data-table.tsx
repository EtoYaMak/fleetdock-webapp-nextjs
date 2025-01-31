"use client";
import Link from "next/link";
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
  VisibilityState,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/range-slider";
import { Location } from "@/types/load";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
      <span className="text-primary font-medium">
        {start}-{end}
      </span>
      <span className="text-muted-foreground">of</span>
      <span className="text-primary font-medium">{totalRows}</span>
      <span className="text-muted-foreground">results</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-6 bg-secondary rounded-lg border border-primary/50">
        {/* Locations Section */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold ">Locations</h3>
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
              className="bg-input border border-ring/80"
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
              className="bg-input border border-ring/80"
            />
            <div className="flex items-end space-x-2">
              <Checkbox
                id="bid-enabled"
                checked={
                  table.getColumn("bid_enabled")?.getFilterValue() ?? false
                }
                onCheckedChange={(checked: boolean) =>
                  table.getColumn("bid_enabled")?.setFilterValue(checked)
                }
                className={cn(
                  "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-accent"
                )}
              />
              <label
                htmlFor="bid-enabled"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bidding Enabled
              </label>
            </div>
          </div>
        </div>

        {/* Load Details Section */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold ">Load Details</h3>
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
              <SelectTrigger className="bg-input border border-ring/80">
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
              <label className="text-md font-semibold ">Weight Range</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs  mb-1.5 block">Min (kg)</label>
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
                      className="flex h-9 w-full rounded-md bg-input border border-ring px-3 py-1 text-sm shadow-sm "
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs  mb-1.5 block">Max (kg)</label>
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
                      className="flex h-9 w-full rounded-md bg-input border border-ring px-3 py-1 text-sm shadow-sm "
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[60px] text-xs ">
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
                    className="flex-1 "
                  />
                  <span className="min-w-[60px] text-right text-xs">
                    {currentWeightRange[1].toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Status Section */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold ">Payment & Status</h3>
          <div className="space-y-3">
            <Select
              value={
                (table.getColumn("load_status")?.getFilterValue() as string) ||
                "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("load_status")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="bg-input border border-ring/80">
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
              <label className="text-md font-semibold">Budget Range</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs mb-1.5 block">Min</label>
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
                      className="flex h-9 w-full rounded-md bg-input border border-ring px-3 py-1 text-sm shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs  mb-1.5 block">Max</label>
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
                      className="flex h-9 w-full rounded-md bg-input border border-ring   px-3 py-1 text-sm shadow-sm "
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[60px] text-xs ">
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
                  <span className="min-w-[60px] text-right text-xs ">
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

const ActiveFilterChips = ({
  table,
  resetFilters,
}: {
  table: any;
  resetFilters: () => void;
}) => {
  const activeFilters = table.getState().columnFilters;

  if (activeFilters.length === 0) return null;

  const getFilterLabel = (filter: { id: string; value: any }) => {
    switch (filter.id) {
      case "pickup_location":
        return `Pickup: ${filter.value}`;
      case "delivery_location":
        return `Delivery: ${filter.value}`;
      case "load_type_name":
        return `Type: ${filter.value}`;
      case "load_status":
        return `Status: ${filter.value}`;
      case "weight_kg":
        return `Weight: ${filter.value[0].toLocaleString()}kg - ${filter.value[1].toLocaleString()}kg`;
      case "budget_amount":
        return `Budget: ${formatCurrency(filter.value[0])} - ${formatCurrency(
          filter.value[1]
        )}`;
      case "bid_enabled":
        return "Bidding Enabled";
      default:
        return `${filter.id}: ${filter.value}`;
    }
  };

  const removeFilter = (filterId: string) => {
    table.getColumn(filterId)?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      {activeFilters.map((filter: any) => (
        <button
          key={filter.id}
          onClick={() => removeFilter(filter.id)}
          className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors"
        >
          {getFilterLabel(filter)}
          <X className="h-3 w-3" />
        </button>
      ))}
      {activeFilters.length > 0 && (
        <Button
          variant="outline1"
          onClick={resetFilters}
          className={cn(
            "flex items-center gap-2 transition-colors",
            activeFilters.length > 0 &&
            "bg-destructive text-white hover:text-white hover:bg-destructive/90"
          )}
        >
          Clear All
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    return sortParam ? JSON.parse(decodeURIComponent(sortParam)) : [];
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filtersParam = searchParams.get("filters");
    return filtersParam ? JSON.parse(decodeURIComponent(filtersParam)) : [];
  });

  const [showFilters, setShowFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    bid_enabled: false,
  });

  // Update URL when filters change
  const updateUrl = (
    newSorting: SortingState,
    newFilters: ColumnFiltersState
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSorting.length > 0) {
      params.set("sort", encodeURIComponent(JSON.stringify(newSorting)));
    } else {
      params.delete("sort");
    }

    if (newFilters.length > 0) {
      params.set("filters", encodeURIComponent(JSON.stringify(newFilters)));
    } else {
      params.delete("filters");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
      columnVisibility,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      updateUrl(newSorting, columnFilters);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
      updateUrl(sorting, newFilters);
    },
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: {
      custom: (row, id, filterValue) => {
        const value = row.getValue(id);

        // Handle Location objects
        if (value && typeof value === "object" && "city" in value) {
          const location = value as Location;
          const searchStr = filterValue.toLowerCase();
          return (
            location.city.toLowerCase().includes(searchStr) ||
            location.state.toLowerCase().includes(searchStr) ||
            location.zip.toLowerCase().includes(searchStr)
          );
        }

        // Handle number ranges
        if (Array.isArray(filterValue) && typeof value === "number") {
          const [min, max] = filterValue;
          return value >= min && value <= max;
        }

        // Handle dates
        if (filterValue instanceof Date && typeof value === "string") {
          const dateValue = new Date(value);
          return dateValue >= filterValue;
        }

        // Default string comparison
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      },
    },
  });

  const resetFilters = () => {
    table.resetColumnFilters();
    table.resetSorting();
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          <div className="flex w-full justify-between items-center">
            <ActiveFilterChips table={table} resetFilters={resetFilters} />
            <div className="flex gap-2 justify-end w-full">
              {/* <Button
                variant="outline1"
                onClick={resetFilters}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  (columnFilters.length > 0 || sorting.length > 0) &&
                    "bg-destructive text-white hover:bg-destructive/90"
                )}
              >
                <X className="h-4 w-4" />
                Reset Filters
              </Button> */}
              <Button
                variant="outline1"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  showFilters && "bg-primary text-white"
                )}
              >
                <Filter className="h-4 w-4" />
                Refine Search
              </Button>
            </div>
          </div>
          <FilterPanel table={table} showFilters={showFilters} data={data} />
        </div>
      </div>

      <Table>
        <TableHeader className="w-fit">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border border-border bg-muted hover:bg-muted"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-12 font-semibold
                   transition-colors duration-100 w-fit border border-border text-primary"
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
        <TableBody className="bg-card border border-border">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="w-fit border-b border-border transition-colors odd:bg-background even:bg-primary/10"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className=" ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between py-4 max-w-7xl mx-auto">
        <ResultsCounter table={table} totalRows={data.length} />
        <Pagination className="">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                className={`
                  border border-primary 
                  ${!table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-primary hover:text-white transition-colors"
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
                    border border-primary
                    ${table.getState().pagination.pageIndex === pageNumber - 1
                        ? "bg-primary text-white border-primary"
                        : "text-primary hover:bg-primary hover:text-white transition-colors"
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
                  border border-primary
                  ${!table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-primary hover:text-white transition-colors"
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
