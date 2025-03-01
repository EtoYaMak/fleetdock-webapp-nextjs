"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Clock, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Load, Location } from "@/types/load";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { User } from "@/types/auth";
import { reportWebVitals } from "next/dist/build/templates/pages";

// Format location object to string
const formatLocation = (location: Location): string => {
  return `${location.city}`;
};

export const getColumns = (user: User, router: any, isAdmin: boolean = false) => {
  const baseColumns: ColumnDef<Load>[] = [
    {
      accessorKey: "load_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.id.slice(0, 4).toUpperCase(),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-4 w-4" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.created_at;
        return date ? format(new Date(date as Date), "MMM dd, yyyy") : "N/A";
      },
    },
    {
      accessorKey: "pickup_location",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pickup
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
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery
          <ArrowUpDown className="ml-0 h-4 w-4" />
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
          className="flex w-fit  hover:bg-black/20 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="w-full flex items-center justify-center text-white">
          <p className="px-2 py-1 rounded-full text-xs font-medium bg-primary w-full text-center uppercase ">
            {row.getValue("load_type_name")}
          </p>
        </span>
      ),
      filterFn: "equals",
    },
    {
      accessorKey: "weight_kg",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Weight className="h-4 w-4" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.getValue("weight_kg") +
        " " +
        (row.original.weight_unit ? row.original.weight_unit : "kg"),
    },
    {
      accessorKey: "budget_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          $
          <ArrowUpDown className="ml-0 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>$
          {row.original.budget_amount
            ? row.original.budget_amount
            : row.original.fixed_rate}{" "}

        </div>
      ),
    },
    {
      accessorKey: "load_status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-0 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="w-full flex items-center justify-center text-white">
          <p className="px-2 py-1 rounded-full text-xs font-medium bg-primary w-full text-center uppercase">
            {row.getValue("load_status")}
          </p>
        </span>
      ),
    },
    {
      accessorKey: "pickup_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pickup <Clock className="h-4 w-4" />
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("pickup_date");
        return date ? format(new Date(date as string), "MMM dd, yyyy") : "N/A";
      },
    },
    {
      accessorKey: "delivery_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex w-fit  hover:bg-black/20"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery <Clock className="h-4 w-4" />
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("delivery_date");
        return date ? format(new Date(date as string), "MMM dd, yyyy") : "N/A";
      },
    },
  ];

  // Hidden column for filtering
  const hiddenColumns: ColumnDef<Load>[] = [
    {
      accessorKey: "bid_enabled",
      enableColumnFilter: true,

      enableHiding: true,
      // Set column to be hidden by default
      meta: {
        hidden: true,
      },
    },
  ];

  const actionColumn: ColumnDef<Load> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const load = row.original;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/loads/${load.id}`)}
          className="hover:bg-primary  hover:text-white"
        >
          <FiEye className="h-4 w-4" />
        </Button>
      );
    },
  };

  const adminActionColumn: ColumnDef<Load> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const load = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/loads/${load.id}`)}
            className="hover:bg-primary hover:text-white"
          >
            <FiEye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/loads/${load.id}/edit`)}
            className="hover:bg-primary hover:text-white"
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Add delete confirmation dialog and API call
              if (window.confirm("Are you sure you want to delete this load?")) {
                // Call your delete API
              }
            }}
            className="hover:bg-destructive hover:text-white"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  };

  return isAdmin
    ? [...baseColumns, ...hiddenColumns, adminActionColumn]
    : user?.role && user?.role !== null
      ? [...baseColumns, ...hiddenColumns, actionColumn]
      : [...baseColumns, ...hiddenColumns];
};
