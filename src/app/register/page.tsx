"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(
      `http://127.0.0.1:8000/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      { method: "POST" }
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.detail || "Something went wrong");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-6">Create Your Kubys Account</h1>
      {success ? (
        <p className="text-green-600">Account created! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="bg-black text-white rounded-lg px-4 py-2">
            Register
          </button>
        </form>
      )}
    </main>
  );
}