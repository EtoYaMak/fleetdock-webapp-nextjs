"use client";

import { memo } from "react";
import { Load } from "@/types/loads";
import { FiEye } from "react-icons/fi";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface LoadsTableProps {
  loads: Load[];
  onView: (loadId: string) => void;
  isLoading: boolean;
}

// Memoize table header component
const TableHeader = memo(function TableHeader() {
  const headers = [
    "Pickup",
    "Delivery",
    "Price",
    "Load Type",
    "Status",
    "Actions"
  ];

  return (
    <thead className="bg-[#4895d0]">
      <tr>
        {headers.map(header => (
          <th 
            key={header}
            className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
});

// Memoize table row component
const LoadRow = memo(function LoadRow({ 
  load, 
  onView 
}: { 
  load: Load; 
  onView: (loadId: string) => void;
}) {
  return (
    <tr key={load.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {load.pickup_location.address}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(load.pickup_deadline).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {load.delivery_location.address}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(load.delivery_deadline).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {load.budget_amount} {load.budget_currency}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {load.load_type_name || "Unknown Type"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 uppercase">
          {load.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          onClick={() => onView(load.id)}
          className="text-blue-600 hover:text-blue-900"
        >
          <FiEye className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
});

// Memoize loading state component
const LoadingState = memo(function LoadingState() {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="w-full">
        <td colSpan={6} className="text-center py-4">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" color="border-blue-500" />
          </div>
        </td>
      </tr>
    </tbody>
  );
});

const LoadsTable = memo(function LoadsTable({
  loads,
  onView,
  isLoading,
}: LoadsTableProps) {
  return (
    <div className="overflow-x-auto bg-[#203152] rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader />
        {isLoading ? (
          <LoadingState />
        ) : (
          <tbody className="bg-white divide-y divide-gray-200">
            {loads.map((load) => (
              <LoadRow key={load.id} load={load} onView={onView} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
});

TableHeader.displayName = 'TableHeader';
LoadRow.displayName = 'LoadRow';
LoadingState.displayName = 'LoadingState';
LoadsTable.displayName = 'LoadsTable';

export default LoadsTable;
