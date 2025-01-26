"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Gadgets() {
  interface Gadget {
    id: string;
    name: string;
    status: string;
  }

  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const router = useRouter();
  const getGadgets = async () => {
    const res = await fetch("/api/gadgets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }
    const data = await res.json();
    setGadgets(data);
  };

  const addGadget = async () => {
    const res = await fetch("/api/gadgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getGadgets();
  };

  const updateGadget = async (gadget: Gadget) => {
    const res = await fetch("/api/gadgets", {
      method: "PATCH",
      body: JSON.stringify({
        id: gadget.id,
        name: "updated",
        status: "Deployed",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getGadgets();
  };

  const deleteGadget = async (id: string) => {
    const res = await fetch("/api/gadgets", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getGadgets();
  };

  useEffect(() => {
    getGadgets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gadgets</h1>
      <button
        className="bg-green-500 text-white px-2 py-1 rounded mb-5"
        onClick={addGadget}
      >
        Add
      </button>
      <table className="min-w-full bg-white border border-gray-200 text-black text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Gadget Name</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Edit/Update</th>
          </tr>
        </thead>
        <tbody>
          {gadgets.map((gadget) => (
            <tr key={gadget.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{gadget.name}</td>
              <td className="py-2 px-4 border-b">{gadget.status}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => updateGadget(gadget)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteGadget(gadget.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
