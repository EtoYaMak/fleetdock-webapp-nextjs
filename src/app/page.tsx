"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Keep your existing animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Memoized components remain the same
const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
  );
});

const HeroContent = memo(function HeroContent() {
  return (
    <motion.div
      className="max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-[#f1f0f3] leading-tight"
        variants={childVariants}
      >
        Revolutionize Your Logistics
      </motion.h1>
      <motion.p
        className="mt-4 text-lg text-[#f1f0f3]"
        variants={childVariants}
      >
        Simplify freight management with cutting-edge technology. Whether
        you&apos;re a trucker or a broker, we&apos;ve got you covered.
      </motion.p>
      <motion.div className="mt-6" variants={childVariants}>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-[#4895d0] text-[#f1f0f3] text-lg font-medium rounded-3xl 
            hover:bg-[#4895d0]/80 transition-colors duration-300"
        >
          Get Started
        </Link>
      </motion.div>
    </motion.div>
  );
});

function HomePage() {
  const { loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize the main content to prevent unnecessary re-renders
  const content = useMemo(() => {
    // Only render content if we're on the client and loading state is resolved
    if (!isClient || loading) {
      return <LoadingSpinner />;
    }
    return <HeroContent />;
  }, [isClient, loading]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">{content}</div>
    </main>
  );
}

export default memo(HomePage);
