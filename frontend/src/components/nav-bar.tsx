"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

const navigationLinks = [
  { href: "/#how-it-works", label: "Cara Kerja" },
  { href: "/marketplace", label: "Pasar", isAccent: true },
  { href: "/#monitoring", label: "Pemantauan" },
  { href: "/#pricing", label: "Harga" },
];

export function NavBar() {
  const { items, setIsCartOpen } = useCart();

  return (
    <nav className="animate-fadeSlideIn fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-sans inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-lime-500 text-sm font-semibold tracking-tight text-slate-900 shadow-sm ring-1 ring-lime-400/80">
            <Image
              src="/smart%20ngangon%20logo.png"
              alt="Logo Smart Ngangon"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
              style={{ transform: "scale(1.5)" }}
              priority
            />
          </span>
          <span className="font-sans text-sm font-medium tracking-tight text-slate-900 sm:text-base">
            Smart Ngangon
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans transition ${link.isAccent
                ? "rounded-full bg-lime-100 px-3 py-1 font-medium text-lime-700 hover:bg-lime-200"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500"></span>
              </span>
            )}
          </button>
          <Link
            href="/login"
            className="font-sans rounded-lg bg-lime-500 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-lime-400 hover:ring-2 hover:ring-lime-300"
          >
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}
