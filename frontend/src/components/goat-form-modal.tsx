"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Save } from "lucide-react";
import { createGoat, updateGoat, type Goat } from "@/lib/supabase-queries";
import { storageService } from "@/services/storage";

interface GoatFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Goat | null;
}

const INITIAL_FORM_STATE = {
    name: "",
    rfid_tag: "",
    breed: "",
    birth_date: "",
    weight: 0,
    temperature: 36.5,
    heart_rate: 70,
    status: "Aman" as const,
    image_url: "",
    price: 0,
    is_for_sale: false,
    description: ""
};

export function GoatFormModal({ isOpen, onClose, onSuccess, initialData }: GoatFormModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        rfid_tag: string;
        breed: string;
        birth_date: string;
        weight: number;
        temperature: number;
        heart_rate: number;
        status: "Aman" | "Perlu Cek" | "Sakit";
        image_url: string;
        price: number;
        is_for_sale: boolean;
        description: string;
    }>(INITIAL_FORM_STATE);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    rfid_tag: initialData.rfid_tag,
                    breed: initialData.breed,
                    birth_date: initialData.birth_date,
                    weight: initialData.weight,
                    temperature: initialData.temperature,
                    heart_rate: initialData.heart_rate,
                    status: initialData.status as "Aman" | "Perlu Cek" | "Sakit",
                    image_url: initialData.image_url,
                    price: initialData.price,
                    is_for_sale: initialData.is_for_sale,
                    description: initialData.description
                });
                setPreviewUrl(initialData.image_url);
            } else {
                setFormData(INITIAL_FORM_STATE);
                setPreviewUrl("");
            }
        } else {
            setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
            setImageFile(null);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = formData.image_url;

            if (imageFile) {
                const uploadedUrl = await storageService.uploadFile(imageFile, "goats");
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            const goatData = {
                ...formData,
                image_url: imageUrl
            };

            if (initialData) {
                await updateGoat(initialData.id, goatData);
            } else {
                await createGoat(goatData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save goat:", error);
            alert("Gagal menyimpan data. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}>
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-8 py-6 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {initialData ? "Edit Data Ternak" : "Tambah Ternak Baru"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <Upload className="h-8 w-8" />
                                    <span className="text-sm font-medium">Upload Foto Ternak</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nama / Kode</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="Contoh: K-007"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">RFID Tag</label>
                            <input
                                required
                                type="text"
                                value={formData.rfid_tag}
                                onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="Scan RFID..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Jenis Ras</label>
                            <input
                                required
                                type="text"
                                value={formData.breed}
                                onChange={e => setFormData({ ...formData, breed: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="Contoh: Etawa"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Tanggal Lahir</label>
                            <input
                                required
                                type="date"
                                value={formData.birth_date}
                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Berat (kg)</label>
                            <input
                                required
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Status Kesehatan</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            >
                                <option value="Aman">Aman (Sehat)</option>
                                <option value="Perlu Cek">Perlu Cek</option>
                                <option value="Sakit">Sakit</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700">Jual di Marketplace?</label>
                            <input
                                type="checkbox"
                                checked={formData.is_for_sale}
                                onChange={e => setFormData({ ...formData, is_for_sale: e.target.checked })}
                                className="h-6 w-6 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                        </div>
                        {formData.is_for_sale && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Harga Jual (IDR)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-4 font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-bold text-white hover:bg-slate-800 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Simpan Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
