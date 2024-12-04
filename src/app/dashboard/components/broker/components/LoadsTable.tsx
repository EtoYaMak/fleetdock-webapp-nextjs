"use client";

import { useState, memo } from "react";
import { FiEdit2, FiTrash2, FiEye, FiAlertCircle } from "react-icons/fi";
import { LoadsTableProps } from "@/types/loads";
import { useRouter } from "next/navigation";
const LoadsTable = memo(function LoadsTable({
  loads,
  onDelete,
  onView,
}: LoadsTableProps) {
  const [deleteLoadId, setDeleteLoadId] = useState<string | null>(null);
  const router = useRouter();

  const handleView = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}`);
  };

  const handleDeleteClick = (loadId: string) => {
    setDeleteLoadId(loadId);
  };

  const handleConfirmDelete = async () => {
    if (deleteLoadId) {
      await onDelete(deleteLoadId);
      setDeleteLoadId(null);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteLoadId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <FiAlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this load? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteLoadId(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#4895d0]/80 h-12">
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
                    {load.load_type_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      load.status === "available"
                        ? "bg-green-100 text-green-800"
                        : load.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : load.status === "completed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {load.status.replace("_", " ").charAt(0).toUpperCase() +
                      load.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(load.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(load.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default LoadsTable;
