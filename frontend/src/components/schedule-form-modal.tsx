"use client";

import { useState, useEffect } from "react";
import { X, Clock, Weight, Save, Trash2 } from "lucide-react";

interface Schedule {
    id?: string;
    farm_id: string;
    time: string;
    amount_kg: number;
    is_active: boolean;
}

interface ScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Schedule | null;
    farmId: string;
}

export function ScheduleFormModal({ isOpen, onClose, onSuccess, initialData, farmId }: ScheduleFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Schedule>({
        farm_id: farmId,
        time: "08:00",
        amount_kg: 0.5,
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                farm_id: farmId,
                time: "08:00",
                amount_kg: 0.5,
                is_active: true
            });
        }
    }, [initialData, farmId, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = initialData?.id
                ? `http://localhost:8000/iot/schedules/${initialData.id}`
                : `http://localhost:8000/iot/schedules`;

            const method = initialData?.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to save schedule");

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan jadwal");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id || !confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/iot/schedules/${initialData.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete schedule");

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus jadwal");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-slate-900 shadow-2xl ring-1 ring-white/10">
                {/* Header */}
                <div className="relative border-b border-white/10 bg-slate-800/50 px-6 py-4 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? "Edit Jadwal Pakan" : "Tambah Jadwal Pakan"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-emerald-400" /> Waktu Pakan
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Weight className="h-4 w-4 text-emerald-400" /> Jumlah (Kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                required
                                value={formData.amount_kg}
                                onChange={(e) => setFormData({ ...formData, amount_kg: parseFloat(e.target.value) })}
                                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        {initialData && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-bold text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-lg hover:bg-emerald-500 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Simpan Jadwal
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
