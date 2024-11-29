"use client";

import { useState, useEffect } from "react";
import { LoadFormData } from "@/types/load";
import { LoadType } from "@/types/load-type";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { ValidationErrors } from "@/types/load";

interface LoadFormProps {
  onSubmit: (
    data: LoadFormData
  ) => Promise<{ success: boolean; error?: string }>;
  initialData?: Partial<LoadFormData>;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

export default function LoadForm({
  onSubmit,
  initialData,
  isEdit,
  isSubmitting,
}: LoadFormProps) {
  const [loadTypes, setLoadTypes] = useState<LoadType[]>([]);

  useEffect(() => {
    const fetchLoadTypes = async () => {
      try {
        const response = await fetch("/api/load-types");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setLoadTypes(data.loadTypes);
      } catch (error) {
        console.error("Error fetching load types:", error);
      }
    };

    fetchLoadTypes();
  }, []);

  const [formData, setFormData] = useState<LoadFormData>({
    load_type_id: initialData?.load_type_id || "",
    weight_kg: initialData?.weight_kg || 0,
    length_cm: initialData?.length_cm || 0,
    width_cm: initialData?.width_cm || 0,
    height_cm: initialData?.height_cm || 0,
    pickup_location: initialData?.pickup_location || { address: "" },
    delivery_location: initialData?.delivery_location || { address: "" },
    pickup_deadline: initialData?.pickup_deadline || "",
    delivery_deadline: initialData?.delivery_deadline || "",
    budget_amount: initialData?.budget_amount || 0,
    budget_currency: initialData?.budget_currency || "USD",
    special_instructions: initialData?.special_instructions || "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!formData.pickup_location.address.trim()) {
      errors.pickup_location = "Pickup location is required";
      isValid = false;
    }

    if (!formData.delivery_location.address.trim()) {
      errors.delivery_location = "Delivery location is required";
      isValid = false;
    }

    if (!formData.weight_kg || formData.weight_kg <= 0) {
      errors.weight_kg = "Weight must be greater than 0";
      isValid = false;
    }

    if (!formData.pickup_deadline) {
      errors.pickup_deadline = "Pickup deadline is required";
      isValid = false;
    }

    if (!formData.delivery_deadline) {
      errors.delivery_deadline = "Delivery deadline is required";
      isValid = false;
    } else if (
      new Date(formData.delivery_deadline) <= new Date(formData.pickup_deadline)
    ) {
      errors.delivery_deadline =
        "Delivery deadline must be after pickup deadline";
      isValid = false;
    }

    if (!formData.budget_amount || formData.budget_amount <= 0) {
      errors.budget_amount = "Budget amount must be greater than 0";
      isValid = false;
    }

    if (!formData.load_type_id) {
      errors.load_type_id = "Load type is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        throw new Error(result.error || "Failed to submit form");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 p-4 rounded-md"
          >
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 p-4 rounded-md"
          >
            <div className="flex items-center">
              <FiCheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm text-green-700">
                Load {isEdit ? "updated" : "created"} successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location*
          </label>
          <input
            type="text"
            required
            value={formData.pickup_location.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                pickup_location: { address: e.target.value },
              })
            }
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.pickup_location
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {validationErrors.pickup_location && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.pickup_location}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Location*
          </label>
          <input
            type="text"
            required
            value={formData.delivery_location.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                delivery_location: { address: e.target.value },
              })
            }
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.delivery_location
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {validationErrors.delivery_location && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.delivery_location}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)*
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.weight_kg}
            onChange={(e) =>
              setFormData({
                ...formData,
                weight_kg: parseFloat(e.target.value),
              })
            }
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.weight_kg ? "border-red-300" : "border-gray-300"
            }`}
          />
          {validationErrors.weight_kg && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.weight_kg}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length (cm)
          </label>
          <input
            type="number"
            value={formData.length_cm}
            onChange={(e) =>
              setFormData({ ...formData, length_cm: Number(e.target.value) })
            }
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (cm)
          </label>
          <input
            type="number"
            value={formData.width_cm}
            onChange={(e) =>
              setFormData({ ...formData, width_cm: Number(e.target.value) })
            }
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            value={formData.height_cm}
            onChange={(e) =>
              setFormData({ ...formData, height_cm: Number(e.target.value) })
            }
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Deadline*
          </label>
          <input
            type="datetime-local"
            required
            value={formData.pickup_deadline}
            onChange={(e) =>
              setFormData({ ...formData, pickup_deadline: e.target.value })
            }
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.pickup_deadline
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {validationErrors.pickup_deadline && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.pickup_deadline}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Deadline*
          </label>
          <input
            type="datetime-local"
            required
            value={formData.delivery_deadline}
            onChange={(e) =>
              setFormData({ ...formData, delivery_deadline: e.target.value })
            }
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.delivery_deadline
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {validationErrors.delivery_deadline && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.delivery_deadline}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Amount*
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.budget_amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget_amount: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={formData.budget_currency}
            onChange={(e) =>
              setFormData({ ...formData, budget_currency: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Load Type*
          </label>
          <select
            required
            value={formData.load_type_id}
            onChange={(e) =>
              setFormData({ ...formData, load_type_id: e.target.value })
            }
            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.load_type_id
                ? "border-red-300"
                : "border-gray-300"
            }`}
          >
            <option value="">Select Type</option>
            {loadTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {validationErrors.load_type_id && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.load_type_id}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Instructions
        </label>
        <textarea
          value={formData.special_instructions}
          onChange={(e) =>
            setFormData({ ...formData, special_instructions: e.target.value })
          }
          rows={4}
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        className={`w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 ${
          isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <FiSave className="w-5 h-5" />
            <span>{isEdit ? "Update Load" : "Create Load"}</span>
          </>
        )}
      </motion.button>
    </form>
  );
}
