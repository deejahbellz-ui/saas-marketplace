"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
};

export default function Browse() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/items")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Browse Collection</h1>
        <Link href="/cart" className="text-sm underline">View Cart</Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-8 w-full max-w-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-600 mb-3">₦{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-black text-white text-sm px-4 py-2 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}