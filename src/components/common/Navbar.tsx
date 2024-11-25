import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="text-2xl font-bold text-gray-900 dark:text-white">
            FreightPro
          </a>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard/trucker">
            <a className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Trucker
            </a>
          </Link>
          <Link href="/dashboard/broker">
            <a className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Broker
            </a>
          </Link>
          <Link href="/profile">
            <a className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Profile
            </a>
          </Link>
        </nav>

        {/* Theme Toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
