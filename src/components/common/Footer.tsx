export default function Footer() {
  return (
    <footer
      className="bg-transparent py-6  
    h-[25vh]
    "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center border-t border-[#f1f0f3]/20">
        <p className="text-center text-[#f1f0f3]">
          © {new Date().getFullYear()} FleetDock. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
