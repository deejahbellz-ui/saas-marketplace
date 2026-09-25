"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    for (const item of items) {
      await fetch(
        `https://saas-marketplace-ngmm.onrender.com/orders?product_id=${item.id}&quantity=${item.quantity}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    setMessage("Order placed successfully!");
    clearCart();
  };

  if (items.length === 0 && !message) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {message && <p className="text-green-600 mb-6">{message}</p>}

      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-gray-200 py-4"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-gray-600">₦{item.price} each</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-lg px-2 py-1"
            />
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-8">
          <p className="text-xl font-bold mb-4">Total: ₦{total}</p>
          <button
            onClick={handleCheckout}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Checkout
          </button>
        </div>
      )}
    </main>
  );
}