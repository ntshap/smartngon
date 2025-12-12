"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
    const [accessId, setAccessId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Construct email from Access ID (e.g., USER123 -> USER123@smartngangon.id)
            // And use Access ID as password
            const email = `${accessId.trim()}@smartngangon.id`;
            const password = accessId.trim();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Customize error message for better UX
                if (error.message.includes("Invalid login credentials")) {
                    throw new Error("ID Akses tidak valid. Silakan periksa kembali ID Anda.");
                }
                throw error;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal masuk. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
            {/* Left Side - Image & Branding */}
            <div className="relative hidden w-full flex-col justify-between bg-slate-900 p-12 text-white lg:flex lg:w-1/2 xl:w-5/12">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1484557985045-edf25e08da73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80"
                        alt="Background"
                        className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-900">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M12 5v14" />
                                <path d="m19 12-7 7-7-7" />
                            </svg>
                        </div>
                        Smart Ngangon
                    </Link>
                </div>

                <div className="relative z-10">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed">
                            &ldquo;Platform ini benar-benar mengubah cara saya berinvestasi di peternakan. Transparan, mudah dipantau, dan sangat menguntungkan.&rdquo;
                        </p>
                        <footer className="text-sm font-semibold text-emerald-400">
                            Haji Mamat &mdash; Investor Sejak 2023
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2 xl:w-7/12">
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Selamat Datang
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Masukkan ID Akses yang Anda terima dari Admin via WhatsApp.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="accessId"
                                    className="text-sm font-bold text-slate-900"
                                >
                                    ID Akses
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <KeyRound className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="accessId"
                                        name="accessId"
                                        type="text"
                                        placeholder="Contoh: INVESTOR-001"
                                        required
                                        value={accessId}
                                        onChange={(e) => setAccessId(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Memverifikasi...
                                </>
                            ) : (
                                <>
                                    Masuk Dashboard{" "}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm font-semibold text-slate-600">
                        Belum punya ID?{" "}
                        <Link
                            href="/marketplace"
                            className="font-bold text-emerald-600 hover:text-emerald-500"
                        >
                            Beli Kambing Dulu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
