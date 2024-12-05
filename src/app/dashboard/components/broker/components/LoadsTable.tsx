"use client";

import { memo } from "react";
import { FiTrash2, FiEye } from "react-icons/fi";
import { LoadsTableProps } from "@/types/loads";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

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

// Memoize action buttons component
const ActionButtons = memo(function ActionButtons({ 
  loadId, 
  onView, 
  onDelete 
}: { 
  loadId: string;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onView(loadId)}
        className="text-blue-600 hover:text-blue-900"
      >
        <FiEye className="h-5 w-5" />
      </button>
      <button
        onClick={() => onDelete(loadId)}
        className="text-red-600 hover:text-red-900"
      >
        <FiTrash2 className="h-5 w-5" />
      </button>
    </div>
  );
});

// Memoize table row component
const LoadRow = memo(function LoadRow({ 
  load, 
  onView, 
  onDelete 
}: { 
  load: LoadsTableProps['loads'][0];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr>
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
          {load.load_type_name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {load.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <ActionButtons loadId={load.id} onView={onView} onDelete={onDelete} />
      </td>
    </tr>
  );
});

const LoadsTable = memo(function LoadsTable({
  loads,
  onDelete,
  onView,
}: LoadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {loads.map((load) => (
            <LoadRow 
              key={load.id} 
              load={load} 
              onView={onView} 
              onDelete={onDelete} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

TableHeader.displayName = 'TableHeader';
ActionButtons.displayName = 'ActionButtons';
LoadRow.displayName = 'LoadRow';
LoadsTable.displayName = 'LoadsTable';

export default LoadsTable;
