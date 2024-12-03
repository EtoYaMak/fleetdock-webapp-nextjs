"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiUser, FiLogOut, FiTruck, FiPackage } from "react-icons/fi";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* if role not null/undefined then redirect to repsective dashboard */}
            {user && user.role ? (
              <Link
                href={`/dashboard`}
                className="flex items-center px-2 text-[#f1f0f3] font-bold text-xl"
              >
                FleetDock
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center px-2 text-[#f1f0f3] font-bold text-xl"
              >
                FleetDock
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-[#203152] rounded"></div>
            ) : user ? (
              <>
                {/* Role-specific icon */}
                <div className="flex items-center text-[#f1f0f3]">
                  {user.role === "trucker" ? (
                    <FiTruck className="h-5 w-5" />
                  ) : (
                    <FiPackage className="h-5 w-5" />
                  )}
                </div>

                {/* Dashboard Link */}
                <Link
                  href={`/dashboard`}
                  className="text-[#f1f0f3]/80 hover:text-[#f1f0f3] px-3 py-2 rounded-md text-sm font-medium
                   hover:bg-[#203152]  hover:scale-105 transition-all duration-300"
                >
                  Dashboard
                </Link>

                {/* Profile Menu */}
                <div className="relative ml-3 flex items-center space-x-4">
                  <Link
                    href={`/profile`}
                    className="flex items-center text-[#f1f0f3]/80 hover:text-[#f1f0f3] p-2 hover:bg-[#203152] rounded-md group"
                  >
                    <FiUser className="h-5 w-5 group-hover:scale-110 transition-all duration-300" />
                  </Link>

                  <button
                    onClick={signOut}
                    className="flex items-center text-[#f1f0f3]/80 hover:text-[#f1f0f3] p-2 hover:bg-[#203152] rounded-md group"
                  >
                    <FiLogOut className="h-5 w-5 group-hover:scale-110 transition-all duration-300" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/signin"
                  className=" text-[#4895d0]  hover:bg-[#f1f0f3] px-4 py-2 rounded-3xl text-sm font-medium uppercase transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-[#4895d0]   hover:bg-[#f1f0f3] px-4 py-2 rounded-3xl text-sm font-medium uppercase transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
