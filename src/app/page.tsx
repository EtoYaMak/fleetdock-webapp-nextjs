"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { membershipTiers } from "@/config/membershipTiers";

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

const TierContent = function TierContent() {
  const [selectedRole, setSelectedRole] = useState<"trucker" | "broker">(
    "trucker"
  );

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4 mt-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Role Toggle */}
      <motion.div
        className="flex justify-center gap-4 mb-12"
        variants={childVariants}
      >
        <button
          onClick={() => setSelectedRole("trucker")}
          className={`px-6 py-2 rounded-full transition-all shadow-lg duration-300 font-medium ${
            selectedRole === "trucker"
              ? "bg-primary text-white shadow-primary/30 hover:shadow-primary/50 scale-105"
              : "bg-secondary/10 hover:bg-secondary/20"
          }`}
        >
          Trucker
        </button>
        <button
          onClick={() => setSelectedRole("broker")}
          className={`px-6 py-2 rounded-full transition-all shadow-lg duration-300 font-medium ${
            selectedRole === "broker"
              ? "bg-primary text-white shadow-primary/30 hover:shadow-primary/50 scale-105"
              : "bg-secondary/10 hover:bg-secondary/20"
          }`}
        >
          Broker
        </button>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {Object.entries(membershipTiers[selectedRole]).map(
          ([tier, details]) => (
            <motion.div
              key={tier}
              variants={childVariants}
              className={`rounded-2xl p-6 ${
                tier === "premium"
                  ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
                  : "bg-card"
              } border shadow-lg hover:shadow-xl transition-all`}
            >
              <h3 className="text-2xl font-bold capitalize mb-2">{tier}</h3>
              <div className="text-3xl font-bold mb-6">
                ${details.price}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </div>

              <ul className="space-y-3">
                {Object.entries(details.features).map(([feature, value]) => (
                  <li key={feature} className="flex items-center gap-2">
                    {value ? (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span className="capitalize">
                      {feature.replace(/_/g, " ")}:{" "}
                    </span>
                    <span className="font-medium">
                      {value === true
                        ? "Yes"
                        : value === false
                        ? "No"
                        : String(value)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`mt-6 w-full inline-block text-center px-6 py-3 rounded-xl ${
                  tier === "enterprise"
                    ? "bg-primary text-white"
                    : "bg-secondary/80 text-secondary-foreground hover:bg-secondary"
                } transition-all`}
              >
                Get Started
              </Link>
            </motion.div>
          )
        )}
      </motion.div>
    </motion.div>
  );
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
      {/*   <motion.div className="mt-6" variants={childVariants}>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary/70 text-lg font-medium rounded-3xl text-white
            "
        >
          Get Started
        </Link>
      </motion.div> */}
    </motion.div>
  );
};

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/loads");
      setIsClient(true);
    } else {
      setIsClient(false);
    }
  }, [user, router]);

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-6 py-20 text-center">
        {!user && !isClient ? (
          <>
            <HeroContent />
            <TierContent />
          </>
        ) : (
          <Loading />
        )}
      </section>
    </main>
  );
}
