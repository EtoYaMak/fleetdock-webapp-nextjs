"use client";
import Link from "next/link";
import { FiUser, FiLogOut, FiPackage } from "react-icons/fi";
import { useMemo, useState, useEffect } from "react";
import { TbLayoutDashboard } from "react-icons/tb";
import { useAuth } from "@/context/AuthContext";

const NavLink = function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const NavIcon = function NavIcon({
  icon: Icon,
  className,
}: {
  icon: typeof FiUser;
  className?: string;
}) {
  return <Icon className={className} />;
};

const Navbar = function Navbar() {
  const { user, loading } = useAuth();
  const { signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize navigation items based on user state
  const navigationItems = useMemo(() => {
    if (!mounted) return null;
    if (loading)
      return <div className="animate-pulse h-8 w-20 bg-[#203152] rounded" />;

    if (user) {
      return (
        <>
          <NavLink
            href="/loads"
            className="text-[#f1f0f3]/80 hover:text-[#f1f0f3] px-3 py-2 rounded-md text-sm font-medium
              hover:bg-[#203152] hover:scale-105 transition-all duration-300 flex items-center gap-1"
          >
            <NavIcon icon={FiPackage} className="h-5 w-5" />
            Loads
          </NavLink>

          <NavLink
            href="/dashboard"
            className="text-[#f1f0f3]/80 hover:text-[#f1f0f3] px-3 py-2 rounded-md text-sm font-medium
              hover:bg-[#203152] hover:scale-105 transition-all duration-300 flex items-center gap-1"
          >
            <NavIcon icon={TbLayoutDashboard} className="h-5 w-5 " />
            Dashboard
          </NavLink>

          <div className="relative ml-3 flex items-center space-x-4">
            <NavLink
              href="/profile"
              className="text-[#f1f0f3]/80 hover:text-[#f1f0f3] px-3 py-2 rounded-md text-sm font-medium
              hover:bg-[#203152] hover:scale-105 transition-all duration-300 flex items-center gap-1"
            >
              <NavIcon icon={FiUser} className="h-5 w-5" />
              Profile
            </NavLink>

            <button
              onClick={signOut}
              className="flex items-center text-[#f1f0f3]/80 hover:text-[#f1f0f3] p-2 hover:bg-[#203152] rounded-md group"
            >
              <NavIcon
                icon={FiLogOut}
                className="h-5 w-5 group-hover:scale-110 transition-all duration-300"
              />
            </button>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <NavLink
          href="/signin"
          className="text-[#4895d0] hover:bg-[#f1f0f3] px-4 py-2 rounded-3xl text-sm font-medium uppercase transition-all duration-300"
        >
          Sign In
        </NavLink>
        <NavLink
          href="/signup"
          className="text-[#4895d0] hover:bg-[#f1f0f3] px-4 py-2 rounded-3xl text-sm font-medium uppercase transition-all duration-300"
        >
          Sign Up
        </NavLink>
      </div>
    );
  }, [user, loading, signOut, mounted]);

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavLink
              href={user?.role ? "/dashboard" : "/"}
              className="flex items-center px-2 text-[#f1f0f3] font-bold text-xl"
            >
              FleetDock
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">{navigationItems}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
