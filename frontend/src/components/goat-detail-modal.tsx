"use client";

import {
    X,
    Activity,
    Thermometer,
    Weight,
    Syringe,
    MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Goat } from "@/lib/supabase-queries";

interface GoatDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    goat: Goat | null;
    onEdit?: (goat: Goat) => void;
}

// Helper function to calculate age from birth date
function calculateAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();

    if (years > 0) {
        return `${years} Tahun`;
    } else if (months > 0) {
        return `${months} Bulan`;
    } else {
        return "Baru lahir";
    }
}

// Helper function to format date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

export function GoatDetailModal({ isOpen, onClose, goat, onEdit }: GoatDetailModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    if (!goat) return null;

    const age = goat.birth_date ? calculateAge(goat.birth_date) : "N/A";
    const lastVaccine = goat.last_vaccine_date ? formatDate(goat.last_vaccine_date) : "Belum ada";

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/90 shadow-2xl ring-1 ring-white/60 transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
                    }`}
            >
                {/* Header Image */}
                <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                    <img
                        src={goat.image_url}
                        alt={goat.name}
                        className="h-full w-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-6 left-8 z-20 text-white">
                        <h2 className="text-3xl font-bold font-manrope">{goat.name}</h2>
                        <p className="text-slate-200 font-medium">{goat.breed} • {age}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Weight className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Berat</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{goat.weight} kg</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Thermometer className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Suhu</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{goat.temperature}°C</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Activity className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Detak</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{goat.heart_rate} bpm</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Syringe className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Vaksin</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{lastVaccine}</p>
                        </div>
                    </div>

                    {/* Health Status */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Status Kesehatan</h3>
                        <div className={`flex items-center gap-4 rounded-2xl p-4 border ${goat.status === 'Aman' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                            }`}>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${goat.status === 'Aman' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <p className={`font-bold ${goat.status === 'Aman' ? 'text-emerald-900' : 'text-amber-900'
                                    }`}>
                                    {goat.status === 'Aman' ? 'Kondisi Prima' : 'Perlu Perhatian'}
                                </p>
                                <p className={`text-sm ${goat.status === 'Aman' ? 'text-emerald-700' : 'text-amber-700'
                                    }`}>
                                    {goat.status === 'Aman'
                                        ? 'Semua parameter vital dalam batas normal.'
                                        : 'Terdeteksi penurunan aktivitas dalam 24 jam terakhir.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(goat)}
                                className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 transition-colors"
                            >
                                Edit Data
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
