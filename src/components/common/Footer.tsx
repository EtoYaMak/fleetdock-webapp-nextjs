export default function Footer() {
  return (
    <footer
      className="bg-white dark:bg-gray-800 py-6 border-t border-gray-300 
    h-[25vh]
    "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <p className="text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} FleetDock. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
