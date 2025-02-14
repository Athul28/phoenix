"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function Gadgets() {
  interface Gadget {
    id: string;
    name: string;
    status: string;
    missionSuccessProbability: string;
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
    console.log(data);
    setGadgets(data);
  };

  const addGadget = async () => {
    await fetch("/api/gadgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getGadgets();
  };

  const updateGadget = async (gadget: Gadget) => {
    await fetch("/api/gadgets", {
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
    await fetch("/api/gadgets", {
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
    <div className="flex flex-col items-center p-10 min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900">
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
            <th className="py-2 px-4 border-b">Sucess Rate</th>
            <th className="py-2 px-4 border-b">Edit/Update</th>
          </tr>
        </thead>
        <tbody>
          {gadgets
            ? gadgets.map((gadget) => (
                <tr key={gadget.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{gadget.name}</td>
                  <td className="py-2 px-4 border-b">{gadget.status}</td>
                  <td className="py-2 px-4 border-b">
                    {gadget.missionSuccessProbability}
                  </td>
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
              ))
            : null}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}
