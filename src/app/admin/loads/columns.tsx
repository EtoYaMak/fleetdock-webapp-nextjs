"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Load } from "@/types/load";

export const columns: ColumnDef<Load>[] = [
    {
        accessorKey: "id",
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
    },
    {
        accessorKey: "load_status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize text-white
                ${row.getValue("load_status") === "completed" ? "bg-green-500" :
                    row.getValue("load_status") === "posted" ? "bg-blue-500" :
                        row.getValue("load_status") === "accepted" ? "bg-yellow-500" :
                            row.getValue("load_status") === "rejected" ? "bg-red-500" : "bg-gray-500"}`}>
                {row.getValue("load_status")}
            </span>
        ),
        filterFn: "equals",
    },
    {
        accessorKey: "load_type_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Load Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "equipment_required_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Equipment
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "weight_kg",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Weight (kg)
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "pickup_location",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Pickup
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const location = row.getValue("pickup_location") as { city: string; state: string };
            return `${location.city}, ${location.state}`;
        },
    },
    {
        accessorKey: "delivery_location",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Delivery
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const location = row.getValue("delivery_location") as { city: string; state: string };
            return `${location.city}, ${location.state}`;
        },
    },
    {
        accessorKey: "pickup_date",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Pickup Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return new Date(row.getValue("pickup_date")).toLocaleDateString();
        },
    },
    {
        accessorKey: "delivery_date",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Delivery Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return new Date(row.getValue("delivery_date")).toLocaleDateString();
        },
    },

    {
        accessorKey: "budget_amount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="flex w-fit hover:bg-black/20"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Budget
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = row.getValue("budget_amount");
            const currency = row.original.budget_currency || "USD";
            return amount ? `${currency} ${amount}` : "N/A";
        },
    },
];
