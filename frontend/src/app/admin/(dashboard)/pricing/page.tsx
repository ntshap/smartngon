"use client";

import { useEffect, useState } from "react";
import {
    getPricingPlans,
    createPricingPlan,
    updatePricingPlan,
    deletePricingPlan,
    PricingPlan
} from "@/lib/admin-queries";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    CreditCard,
    Star,
    Check
} from "lucide-react";

export default function PricingAdminPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        period: "bulan",
        description: "",
        features: [] as string[],
        highlight_feature: "",
        is_popular: false,
        is_active: true,
        display_order: 0,
    });
    const [featureInput, setFeatureInput] = useState("");

    useEffect(() => {
        loadPlans();
    }, []);

    async function loadPlans() {
        setIsLoading(true);
        const data = await getPricingPlans(false);
        setPlans(data);
        setIsLoading(false);
    }

    const openCreateModal = () => {
        setEditingPlan(null);
        setFormData({
            name: "",
            price: 0,
            period: "bulan",
            description: "",
            features: [],
            highlight_feature: "",
            is_popular: false,
            is_active: true,
            display_order: plans.length + 1,
        });
        setFeatureInput("");
        setIsModalOpen(true);
    };

    const openEditModal = (plan: PricingPlan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            period: plan.period,
            description: plan.description || "",
            features: plan.features || [],
            highlight_feature: plan.highlight_feature || "",
            is_popular: plan.is_popular,
            is_active: plan.is_active,
            display_order: plan.display_order,
        });
        setFeatureInput("");
        setIsModalOpen(true);
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (editingPlan) {
                await updatePricingPlan(editingPlan.id, formData);
            } else {
                await createPricingPlan(formData);
            }
            await loadPlans();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving plan:", error);
            alert("Gagal menyimpan paket harga");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus paket harga ini?")) return;

        const success = await deletePricingPlan(id);
        if (success) {
            await loadPlans();
        } else {
            alert("Gagal menghapus paket harga");
        }
    };

    const formatPrice = (price: number) => {
        if (price === 0) return "Gratis";
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
                    <p className="text-sm text-slate-500">Memuat paket harga...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Paket Harga</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola paket berlangganan yang ditampilkan di website
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-lime-500/30 transition-all hover:bg-lime-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Paket
                </button>
            </div>

            {/* Plans Grid */}
            {plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-12">
                    <CreditCard className="h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">Belum ada paket harga</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-xl border bg-white p-5 ${plan.is_popular
                                    ? "border-lime-300 ring-2 ring-lime-100"
                                    : "border-slate-200"
                                } ${!plan.is_active ? "opacity-60" : ""}`}
                        >
                            {/* Popular Badge */}
                            {plan.is_popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-500 px-3 py-1 text-xs font-medium text-white">
                                        <Star className="h-3 w-3" />
                                        Populer
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="absolute right-3 top-3 flex gap-1">
                                <button
                                    onClick={() => openEditModal(plan)}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="pr-16">
                                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                            </div>

                            <div className="mt-4">
                                <span className="text-3xl font-bold text-slate-900">
                                    {formatPrice(plan.price)}
                                </span>
                                {plan.price > 0 && (
                                    <span className="text-sm text-slate-500">/{plan.period}</span>
                                )}
                            </div>

                            {plan.highlight_feature && (
                                <p className="mt-2 text-sm font-medium text-lime-600">
                                    {plan.highlight_feature}
                                </p>
                            )}

                            {/* Features */}
                            <ul className="mt-4 space-y-2">
                                {plan.features?.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {!plan.is_active && (
                                <p className="mt-4 text-xs text-slate-400">
                                    Paket ini tidak aktif
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editingPlan ? "Edit Paket" : "Tambah Paket"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Nama Paket *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                        placeholder="Pro"
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
                                        placeholder="150000"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Periode
                                    </label>
                                    <select
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    >
                                        <option value="bulan">Per Bulan</option>
                                        <option value="tahun">Per Tahun</option>
                                        <option value="gratis">Gratis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Highlight
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.highlight_feature}
                                        onChange={(e) => setFormData({ ...formData, highlight_feature: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                        placeholder="Paling populer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Deskripsi
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Untuk peternak serius"
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Fitur
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                        placeholder="Tambah fitur..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {formData.features.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {formData.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-lime-500" />
                                                    {feature}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveFeature(i)}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_popular}
                                        onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-lime-500 focus:ring-lime-500/20"
                                    />
                                    <span className="text-sm text-slate-700">Tandai sebagai populer</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-lime-500 focus:ring-lime-500/20"
                                    />
                                    <span className="text-sm text-slate-700">Aktif</span>
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
                                disabled={isSaving || !formData.name}
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
