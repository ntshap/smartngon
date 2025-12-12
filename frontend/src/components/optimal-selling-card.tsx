"use client";

import { Calendar, DollarSign, TrendingUp } from "lucide-react";

interface OptimalSellingCardProps {
    currentWeight: number;
    marketPricePerKg?: number; // Optional, default to 85000
}

export function OptimalSellingCard({ currentWeight, marketPricePerKg = 85000 }: OptimalSellingCardProps) {
    // Simple Logic: Optimal weight is around 40-50kg for standard breeds
    const optimalWeightMin = 40;
    const optimalWeightMax = 50;

    const isReady = currentWeight >= optimalWeightMin;
    const weightDiff = optimalWeightMin - currentWeight;

    // Estimate: 3kg growth per month (optimistic)
    const monthsToReady = weightDiff > 0 ? Math.ceil(weightDiff / 3) : 0;

    const estimatedPrice = currentWeight * marketPricePerKg;
    const potentialPrice = optimalWeightMax * marketPricePerKg;

    // Format currency
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <div className="rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Perkiraan Waktu Jual Optimal</h3>

            <div className="space-y-6">
                {/* Status Banner */}
                <div className={`rounded-2xl p-4 ${isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 ${isReady ? 'bg-emerald-200' : 'bg-blue-100'}`}>
                            {isReady ? <DollarSign className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                        </div>
                        <div>
                            <p className="font-bold text-sm">
                                {isReady ? "Siap Jual!" : "Belum Optimal"}
                            </p>
                            <p className="text-xs mt-1 font-medium opacity-80">
                                {isReady
                                    ? "Berat sudah mencapai target optimal pasar."
                                    : `Butuh sekitar ${monthsToReady} bulan lagi untuk mencapai berat optimal (${optimalWeightMin}kg).`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price Projection */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                        <span className="text-sm font-bold text-slate-500">Harga Saat Ini</span>
                        <span className="font-bold text-slate-900">{formatRupiah(estimatedPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                        <span className="text-sm font-bold text-slate-500">Potensi Maksimal</span>
                        <span className="font-bold text-emerald-600">{formatRupiah(potentialPrice)}</span>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl">
                    Cek Harga Pasar
                </button>
            </div>
        </div>
    );
}
