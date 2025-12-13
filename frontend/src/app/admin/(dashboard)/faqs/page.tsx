"use client";

import { useEffect, useState } from "react";
import {
    getFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
    toggleFaqActive,
    FAQ
} from "@/lib/admin-queries";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    X,
    Save,
    Search,
    HelpCircle,
    ChevronDown
} from "lucide-react";

const FAQ_CATEGORIES = [
    { value: "general", label: "Umum" },
    { value: "teknologi", label: "Teknologi" },
    { value: "teknis", label: "Teknis" },
    { value: "layanan", label: "Layanan" },
    { value: "pembelian", label: "Pembelian" },
];

export default function FaqsAdminPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "general",
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        loadFaqs();
    }, []);

    async function loadFaqs() {
        setIsLoading(true);
        const data = await getFaqs(false);
        setFaqs(data);
        setIsLoading(false);
    }

    const filteredFaqs = faqs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const openCreateModal = () => {
        setEditingFaq(null);
        setFormData({
            question: "",
            answer: "",
            category: "general",
            display_order: faqs.length + 1,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (faq: FAQ) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            display_order: faq.display_order,
            is_active: faq.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (editingFaq) {
                await updateFaq(editingFaq.id, formData);
            } else {
                await createFaq(formData);
            }
            await loadFaqs();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving FAQ:", error);
            alert("Gagal menyimpan FAQ");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus FAQ ini?")) return;

        const success = await deleteFaq(id);
        if (success) {
            await loadFaqs();
        } else {
            alert("Gagal menghapus FAQ");
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        const success = await toggleFaqActive(id, !currentState);
        if (success) {
            await loadFaqs();
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memuat FAQ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">FAQ</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola pertanyaan yang sering ditanyakan
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-lime-500/30 transition-all hover:bg-lime-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah FAQ
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                >
                    <option value="all">Semua Kategori</option>
                    {FAQ_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-12">
                        <HelpCircle className="h-8 w-8 text-slate-300" />
                        <p className="mt-2 text-sm text-slate-500">Belum ada FAQ</p>
                    </div>
                ) : (
                    filteredFaqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
                        >
                            <div
                                className="flex cursor-pointer items-center justify-between p-4"
                                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                            >
                                <div className="flex-1 pr-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${faq.is_active
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {FAQ_CATEGORIES.find((c) => c.value === faq.category)?.label || faq.category}
                                        </span>
                                        {!faq.is_active && (
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                                <EyeOff className="h-3 w-3" />
                                                Nonaktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 font-medium text-slate-900">{faq.question}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleActive(faq.id, faq.is_active);
                                        }}
                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        {faq.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(faq);
                                        }}
                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(faq.id);
                                        }}
                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <ChevronDown
                                        className={`h-5 w-5 text-slate-400 transition-transform ${expandedId === faq.id ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </div>
                            {expandedId === faq.id && (
                                <div className="border-t border-slate-100 px-4 py-3">
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editingFaq ? "Edit FAQ" : "Tambah FAQ"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Pertanyaan *
                                </label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Bagaimana cara kerja...?"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Jawaban *
                                </label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={5}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Jelaskan jawaban secara lengkap..."
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Kategori
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                >
                                    {FAQ_CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-lime-500 focus:ring-lime-500/20"
                                />
                                <label htmlFor="is_active" className="text-sm text-slate-700">
                                    Tampilkan di website
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
                                disabled={isSaving || !formData.question || !formData.answer}
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
