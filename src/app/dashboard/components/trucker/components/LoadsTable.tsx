"use client";

import { Load } from "@/types/loads";
import { FiEye } from "react-icons/fi";

interface LoadsTableProps {
  loads: Load[];
  loadTypes: Record<string, string>;
  onView: (loadId: string) => void;
  isLoading: boolean;
}

export default function LoadsTable({
  loads,
  loadTypes,
  onView,
  isLoading,
}: LoadsTableProps) {
  return (
    <div className="overflow-x-auto bg-[#203152] rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 ">
        <thead className="bg-[#4895d0]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider">
              Pickup
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider">
              Delivery
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider">
              Load Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#f1f0f3] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="w-full">
              <td colSpan={6} className="text-center py-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="bg-white divide-y divide-gray-200">
            {loads.map((load) => (
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
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
