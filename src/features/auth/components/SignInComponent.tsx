'use client'

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {message} from "antd";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const [empNo, setEmpNo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        const result = loginSchema.safeParse({ email: empNo, password });
        if (!result.success) {
            const firstError = result.error.errors[0]?.message;
            setError(firstError);
            return;
        }

        try {
            const res = await fetch(`/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result.data),
            });

            if (!res.ok) throw new Error("Login failed");

            message.success("Login successful");
            router.push("/project/1");
        } catch (err) {
            console.error(err);
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input
                    type="text"
                    placeholder="Employee No."
                    className="w-full px-4 py-2 border rounded mb-4"
                    value={empNo}
                    onChange={(e) => setEmpNo(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
