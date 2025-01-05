import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormData, StageErrors } from "./types";

interface FormStagesProps {
  currentStageIndex: number;
  formData: FormData;
  stageErrors: StageErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormStages = memo(function FormStages({
  currentStageIndex,
  formData,
  stageErrors,
  handleInputChange,
}: FormStagesProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStageIndex}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentStageIndex === 0 ? (
          <BasicInfoStage
            formData={formData}
            error={stageErrors[0]}
            onChange={handleInputChange}
          />
        ) : (
          <ContactDetailsStage
            formData={formData}
            error={stageErrors[1]}
            onChange={handleInputChange}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
});

const BasicInfoStage = memo(function BasicInfoStage({
  formData,
  error,
  onChange,
}: {
  formData: FormData;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <FormInput
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={onChange}
      />
      <FormInput
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={onChange}
      />
      <FormInput
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
      />
      <FormInput
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
});

const ContactDetailsStage = memo(function ContactDetailsStage({
  formData,
  error,
  onChange,
}: {
  formData: FormData;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <FormInput
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
});

const FormInput = memo(function FormInput({
  type,
  name,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-input/70 placeholder:text-secondary-foreground/70"
      required
    />
  );
});

FormStages.displayName = "FormStages";
BasicInfoStage.displayName = "BasicInfoStage";
ContactDetailsStage.displayName = "ContactDetailsStage";
FormInput.displayName = "FormInput";

export default FormStages;
