"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";

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
};

export const columns: ColumnDef<Load>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
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
        <button
          className="flex items-center hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pickup Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => row.original.pickup_location.address,
    filterFn: "custom",
  },
  {
    accessorKey: "delivery_location",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => row.original.delivery_location.address,
    filterFn: "custom",
  },
  {
    accessorKey: "weight_kg",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Weight (kg)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
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
        <button
          className="flex items-center hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        {row.original.status.toUpperCase()}
      </span>
    ),
  },

  {
    accessorKey: "pickup_deadline",
    header: "Pickup Date",
    cell: ({ row }) =>
      new Date(row.original.pickup_deadline).toLocaleDateString(),
  },
  {
    accessorKey: "delivery_deadline",
    header: "Delivery Date",
    cell: ({ row }) =>
      new Date(row.original.delivery_deadline).toLocaleDateString(),
  },
];
