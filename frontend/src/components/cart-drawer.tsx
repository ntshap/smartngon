"use client";

import { X, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useEffect, useState } from "react";

export function CartDrawer() {
    const { items, removeFromCart, isCartOpen, setIsCartOpen, checkout } =
        useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const total = items.reduce((acc, item) => acc + item.rawPrice, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h2 className="font-manrope text-lg font-semibold text-slate-900">
                            Keranjang Belanja ({items.length})
                        </h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="mb-4 rounded-full bg-slate-50 p-4">
                                    <MessageCircle className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-slate-900 font-medium">Keranjang kosong</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Belum ada kambing yang dipilih.
                                </p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Lihat Marketplace
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {items.map((item) => (
                                    <li key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                            <img
                                                src={item.image}
                                                alt={item.nickname}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="font-medium text-slate-900">
                                                        {item.nickname}
                                                    </h3>
                                                    <p className="font-medium text-slate-900">
                                                        {item.price}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-500">{item.info}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Hapus
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="border-t border-slate-100 bg-slate-50 p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-base font-medium text-slate-600">
                                    Total Estimasi
                                </span>
                                <span className="text-xl font-bold text-slate-900">
                                    Rp {total.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <p className="mb-6 text-xs text-slate-500">
                                *Harga belum termasuk biaya pengiriman jika ada. Pembayaran akan
                                dikonfirmasi via WhatsApp.
                            </p>
                            <button
                                onClick={checkout}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-lime-500/20 transition hover:bg-lime-400 hover:shadow-lime-500/30 active:scale-[0.98]"
                            >
                                <MessageCircle className="h-5 w-5" />
                                Checkout via WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
