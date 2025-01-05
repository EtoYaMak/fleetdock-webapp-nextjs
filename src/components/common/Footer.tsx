const Footer = function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent py-6 h-[25vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center border-t border-muted-foreground/60">
        <p className="text-center  text-muted-foreground">
          © {currentYear} FleetDock. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
