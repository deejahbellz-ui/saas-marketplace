"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { token, logout } = useAuth();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/logo.png')" }}
    >
      <div className="bg-white/80 rounded-xl p-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Kubys</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          Bags, veils, and scarves crafted for the modern woman.
        </p>
        <div className="flex gap-4">
          <Link href="/browse" className="px-6 py-3 bg-black text-white rounded-lg">
            Browse Collection
          </Link>
          {token ? (
            <button
              onClick={logout}
              className="px-6 py-3 border border-gray-300 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="px-6 py-3 border border-gray-300 rounded-lg">
                Login
              </Link>
              <Link href="/register" className="px-6 py-3 border border-gray-300 rounded-lg">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}