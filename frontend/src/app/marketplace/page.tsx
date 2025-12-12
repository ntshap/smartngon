"use client";

import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Filter, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getGoatsForSale, type Goat } from "@/lib/supabase-queries";
import { MarketplaceCard } from "@/components/marketplace-card";

export default function MarketplacePage() {
    const [goats, setGoats] = useState<Goat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadGoats() {
            setIsLoading(true);
            const data = await getGoatsForSale();
            setGoats(data);
            setIsLoading(false);
        }
        loadGoats();
    }, []);

    // Filter goats based on search query
    const filteredGoats = goats.filter((goat) =>
        goat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goat.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goat.rfid_tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-slate-50">
            <NavBar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="font-manrope text-3xl font-bold text-slate-900 sm:text-4xl">
                            Marketplace Kambing
                        </h1>
                        <p className="mt-2 text-slate-600 max-w-2xl">
                            Temukan kambing berkualitas dengan data kesehatan transparan.
                            Setiap pembelian sudah termasuk integrasi sistem Smart Ngangon.
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, ras, atau RFID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                        />
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="mt-12 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
                    </div>
                ) : filteredGoats.length === 0 ? (
                    <div className="mt-12 text-center">
                        <p className="text-slate-600 font-semibold">
                            {searchQuery ? 'Tidak ada hasil untuk pencarian Anda' : 'Belum ada kambing yang dijual'}
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredGoats.map((goat) => (
                            <MarketplaceCard key={goat.id} goat={goat} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
