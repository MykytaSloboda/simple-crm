"use client";

import { mutate } from "swr";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewMember() {
    const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newMember = {
      name: formData.get("name"),
      phone_number: formData.get("phone_number"),
      email: formData.get("email"),
      role: formData.get("role"),
    };

    const response = await fetch("/api/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMember),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error details:', errorResponse);
        throw new Error("Failed to create new member");
    }

    mutate("/api/team");
    router.push("/team");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20">
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="John"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="phone_number"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Phone number
        </label>
        <input
          type="tel"
          name="phone_number"
          id="phone_number"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="+11111111111"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="example@mail.com"
          required
        />
      </div>

      <label
        htmlFor="role"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Role
      </label>
      <select
        name="role"
        id="role"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-10"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Submit
      </button>
    </form>
  );
}
