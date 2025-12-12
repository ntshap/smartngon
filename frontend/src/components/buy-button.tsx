"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, CheckCircle } from "lucide-react";
import { buyGoat, type Goat } from "@/lib/supabase-queries";

interface BuyButtonProps {
    goat: Goat;
}

export default function BuyButton({ goat }: BuyButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleBuy = async () => {
        if (!confirm(`Apakah Anda yakin ingin membeli ${goat.name} seharga Rp ${goat.price.toLocaleString()}?`)) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await buyGoat(goat.id, goat.price);
            setIsSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan saat memproses transaksi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <button
                disabled
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all"
            >
                <CheckCircle className="h-5 w-5" />
                Pembelian Berhasil!
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleBuy}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <ShoppingBag className="h-5 w-5 text-lime-400 transition-transform group-hover:scale-110" />
                )}
                {isLoading ? "Memproses..." : "Beli Sekarang"}
            </button>

            {error && (
                <p className="text-center text-sm font-medium text-red-600 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
}
