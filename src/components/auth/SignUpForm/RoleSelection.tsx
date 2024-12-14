import { memo } from "react";
import { motion } from "framer-motion";
import { FiTruck, FiPackage } from "react-icons/fi";

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

const RoleSelection = memo(function RoleSelection({
  onRoleSelect,
}: RoleSelectionProps) {
  return (
    <div className="min-h-screen w-full min-w-full bg-gradient-to-b to-[#283d67] from-[#203152]">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center text-white mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to FleetDock</h1>
          <p className="text-xl opacity-90">Choose your journey</p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <RoleCard
            role="trucker"
            icon={FiTruck}
            title="Trucker"
            description="Find the perfect loads and maximize your earnings"
            onClick={() => onRoleSelect("trucker")}
          />
          <RoleCard
            role="broker"
            icon={FiPackage}
            title="Broker"
            description="Connect with reliable truckers and manage shipments"
            onClick={() => onRoleSelect("broker")}
          />
        </div>
      </div>
    </div>
  );
});

const RoleCard = memo(function RoleCard({
  role,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  role: string;
  icon: typeof FiTruck;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-[#4895d0]/10 backdrop-blur-sm rounded-2xl p-8 text-[#f1f0f3] 
        border-2 border-[#f1f0f3]/20 hover:border-[#f1f0f3]/40 transition-all"
    >
      <Icon className="w-12 h-12 mb-4 mx-auto" />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="opacity-80">{description}</p>
    </motion.button>
  );
});

RoleSelection.displayName = "RoleSelection";
RoleCard.displayName = "RoleCard";

export default RoleSelection;
