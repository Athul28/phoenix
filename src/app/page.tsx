"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900">
      <h1 className="text-5xl font-extrabold mb-12 text-white">Welcome to Gadgets Store</h1>
      <div className="space-y-6 space-x-4">
      <button
        className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 mb-4"
        onClick={() => router.push("/gadgets")}
      >
        Check Out Gadgets
      </button>
      <button
        className="px-8 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 mb-4"
        onClick={() => router.push("/auth/signup")}
      >
        Sign Up
      </button>
      <button
        className="px-8 py-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105"
        onClick={() => router.push("/auth/login")}
      >
        Log In
      </button>
      </div>
    </div>
  );
}
