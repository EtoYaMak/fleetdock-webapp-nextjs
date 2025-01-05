"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { membershipTiers } from "@/config/membershipTiers";
import { FiTruck, FiPackage } from "react-icons/fi";

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
      className="w-full max-w-6xl mx-auto px-4 mt-24  bg-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Updated Role Toggle */}
      <motion.div
        className="flex flex-col items-center gap-6 mb-12"
        variants={childVariants}
      >
        <h2 className="text-xl font-bold text-center mb-2 underline text-muted-foreground">
          Choose Your Role
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedRole("trucker")}
            className={`px-8 py-3 rounded-xl transition-all shadow-lg duration-300 font-medium flex gap-3 items-center justify-center text-lg min-w-[160px] ${
              selectedRole === "trucker"
                ? "bg-primary text-white shadow-primary/30 hover:shadow-primary/50 scale-105"
                : "bg-secondary/10 hover:bg-secondary/20"
            }`}
          >
            <FiTruck size={24} /> Trucker
          </button>
          <button
            onClick={() => setSelectedRole("broker")}
            className={`px-8 py-3 rounded-xl transition-all shadow-lg duration-300 font-medium flex gap-3 items-center justify-center text-lg min-w-[160px] ${
              selectedRole === "broker"
                ? "bg-primary text-white shadow-primary/30 hover:shadow-primary/50 scale-105"
                : "bg-secondary/10 hover:bg-secondary/20"
            }`}
          >
            <FiPackage size={24} /> Broker
          </button>
        </div>
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
              className={`rounded-2xl p-6
               ${
                 tier === "professional"
                   ? "bg-gradient-to-br from-primary/40 to-primary/20 border-primary/20"
                   : "bg-card"
               }
               ${
                 tier === "enterprise"
                   ? "bg-gradient-to-br from-primary to-primary/60 border-primary/20 text-white"
                   : "bg-card"
               }
                border shadow-lg hover:shadow-xl transition-all`}
            >
              <h3 className="text-2xl font-bold capitalize mb-2 flex items-center gap-2 justify-center">
                {selectedRole === "trucker" ? <FiTruck /> : <FiPackage />}
                {tier}
              </h3>
              <div className="text-3xl font-bold mb-6">
                ${details.price}
                <span
                  className={`text-base font-normal text-muted-foreground ${
                    tier === "enterprise" ? "text-white" : ""
                  }`}
                >
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
                    <span className="capitalize font-medium">
                      {feature.replace(/_/g, " ")}:{" "}
                    </span>
                    <span className="font-semibold">
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
                href={`/signup?role=${selectedRole}&tier=${tier}`}
                className={`mt-6 w-full inline-block text-center px-6 py-3 rounded-xl font-semibold ${
                  tier === "enterprise"
                    ? "bg-primary text-white"
                    : "bg-secondary/80 text-secondary-foreground hover:bg-secondary "
                } 
                
                  transition-all`}
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
      className="max-w-3xl mx-auto  select-none bg-none"
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
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-background/5">
      <section className="container mx-auto px-6 py-20 text-center bg-none">
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
