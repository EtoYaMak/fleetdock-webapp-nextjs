"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Load, Location } from "@/types/load";

// Format location object to string
const formatLocation = (location: Location): string => {
  return `${location.city}`;
};

export const columns: ColumnDef<Load>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Age
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const created_at = new Date(row.original.created_at || "");
      return formatDistanceToNow(created_at, { addSuffix: false })
        .replace("about ", "")
        .replace("less than ", "");
    },
  },
  {
    accessorKey: "pickup_location",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Pickup Location
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatLocation(row.original.pickup_location),
    filterFn: (row, id, value) => {
      const location = row.getValue(id) as Location;
      const searchStr = value.toLowerCase();
      return (
        location.city.toLowerCase().includes(searchStr) ||
        location.state.toLowerCase().includes(searchStr) ||
        location.zip.toLowerCase().includes(searchStr)
      );
    },
  },
  {
    accessorKey: "delivery_location",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Delivery Location
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatLocation(row.original.delivery_location),
    filterFn: (row, id, value) => {
      const location = row.getValue(id) as Location;
      const searchStr = value.toLowerCase();
      return (
        location.city.toLowerCase().includes(searchStr) ||
        location.state.toLowerCase().includes(searchStr) ||
        location.zip.toLowerCase().includes(searchStr)
      );
    },
  },
  {
    accessorKey: "load_type_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Load Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#2d4169] text-[#f1f0f3]">
          {row.getValue("load_type_name")}
        </span>
      </div>
    ),
    filterFn: "equals",
  },
  {
    accessorKey: "weight_kg",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Weight (kg)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue("weight_kg"),
  },
  {
    accessorKey: "budget_amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Budget
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.budget_amount} {row.original.budget_currency}
      </div>
    ),
  },
  {
    accessorKey: "load_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#4895d0] text-[#f1f0f3]">
        {row.getValue("load_status")}
      </span>
    ),
  },
  {
    accessorKey: "pickup_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Pickup Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      new Date(row.getValue("pickup_date")).toLocaleDateString(),
  },
  {
    accessorKey: "delivery_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Delivery Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      new Date(row.getValue("delivery_date")).toLocaleDateString(),
  },
];
