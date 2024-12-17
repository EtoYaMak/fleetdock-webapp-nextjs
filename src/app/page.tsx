"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Loading from "./loading";
import { Suspense } from "react";
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

const HeroContent = function HeroContent() {
  return (
    <motion.div
      className="max-w-3xl mx-auto  select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl md:text-6xl font-bold leading-tight"
        variants={childVariants}
      >
        Revolutionize Your Logistics
      </motion.h1>
      <motion.p
        className="mt-4 text-lg text-muted-foreground"
        variants={childVariants}
      >
        Simplify freight management with cutting-edge technology. Whether
        you&apos;re a trucker or a broker, we&apos;ve got you covered.
      </motion.p>
      <motion.div className="mt-6" variants={childVariants}>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary/70 text-lg font-medium rounded-3xl text-white
            "
        >
          Get Started
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center ">
      <section className="container mx-auto px-6 text-center ">
        <h1>{isClient ? <HeroContent /> : <Loading />}</h1>
      </section>
    </main>
  );
}
