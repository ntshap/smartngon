"use client";

import { useEffect, useState } from "react";
import {
    getGoats,
    createGoat,
    updateGoat,
    Goat
} from "@/lib/supabase-queries";
import { supabase } from "@/utils/supabase/client";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    X,
    Save,
    Search,
    Beef,
    ShoppingCart,
    DollarSign
} from "lucide-react";

const GOAT_BREEDS = [
    "Etawa",
    "Boer",
    "Saanen",
    "Kacang",
    "Jawa Randu",
    "Anglo Nubian",
    "Peranakan",
];

const GOAT_STATUS = [
    { value: "Aman", label: "Aman", color: "bg-emerald-50 text-emerald-600" },
    { value: "Perlu Cek", label: "Perlu Cek", color: "bg-amber-50 text-amber-600" },
    { value: "Sakit", label: "Sakit", color: "bg-red-50 text-red-600" },
];

export default function GoatsAdminPage() {
    const [goats, setGoats] = useState<Goat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterForSale, setFilterForSale] = useState<"all" | "sale" | "owned">("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoat, setEditingGoat] = useState<Goat | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        breed: "Etawa",
        rfid_tag: "",
        birth_date: "",
        weight: 0,
        status: "Aman" as Goat["status"],
        health_score: 90,
        temperature: 38.5,
        heart_rate: 80,
        price: 0,
        is_for_sale: false,
        description: "",
        image_url: "",
    });

    useEffect(() => {
        loadGoats();
    }, []);

    async function loadGoats() {
        setIsLoading(true);
        const data = await getGoats();
        setGoats(data);
        setIsLoading(false);
    }

    const filteredGoats = goats.filter((goat) => {
        const matchesSearch =
            goat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            goat.rfid_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
            goat.breed.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterForSale === "all" ||
            (filterForSale === "sale" && goat.is_for_sale) ||
            (filterForSale === "owned" && !goat.is_for_sale);

        return matchesSearch && matchesFilter;
    });

    const openCreateModal = () => {
        setEditingGoat(null);
        setFormData({
            name: "",
            breed: "Etawa",
            rfid_tag: `RFID-${String(goats.length + 1).padStart(3, "0")}`,
            birth_date: "",
            weight: 0,
            status: "Aman",
            health_score: 90,
            temperature: 38.5,
            heart_rate: 80,
            price: 0,
            is_for_sale: false,
            description: "",
            image_url: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (goat: Goat) => {
        setEditingGoat(goat);
        setFormData({
            name: goat.name,
            breed: goat.breed,
            rfid_tag: goat.rfid_tag,
            birth_date: goat.birth_date,
            weight: goat.weight,
            status: goat.status,
            health_score: goat.health_score,
            temperature: goat.temperature,
            heart_rate: goat.heart_rate,
            price: goat.price,
            is_for_sale: goat.is_for_sale,
            description: goat.description,
            image_url: goat.image_url,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (editingGoat) {
                await updateGoat(editingGoat.id, formData);
            } else {
                await createGoat({
                    ...formData,
                    farm_id: "00000000-0000-0000-0000-000000000000", // Default farm
                });
            }
            await loadGoats();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving goat:", error);
            alert("Gagal menyimpan data kambing");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus kambing ini?")) return;

        const { error } = await supabase
            .from('goats')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Gagal menghapus kambing");
        } else {
            await loadGoats();
        }
    };

    const handleToggleForSale = async (goat: Goat) => {
        await updateGoat(goat.id, { is_for_sale: !goat.is_for_sale });
        await loadGoats();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memuat data kambing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Kambing</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola data kambing dan marketplace
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-lime-500/30 transition-all hover:bg-lime-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kambing
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, RFID, atau ras..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { value: "all", label: "Semua" },
                        { value: "sale", label: "Dijual" },
                        { value: "owned", label: "Dimiliki" },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterForSale(filter.value as typeof filterForSale)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterForSale === filter.value
                                    ? "bg-lime-500 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredGoats.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
                    <Beef className="h-12 w-12 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">Belum ada data kambing</p>
                    <button
                        onClick={openCreateModal}
                        className="mt-4 text-sm font-medium text-lime-600 hover:text-lime-700"
                    >
                        + Tambah kambing pertama
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGoats.map((goat) => (
                        <div
                            key={goat.id}
                            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                {goat.image_url ? (
                                    <img
                                        src={goat.image_url}
                                        alt={goat.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Beef className="h-12 w-12 text-slate-300" />
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                                    {goat.is_for_sale && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-lime-500 px-2 py-0.5 text-xs font-medium text-white">
                                            <ShoppingCart className="h-3 w-3" />
                                            Dijual
                                        </span>
                                    )}
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GOAT_STATUS.find(s => s.value === goat.status)?.color
                                        }`}>
                                        {goat.status}
                                    </span>
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => openEditModal(goat)}
                                        className="rounded-lg bg-white p-2 text-slate-700 shadow-lg transition-transform hover:scale-110"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleForSale(goat)}
                                        className="rounded-lg bg-white p-2 text-slate-700 shadow-lg transition-transform hover:scale-110"
                                    >
                                        {goat.is_for_sale ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(goat.id)}
                                        className="rounded-lg bg-white p-2 text-red-600 shadow-lg transition-transform hover:scale-110"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{goat.name}</h3>
                                        <p className="text-xs text-slate-500">{goat.rfid_tag}</p>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900">
                                        {goat.weight} kg
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-600">{goat.breed}</p>

                                {goat.is_for_sale && (
                                    <div className="mt-3 flex items-center gap-1 text-lime-600">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="font-semibold">{formatPrice(goat.price)}</span>
                                    </div>
                                )}

                                {/* Health Score Bar */}
                                <div className="mt-3">
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Kesehatan</span>
                                        <span className="font-medium text-slate-700">{goat.health_score}%</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={`h-full rounded-full transition-all ${goat.health_score >= 80
                                                    ? "bg-emerald-500"
                                                    : goat.health_score >= 60
                                                        ? "bg-amber-500"
                                                        : "bg-red-500"
                                                }`}
                                            style={{ width: `${goat.health_score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editingGoat ? "Edit Kambing" : "Tambah Kambing"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Nama *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Bella"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Tag RFID *
                                </label>
                                <input
                                    type="text"
                                    value={formData.rfid_tag}
                                    onChange={(e) => setFormData({ ...formData, rfid_tag: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="RFID-001"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Ras
                                </label>
                                <select
                                    value={formData.breed}
                                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                >
                                    {GOAT_BREEDS.map((breed) => (
                                        <option key={breed} value={breed}>
                                            {breed}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Berat (kg)
                                </label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Goat["status"] })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                >
                                    {GOAT_STATUS.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Skor Kesehatan (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.health_score}
                                    onChange={(e) => setFormData({ ...formData, health_score: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Harga (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="5000000"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    URL Gambar
                                </label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Deskripsi kambing..."
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_for_sale}
                                        onChange={(e) => setFormData({ ...formData, is_for_sale: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-lime-500 focus:ring-lime-500/20"
                                    />
                                    <span className="text-sm text-slate-700">Tampilkan di Marketplace</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !formData.name || !formData.rfid_tag}
                                className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
