"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be logged in to add a product.");
      return;
    }

    let imageUrl = "";

    // Step 1: upload the image first, if one was selected
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("https://saas-marketplace-ngmm.onrender.com/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) {
        setError("Image upload failed.");
        return;
      }

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    // Step 2: create the product, including the image URL
    const productRes = await fetch(
      `https://saas-marketplace-ngmm.onrender.com/items?name=${encodeURIComponent(name)}&price=${price}&image_url=${encodeURIComponent(imageUrl)}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!productRes.ok) {
      setError("Failed to create product.");
      return;
    }

    router.push("/browse");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-6">Add a New Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="number"
          placeholder="Price (₦)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white rounded-lg px-4 py-2">
          Add Product
        </button>
      </form>
    </main>
  );
}