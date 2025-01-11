"use client";
import Link from "next/link";
import { User, LogOutIcon } from "lucide-react";
import { FiUser, FiPackage } from "react-icons/fi";
import { useMemo, useState, useEffect } from "react";
import { TbLayoutDashboard } from "react-icons/tb";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/common/themeToggle";
import { Button } from "@/components/ui/button";
import NavLoadingSkeleton from "@/components/common/navloadingskeleton";
import NotificationList from "@/components/notifications/notificationList";
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

  //tier pill colors
  const tierColors = {
    starter: "text-white",
    professional: "bg-primary/90 rounded-full px-2 text-white  shadow-md",
    enterprise: "bg-primary rounded-full px-2 text-white shadow-md",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize navigation items based on user state
  const navigationItems = useMemo(() => {
    if (!mounted) return null;

    if (user) {
      return (
        <>
          <NavLink
            href="/loads"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
              hover:bg-muted transition-all duration-300"
          >
            <NavIcon icon={FiPackage} className="h-5 w-5 text-primary" />
            Loads
          </NavLink>

          <NavLink
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
              hover:bg-muted transition-all duration-300"
          >
            <NavIcon
              icon={TbLayoutDashboard}
              className="h-5 w-5 text-primary"
            />
            Dashboard
          </NavLink>

          <div className="relative ml-3 flex items-center space-x-4">
            <NavLink
              href="/me"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
              hover:bg-muted transition-all duration-300"
            >
              <User className="h-5 w-5 text-primary" />
              Profile
            </NavLink>

            <NotificationList userId={user.id} />

            <Button onClick={signOut} variant="default" size="icon">
              <LogOutIcon className="h-5 w-5 transition-all duration-300" />
            </Button>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <NavLink
          href="/signin"
          className="text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 
          rounded-3xl text-sm font-medium uppercase transition-all duration-200"
        >
          Sign In
        </NavLink>
      </div>
    );
  }, [user, signOut, mounted]);

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavLink
              href={user && user?.role ? "/dashboard" : "/"}
              className="flex items-center px-2 text-primary font-bold text-xl"
            >
              FleetDock{" "}
              <span
                className={`text-[0.55rem] p-0 ${
                  tierColors[user?.membership_tier as keyof typeof tierColors]
                } ml-1 uppercase`}
              >
                {user?.membership_tier}
              </span>
            </NavLink>
          </div>
          {!loading ? (
            <div className="flex items-center space-x-4">
              {navigationItems}
              <ModeToggle />
            </div>
          ) : (
            <NavLoadingSkeleton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
