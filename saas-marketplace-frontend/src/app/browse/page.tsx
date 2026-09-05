"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

const products = [
  { name: "Tote Bag", price: "₦15,000" },
  { name: "Jersey Veil", price: "₦4,000" },
  { name: "Vintage Scarf", price: "₦3,500" },
  { name: "Plain Scarf", price: "₦3,000" },
];

export default function Browse() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Browse Collection</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-8 w-full max-w-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.name} name={product.name} price={product.price} />
        ))}
      </div>
    </main>
  );
}