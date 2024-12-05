import { memo } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = memo(function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-1 w-full bg-[#f1f0f3]/20 rounded-full mb-4">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-[#4895d0] rounded-full"
        transition={{ duration: 0.3 }}
      />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
