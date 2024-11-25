"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("trucker");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        username,
        phone,
        role,
        type: "signup",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Something went wrong.");
      return;
    }

    router.push("/signin");
  };

  return (
    <form
      onSubmit={handleSignup}
      className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Create an Account
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
        className="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 dark:text-gray-300"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 dark:text-gray-300"
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 dark:text-gray-300"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded-md text-gray-700 dark:text-gray-300"
        required
      >
        <option value="trucker">Trucker</option>
        <option value="broker">Broker</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        Sign Up
      </button>
    </form>
  );
}
