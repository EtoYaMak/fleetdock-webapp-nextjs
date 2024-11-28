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

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

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

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 text-gray-900 font-bold text-xl"
            >
              FleetDock
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            ) : user ? (
              <>
                {/* Role-specific icon */}
                <div className="flex items-center text-gray-600">
                  {getRoleIcon()}
                  <span className="ml-2 capitalize">{profile?.role}</span>
                </div>

                {/* Dashboard Link */}
                <Link
                  href={getDashboardLink()}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                {/* Profile Menu */}
                <div className="relative ml-3 flex items-center space-x-4">
                  <Link
                    href={getProfileLink()}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <FiUser className="h-5 w-5" />
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
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
