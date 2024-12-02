"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiTruck, FiPackage } from "react-icons/fi";

export default function Navbar() {
  const { user, profile, signOut, isLoading } = useAuth();
  const { isTrucker, isBroker } = useRole();
  const router = useRouter();

  const getDashboardLink = () => {
    if (isTrucker) return "/dashboard/trucker";
    if (isBroker) return "/dashboard/broker";
    return "/";
  };

  const getProfileLink = () => {
    return "/profile";
  };

  const getRoleIcon = () => {
    if (isTrucker) return <FiTruck className="h-5 w-5" />;
    if (isBroker) return <FiPackage className="h-5 w-5" />;
    return null;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 text-[#f1f0f3] font-bold text-xl"
            >
              FleetDock
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse h-8 w-20 bg-[#203152] rounded"></div>
            ) : user ? (
              <>
                {/* Role-specific icon */}
                <div className="flex items-center text-[#f1f0f3]">
                  {getRoleIcon()}
                  <span className="ml-2 capitalize">{profile?.role}</span>
                </div>

                {/* Dashboard Link */}
                <Link
                  href={getDashboardLink()}
                  className="text-[#f1f0f3]/80 hover:text-[#f1f0f3] px-3 py-2 rounded-md text-sm font-medium
                   hover:bg-[#203152]  hover:scale-105 transition-all duration-300"
                >
                  Dashboard
                </Link>

                {/* Profile Menu */}
                <div className="relative ml-3 flex items-center space-x-4">
                  <Link
                    href={getProfileLink()}
                    className="flex items-center text-[#f1f0f3]/80 hover:text-[#f1f0f3] p-2 hover:bg-[#203152] rounded-md group"
                  >
                    <FiUser className="h-5 w-5 group-hover:scale-110 transition-all duration-300" />
                  </Link>

                  <button
                    onClick={handleSignOut}
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
