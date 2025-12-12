"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Goat } from "@/lib/data";

export default function AddToCartButton({ goat }: { goat: Goat }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(goat)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 hover:shadow-slate-900/30 active:scale-[0.98]"
        >
            <ShoppingCart className="h-5 w-5 text-lime-400" />
            Tambah ke Keranjang
        </button>
    );
}
