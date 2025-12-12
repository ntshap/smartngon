"use client";

import Link from "next/link";
import { Activity, ShoppingCart } from "lucide-react";
import { type Goat } from "@/lib/supabase-queries";
import { useCart } from "@/context/cart-context";

interface MarketplaceCardProps {
    goat: Goat;
}

export function MarketplaceCard({ goat }: MarketplaceCardProps) {
    const { addToCart } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">
            <Link href={`/marketplace/${goat.id}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={goat.image_url || "https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=2070&auto=format&fit=crop"}
                        alt={`Kambing ${goat.name}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className={`font-sans inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm ${goat.status === 'Aman' ? 'bg-emerald-500/90' :
                            goat.status === 'Sakit' ? 'bg-red-500/90' : 'bg-yellow-500/90'
                            }`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            {goat.status}
                        </span>
                        <span className="font-sans inline-flex items-center gap-1.5 rounded-full px-2 py-1 bg-slate-900/80 text-[11px] font-medium text-white backdrop-blur-sm">
                            {goat.breed}
                        </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div className="font-sans inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-50 backdrop-blur-sm">
                            <Activity
                                className="h-3 w-3 text-lime-300"
                                strokeWidth={1.5}
                            />
                            Skor {goat.health_score}
                        </div>
                    </div>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <Link href={`/marketplace/${goat.id}`} className="block">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-manrope text-lg font-semibold text-slate-900 group-hover:text-lime-600 transition">
                                {goat.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                RFID: {goat.rfid_tag} • {goat.weight} kg
                            </p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                            {formatPrice(goat.price)}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <span className="block text-slate-500">
                                Suhu
                            </span>
                            <span className="block font-medium text-slate-900">
                                {goat.temperature}°C
                            </span>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <span className="block text-slate-500">
                                Detak
                            </span>
                            <span className="block font-medium text-slate-900">
                                {goat.heart_rate} bpm
                            </span>
                        </div>
                    </div>
                </Link>

                <div className="mt-5 flex gap-3">
                    <button
                        onClick={() => addToCart({
                            id: goat.id,
                            nickname: goat.name,
                            price: formatPrice(goat.price),
                            rawPrice: goat.price,
                            purchaseNote: "Pembelian sekali bayar",
                            image: goat.image_url || "https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=2070&auto=format&fit=crop",
                            info: `${goat.breed} | ${goat.weight} kg | ${goat.rfid_tag}`,
                            stats: [],
                            badges: [],
                            healthScore: `Skor ${goat.health_score}`,
                            tagLabel: `Tag RFID #${goat.rfid_tag}`
                        })}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        <ShoppingCart className="h-4 w-4 text-lime-400" />
                        Tambah
                    </button>
                    <Link
                        href={`/marketplace/${goat.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        Detail
                    </Link>
                </div>
            </div>
        </article>
    );
}
