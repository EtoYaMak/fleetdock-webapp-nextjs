"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Load } from "@/types/load";

// Declare the custom filter type
declare module "@tanstack/table-core" {
  interface FilterFns {
    custom: FilterFn<any>;
  }
}

export const columns: ColumnDef<Load>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const created_at = new Date(row.original.created_at || "");
      return formatDistanceToNow(created_at, { addSuffix: true });
    },
  },
  {
    accessorKey: "pickup_location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pickup Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.pickup_location,
    filterFn: "custom",
  },
  {
    accessorKey: "delivery_location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.delivery_location,
    filterFn: "custom",
  },
  {
    accessorKey: "load_type_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Load Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("load_type_name") as string;
      return (
        <div className="flex items-center">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#2d4169] text-[#f1f0f3]">
            {type}
          </span>
        </div>
      );
    },
    filterFn: "equals",
  },
  {
    accessorKey: "weight_kg",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Weight (kg)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "budget_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {row.original.budget_amount} {row.original.budget_currency}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#4895d0] text-[#f1f0f3]">
        {row.original.load_status}
      </span>
    ),
  },

  {
    accessorKey: "pickup_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pickup Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.original.pickup_date).toLocaleDateString(),
  },
  {
    accessorKey: "delivery_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      new Date(row.original.delivery_date).toLocaleDateString(),
  },
];
