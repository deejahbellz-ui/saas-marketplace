"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type AdminOrder = {
  id: number;
  buyer_email: string;
  product_name: string;
  price: number;
  quantity: number;
};

export default function AdminOrders() {
  const { token, isAdmin } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetch("https://saas-marketplace-ngmm.onrender.com/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch(() => setError("Could not load orders."));
  }, [token, isAdmin]);

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p>Only the store admin can view this page.</p>
      </main>
    );
  }

  const total = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);

  return (
    <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order History</h1>
        <Link href="/browse" className="text-sm underline">Back to Browse</Link>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {orders.length === 0 && !error && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o.id} className="border-b border-gray-500 py-3 flex justify-between">
          <div>
            <p className="font-semibold">{o.product_name} x {o.quantity}</p>
            <p className="text-gray-300 text-sm">{o.buyer_email}</p>
          </div>
          <p>₦{o.price * o.quantity}</p>
        </div>
      ))}

      {orders.length > 0 && <p className="text-xl font-bold mt-6">Total sales: ₦{total}</p>}
    </main>
  );
}