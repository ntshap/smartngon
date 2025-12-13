"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { checkIsAdmin } from "@/lib/admin-queries";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Sign in with Supabase
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError("Email atau password salah");
                setIsLoading(false);
                return;
            }

            // Check if user is admin
            const isAdmin = await checkIsAdmin();

            if (!isAdmin) {
                await supabase.auth.signOut();
                setError("Anda tidak memiliki akses admin");
                setIsLoading(false);
                return;
            }

            // Redirect to dashboard
            router.push("/admin/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Terjadi kesalahan, silakan coba lagi");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
                        <span className="text-xl font-bold text-white">SN</span>
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold text-slate-900">
                        Admin Panel
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Smart Ngangon Content Management
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@smartngangon.com"
                                required
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-lime-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-lime-500/30 transition-all hover:bg-lime-600 hover:shadow-lime-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Memverifikasi...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    <span>Masuk ke Admin</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to Home */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    <Link
                        href="/"
                        className="text-lime-600 hover:text-lime-700 hover:underline"
                    >
                        ← Kembali ke website
                    </Link>
                </p>
            </div>
        </div>
    );
}
