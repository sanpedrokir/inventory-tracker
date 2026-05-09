"use client";

import { useEffect, useState } from "react";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
};

export default function InventoryApp() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  async function loadItems() {
    const res = await fetch("/api/items", { cache: "no-store" });
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        quantity: Number(quantity),
        location,
      }),
    });

    setName("");
    setCategory("");
    setQuantity("");
    setLocation("");

    await loadItems();
  }

  async function updateQuantity(id: number, quantity: number) {
    await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    await loadItems();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">Inventory Tracker</h1>
       <h2 className="mb-6 text-lg text-gray-600">
          AppKir says: This is a full stack application created using Next.js App Router app, Typescript project, Tailwind UI, Prisma ORM, PostgreSQL database on Supabase, API routes, CRUD inventory functionality and Live deployment on Vercel. 
        </h2>

        <form
          onSubmit={addItem}
          className="mb-8 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-5"
        >
          <input
            className="rounded border border-gray-300 bg-white p-2 text-gray-900"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="rounded border border-gray-300 bg-white p-2 text-gray-900"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            className="rounded border border-gray-300 bg-white p-2 text-gray-900"
            placeholder="Quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <input
            className="rounded border border-gray-300 bg-white p-2 text-gray-900"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Add Item
          </button>
        </form>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Update Quantity</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.location}</td>
                  <td className="p-3">
                    {item.quantity < 5 ? (
                      <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                        Low Stock
                      </span>
                    ) : (
                      <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      className="w-24 rounded border border-gray-300 bg-white p-2 text-gray-900"
                      type="number"
                      min="0"
                      defaultValue={item.quantity}
                      onBlur={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={6}>
                    No inventory items yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}