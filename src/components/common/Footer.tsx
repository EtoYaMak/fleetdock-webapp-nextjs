const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Text */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            FreightPro
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Simplifying logistics with cutting-edge technology.
          </p>
        </div>

        {/* Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="/privacy"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            Contact Us
          </a>
        </div>
      </div>
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} FreightPro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
