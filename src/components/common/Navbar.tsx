"use client";
import Link from "next/link";
import { User, LogOutIcon } from "lucide-react";
import { FiUser, FiPackage } from "react-icons/fi";
import { useMemo, useState, useEffect, useCallback } from "react";
import { TbLayoutDashboard } from "react-icons/tb";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/common/themeToggle";
import { Button } from "@/components/ui/button";
import NavLoadingSkeleton from "@/components/common/navloadingskeleton";
import { NotificationList } from "@/components/notifications/notificationList";
import { NewMessageNotfier } from "@/components/chat/NewMessageNotfier";
import { useRouter } from "next/navigation";

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
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  //tier pill colors
  const tierColors = {
    starter: "text-foreground",
    professional: "bg-primary/90 rounded-full px-2 text-white  shadow-md",
    enterprise: "bg-primary rounded-full px-2 text-white shadow-md",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wrap handleSignOut with useCallback
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      // Clear any session storage
      sessionStorage.clear();
      // Force a router refresh after signout
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [signOut, router]); // Add dependencies used inside handleSignOut

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
          {/* If Admin show /admin if not show /dashboard */}
          <NavLink
            href={user?.is_admin ? "/admin" : "/dashboard"}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
              hover:bg-muted transition-all duration-300"
          >
            <NavIcon icon={TbLayoutDashboard} className="h-5 w-5 text-primary" />
            {user?.is_admin ? "Admin" : "Dashboard"}
          </NavLink>

          <div className="relative ml-3 flex items-center space-x-4">
            <NavLink
              href="/me"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
              hover:bg-muted transition-all duration-300"
            >
              <User className="h-5 w-5" />
            </NavLink>

            <NotificationList userId={user.id} />
            <NewMessageNotfier />

            <Button
              onClick={handleSignOut}
              variant="default"
              size="icon"
              disabled={loading}
            >
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
  }, [user, loading, mounted, handleSignOut]);

  // Add an effect to handle auth state changes
  useEffect(() => {
    const handleAuthStateChange = () => {
      router.refresh();
    };

    window.addEventListener('auth-state-change', handleAuthStateChange);
    return () => {
      window.removeEventListener('auth-state-change', handleAuthStateChange);
    };
  }, [router]);

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center ">

            <NavLink
              href={user && user?.role ? "/dashboard" : "/"}
              className="flex items-center px-2 text-primary font-bold text-xl"
            >
              FleetDock{" "}
              <span
                className={`text-[0.55rem] p-0 ${tierColors[user?.membership_tier as keyof typeof tierColors]
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
