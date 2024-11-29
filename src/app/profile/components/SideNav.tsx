"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { FiUser, FiTruck, FiPackage } from "react-icons/fi";
import { RiTruckFill, RiMedalFill } from "react-icons/ri";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: { id: string; label: string }[];
}

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({ activeTab, setActiveTab }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { profile } = useAuth();

  const truckerNavItems: NavItem[] = [
    {
      id: "profile",
      label: "My Profile",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      id: "vehicles",
      label: "Vehicles",
      icon: <FiTruck className="w-5 h-5" />,
      subItems: [{ id: "register-vehicle", label: "Register Vehicle" }],
    },
  ];

  const brokerNavItems: NavItem[] = [
    {
      id: "profile",
      label: "My Profile",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      id: "company",
      label: "Company",
      icon: <FiPackage className="w-5 h-5" />,
      subItems: [{ id: "licenses", label: "Licenses & Certificates" }],
    },
  ];

  const navItems =
    profile?.role === "trucker" ? truckerNavItems : brokerNavItems;

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white p-4 rounded-r-xl shadow-xl "
    >
      <div className="mb-8">
        <motion.div
          className="flex items-center justify-center p-4 bg-transparent rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          {profile?.role === "trucker" ? (
            <RiTruckFill className="w-8 h-8 text-blue-400" />
          ) : (
            <RiMedalFill className="w-8 h-8 text-amber-400" />
          )}
          <span className="ml-2 font-semibold capitalize">
            {profile?.role} Profile
          </span>
        </motion.div>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => (
          <div key={item.id}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-700"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </motion.button>

            {item.subItems && expandedItem === item.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 mt-2 space-y-2"
              >
                {item.subItems.map((subItem) => (
                  <motion.button
                    key={subItem.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(subItem.id)}
                    className={`w-full p-2 rounded-md text-sm transition-colors ${
                      activeTab === subItem.id
                        ? "bg-blue-500/20 text-blue-400"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    {subItem.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default SideNav;
