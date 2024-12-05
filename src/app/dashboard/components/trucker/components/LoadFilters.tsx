import { useState, useCallback, memo, useMemo } from "react";
import { FiFilter, FiX } from "react-icons/fi";

interface FilterInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Memoize filter input component
const FilterInput = memo(function FilterInput({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  options
}: FilterInputProps) {
  const inputClasses = "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10";
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
        >
          <option value="">All Statuses</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
});

interface LoadFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    pickupLocation?: string;
    deliveryLocation?: string;
  }) => void;
}

const LoadFilters = memo(function LoadFilters({ onFilterChange }: LoadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
    pickupLocation: "",
    deliveryLocation: "",
  });

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    onFilterChange({
      ...updatedFilters,
      minPrice: updatedFilters.minPrice ? Number(updatedFilters.minPrice) : undefined,
      maxPrice: updatedFilters.maxPrice ? Number(updatedFilters.maxPrice) : undefined,
    });
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({
      status: "",
      minPrice: "",
      maxPrice: "",
      pickupLocation: "",
      deliveryLocation: "",
    });
    onFilterChange({});
  }, [onFilterChange]);

  const hasActiveFilters = useMemo(() => 
    Object.values(filters).some(value => value !== ""),
    [filters]
  );

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
        {hasActiveFilters && (
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
            <FilterInput
              label="Status"
              name="status"
              type="select"
              value={filters.status}
              onChange={handleChange}
              options={[
                { value: "posted", label: "Posted" },
                { value: "in_progress", label: "In Progress" }
              ]}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex space-x-2">
                <FilterInput
                  label=""
                  name="minPrice"
                  type="number"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="Min"
                />
                <FilterInput
                  label=""
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="Max"
                />
              </div>
            </div>
            <FilterInput
              label="Pickup Location"
              name="pickupLocation"
              type="text"
              value={filters.pickupLocation}
              onChange={handleChange}
              placeholder="Enter city or address"
            />
            <FilterInput
              label="Delivery Location"
              name="deliveryLocation"
              type="text"
              value={filters.deliveryLocation}
              onChange={handleChange}
              placeholder="Enter city or address"
            />
          </div>
        </div>
      )}
    </div>
  );
});

FilterInput.displayName = 'FilterInput';
LoadFilters.displayName = 'LoadFilters';

export default LoadFilters;
