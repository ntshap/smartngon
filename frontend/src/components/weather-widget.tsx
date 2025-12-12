"use client";

import { CloudSun, MapPin } from "lucide-react";

export function WeatherWidget() {
    return (
        <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl px-4 py-2 shadow-sm ring-1 ring-white/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <CloudSun className="h-6 w-6" />
            </div>
            <div>
                <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-slate-900">28°C</span>
                    <span className="text-xs font-medium text-slate-500">Cerah Berawan</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    <span>Yogyakarta, ID</span>
                </div>
            </div>
        </div>
    );
}
