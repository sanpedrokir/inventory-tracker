"use client";

import { useEffect, useState } from "react";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
};

type AppUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function InventoryApp() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  async function loadItems() {
    const res = await fetch("/api/items", { cache: "no-store" });
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    if (!res.ok) {
      alert("Invalid email or password.");
      return;
    }

    const user = await res.json();
    setCurrentUser(user);
    setLoginEmail("");
    setLoginPassword("");
  }

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
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert("Update failed: " + errorText);
      return;
    }

    await loadItems();
    alert("Stock quantity updated successfully.");
  }

  async function checkoutItem(id: number) {
    if (!currentUser) {
      alert("Please login first before checking out an item.");
      return;
    }

    const res = await fetch(`/api/items/${id}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.id,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert("Checkout failed: " + errorText);
      return;
    }

    await loadItems();
    alert("Item checked out successfully. Quantity reduced by 1.");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">Inventory Tracker</h1>

        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-gray-700 shadow">
          <p className="mb-2 font-semibold">
            A full-stack application VS Code built with:
          </p>

          <ul className="list-disc space-y-1 pl-5">
            <li>Next.js</li>
            <li>App Router</li>
            <li>TypeScript</li>
            <li>Tailwind CSS UI</li>
            <li>Prisma ORM</li>
            <li>PostgreSQL database on Supabase</li>
            <li>API Routes</li>
            <li>CRUD inventory functionality</li>
            <li>GitHub and live deployment on Vercel</li>
          </ul>
        </div>

        {!currentUser ? (
          <form
            onSubmit={login}
            className="mb-6 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-3"
          >
            <input
              className="rounded border border-gray-300 bg-white p-2 text-gray-900"
              placeholder="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <input
              className="rounded border border-gray-300 bg-white p-2 text-gray-900"
              placeholder="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="mb-6 flex items-center justify-between rounded bg-green-50 p-4 text-sm text-green-800">
            <div>
              Logged in as <strong>{currentUser.name}</strong> (
              {currentUser.role})
            </div>

            <button
              type="button"
              className="rounded bg-gray-700 px-3 py-1 text-white hover:bg-gray-800"
              onClick={() => setCurrentUser(null)}
            >
              Logout
            </button>
          </div>
        )}

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

          <select
            className="rounded border border-gray-300 bg-white p-2 text-gray-900"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Others">Others</option>
          </select>

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

        <div className="mb-4 rounded bg-yellow-50 p-3 text-sm text-yellow-800">
          Note: Items with quantity below 50 will be marked as Low Stock.
        </div>

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
                <th className="p-3">Check Out</th>
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
                    {item.quantity < 50 ? (
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
                    <div className="flex items-center gap-2">
                      <input
                        className="w-24 rounded border border-gray-300 bg-white p-2 text-gray-900"
                        type="number"
                        min="0"
                        defaultValue={item.quantity}
                        id={`quantity-${item.id}`}
                      />

                      <button
                        type="button"
                        className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        onClick={async () => {
                          const input = document.getElementById(
                            `quantity-${item.id}`
                          ) as HTMLInputElement;

                          await updateQuantity(item.id, Number(input.value));
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      className="rounded bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                      onClick={() => checkoutItem(item.id)}
                      disabled={!currentUser || item.quantity <= 0}
                    >
                      Check Out
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={7}>
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