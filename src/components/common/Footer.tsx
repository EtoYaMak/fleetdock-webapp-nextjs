const Footer = function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-none py-6 h-[15vh] w-full flex items-center justify-center border-t border-muted-foreground/60 mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center  text-muted-foreground">
        © {currentYear} FleetDock. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
