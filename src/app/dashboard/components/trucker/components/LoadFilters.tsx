import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { FiX } from "react-icons/fi";

interface LoadFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    pickupLocation?: string;
    deliveryLocation?: string;
  }) => void;
}

export default function LoadFilters({ onFilterChange }: LoadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
    pickupLocation: "",
    deliveryLocation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    onFilterChange({
      ...updatedFilters,
      minPrice: updatedFilters.minPrice
        ? Number(updatedFilters.minPrice)
        : undefined,
      maxPrice: updatedFilters.maxPrice
        ? Number(updatedFilters.maxPrice)
        : undefined,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      minPrice: "",
      maxPrice: "",
      pickupLocation: "",
      deliveryLocation: "",
    });
    onFilterChange({});
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-[#f1f0f3] bg-[#4895d0]/80 hover:bg-[#4895d0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiFilter className="mr-2 h-4 w-4" />
          Filters
        </button>
        {Object.values(filters).some((value) => value !== "") && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#f1f0f3] hover:text-[#f1f0f3] flex items-center"
          >
            <FiX className="mr-1" /> Clear filters
          </button>
        )}
      </div>

      {isOpen && (
        <div className="bg-[#f1f0f3] rounded-lg shadow-sm border border-[#4895d0]/80 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10"
              >
                <option value="">All Statuses</option>
                <option value="posted">Posted</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={filters.pickupLocation}
                onChange={handleChange}
                placeholder="Enter city or address"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Location
              </label>
              <input
                type="text"
                name="deliveryLocation"
                value={filters.deliveryLocation}
                onChange={handleChange}
                placeholder="Enter city or address"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
