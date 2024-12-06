"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Declare the custom filter type
declare module "@tanstack/table-core" {
  interface FilterFns {
    custom: FilterFn<any>;
  }
}

// Define the Load type based on your data structure
type Load = {
  id: string;
  pickup_location: { address: string };
  delivery_location: { address: string };
  weight_kg: number;
  budget_amount: number;
  budget_currency: string;
  status: string;
  pickup_deadline: string;
  delivery_deadline: string;
  created_at: string;
  load_type_name: string;
};

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
      const created_at = new Date(row.original.created_at);
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
    cell: ({ row }) => row.original.pickup_location.address,
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
    cell: ({ row }) => row.original.delivery_location.address,
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
        {row.original.status.toUpperCase()}
      </span>
    ),
  },

  {
    accessorKey: "pickup_deadline",
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
    cell: ({ row }) =>
      new Date(row.original.pickup_deadline).toLocaleDateString(),
  },
  {
    accessorKey: "delivery_deadline",
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
      new Date(row.original.delivery_deadline).toLocaleDateString(),
  },
];
