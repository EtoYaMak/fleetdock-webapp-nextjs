"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiAlertCircle } from "react-icons/fi";
import { LoadFormData, ValidationErrors } from "@/types/loads";
import { useLoadTypes } from "@/hooks/useLoadTypes";

interface LoadFormProps {
  onSubmit: (data: LoadFormData) => Promise<{ success: boolean; error?: string }>;
  initialData?: Partial<LoadFormData>;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

// Memoize form field component
const FormField = memo(function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

// Memoize form input component
const FormInput = memo(function FormInput({
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
}: {
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
    />
  );
});

// Memoize form select component
const FormSelect = memo(function FormSelect({
  name,
  value,
  onChange,
  options,
  required,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string; name: string }[];
  required?: boolean;
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
    >
      <option value="">Select a load type</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
});

const LoadForm = memo(function LoadForm({
  onSubmit,
  initialData,
  isEdit,
  isSubmitting,
}: LoadFormProps) {
  const { loadTypes } = useLoadTypes();
  const [formData, setFormData] = useState<LoadFormData>(() => ({
    load_type_id: initialData?.load_type_id || "",
    load_type_name: initialData?.load_type_name || "",
    weight_kg: initialData?.weight_kg || 0,
    length_cm: initialData?.length_cm || 0,
    width_cm: initialData?.width_cm || 0,
    height_cm: initialData?.height_cm || 0,
    pickup_location: initialData?.pickup_location || { address: "" },
    delivery_location: initialData?.delivery_location || { address: "" },
    distance_manual: initialData?.distance_manual || 0,
    pickup_deadline: initialData?.pickup_deadline || "",
    delivery_deadline: initialData?.delivery_deadline || "",
    budget_amount: initialData?.budget_amount || 0,
    budget_currency: initialData?.budget_currency || "USD",
    special_instructions: initialData?.special_instructions || "",
  }));

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "pickup_location" || name === "delivery_location") {
        return {
          ...prev,
          [name]: { address: value },
        };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.load_type_id) newErrors.load_type_id = "Load type is required";
    if (!formData.weight_kg) newErrors.weight_kg = "Weight is required";
    if (!formData.pickup_location.address) newErrors.pickup_location = "Pickup location is required";
    if (!formData.delivery_location.address) newErrors.delivery_location = "Delivery location is required";
    if (!formData.pickup_deadline) newErrors.pickup_deadline = "Pickup deadline is required";
    if (!formData.delivery_deadline) newErrors.delivery_deadline = "Delivery deadline is required";
    if (!formData.budget_amount) newErrors.budget_amount = "Budget amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedLoadType = loadTypes.find(
      (lt) => lt.id === formData.load_type_id
    );
    const dataToSubmit = {
      ...formData,
      load_type_name: selectedLoadType?.name || "",
    };

    await onSubmit(dataToSubmit);
  }, [formData, loadTypes, onSubmit, validateForm]);

  const formFields = useMemo(() => [
    { name: "load_type_id", label: "Load Type", type: "select" },
    { name: "weight_kg", label: "Weight (kg)", type: "number" },
    { name: "length_cm", label: "Length (cm)", type: "number" },
    { name: "width_cm", label: "Width (cm)", type: "number" },
    { name: "height_cm", label: "Height (cm)", type: "number" },
    { name: "pickup_location", label: "Pickup Location", type: "text" },
    { name: "delivery_location", label: "Delivery Location", type: "text" },
    { name: "distance_manual", label: "Distance (km)", type: "number" },
    { name: "pickup_deadline", label: "Pickup Deadline", type: "date" },
    { name: "delivery_deadline", label: "Delivery Deadline", type: "date" },
    { name: "budget_amount", label: "Budget Amount", type: "number" },
    { name: "budget_currency", label: "Currency", type: "text" },
  ], []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence mode="wait">
        {formFields.map((field) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FormField
              label={field.label}
              error={errors[field.name as keyof ValidationErrors]}
            >
              {field.type === "select" ? (
                <FormSelect
                  name={field.name}
                  value={formData[field.name as keyof LoadFormData] as string}
                  onChange={handleChange}
                  options={loadTypes}
                  required
                />
              ) : (
                <FormInput
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof LoadFormData]}
                  onChange={handleChange}
                  required
                />
              )}
            </FormField>
          </motion.div>
        ))}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Instructions
        </label>
        <textarea
          value={formData.special_instructions}
          onChange={handleChange}
          name="special_instructions"
          rows={4}
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        className={`w-full md:w-auto px-6 py-2 bg-[#2d416d] transition-colors text-[#f1f0f3] rounded-md flex items-center justify-center space-x-2 ${
          isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#4895d0]"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
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
});

FormField.displayName = 'FormField';
FormInput.displayName = 'FormInput';
FormSelect.displayName = 'FormSelect';
LoadForm.displayName = 'LoadForm';

export default LoadForm;
