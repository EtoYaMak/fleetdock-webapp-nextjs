import { memo } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = memo(function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-1 w-full bg-muted-foreground/20 rounded-full mb-4">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-primary rounded-full"
        transition={{ duration: 0.3 }}
      />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
