"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const NotFound = function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b to-[#283d67] from-[#203152] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-[#f1f0f3] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#f1f0f3] mb-6">
          Page Not Found
        </h2>
        <p className="text-[#f1f0f3]/80 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#4895d0] text-[#f1f0f3] rounded-lg 
            hover:bg-[#4895d0]/80 transition-all duration-300"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

NotFound.displayName = "NotFound";

export default NotFound;
