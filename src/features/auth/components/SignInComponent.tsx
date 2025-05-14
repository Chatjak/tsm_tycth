'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { message } from "antd";
import { useLoginMutation } from "@/stores/redux/api/authApi";


const loginSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const [empNo, setEmpNo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [login, { isLoading, isError }] = useLoginMutation();

    const handleLogin = async () => {
        setError("");

        const result = loginSchema.safeParse({
            email: empNo,
            password: password,
        });

        if (!result.success) {
            const firstError = result.error.errors[0]?.message;
            setError(firstError);
            return;
        }

        try {
            await login({
                email: empNo,
                password: password,
            });

            if (isError) {
                setError("Login failed. Please check your credentials.");
            } else {
                message.success({ content: "Login successful!" });
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Left side - Login form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Please sign in to your account</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="empNo">
                                Employee ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="empNo"
                                    type="text"
                                    placeholder="Enter your employee ID"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={empNo}
                                    onChange={(e) => setEmpNo(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center">
                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            {`Don't have an account?`}{" "}
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Contact Admin
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Decorative image */}
            <div className="hidden md:flex md:w-1/2 bg-blue-600 justify-center items-center">
                <div className="max-w-md text-center text-white p-8">
                    <h2 className="text-4xl font-bold mb-6">Company Portal</h2>
                    <p className="text-xl mb-6">Access your projects and team resources all in one place</p>
                    <div className="w-64 h-64 mx-auto bg-white rounded-full flex items-center justify-center">
                        {/* You can replace this with your company logo */}
                        <div className="text-blue-600 font-bold text-4xl">LOGO</div>
                    </div>
                </div>
            </div>
        </div>
    );
}