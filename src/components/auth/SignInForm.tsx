"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, type: "signin" }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid credentials. Please try again.");
      return;
    }

    router.push(data.redirectTo || "/dashboard");
  };

  return (
    <form
      onSubmit={handleSignin}
      className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Sign In
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 dark:text-gray-300"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded-md text-gray-700 dark:text-gray-300"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        Sign In
      </button>
    </form>
  );
}
