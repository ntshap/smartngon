"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
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
                        src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80"
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
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Bergabung dengan Smart Ngangon</h2>
                        <p className="text-slate-300">Mulai investasi ternak cerdas Anda hari ini</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm">Pantau ternak 24/7 dengan AI</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm">Transparansi penuh investasi</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm">Return investasi optimal</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2 xl:w-7/12">
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Buat Akun Baru
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Daftar untuk mulai berinvestasi di peternakan modern.
                        </p>
                    </div>

                    {success ? (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h3>
                            <p className="text-sm text-slate-600">
                                Akun Anda telah dibuat. Mengalihkan ke dashboard...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="fullName"
                                        className="text-sm font-bold text-slate-900"
                                    >
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-bold text-slate-900"
                                    >
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-bold text-slate-900"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Minimal 6 karakter"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Password minimal 6 karakter
                                    </p>
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
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        Daftar Sekarang{" "}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="text-center text-sm font-semibold text-slate-600">
                        Sudah punya akun?{" "}
                        <Link
                            href="/login"
                            className="font-bold text-emerald-600 hover:text-emerald-500"
                        >
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
