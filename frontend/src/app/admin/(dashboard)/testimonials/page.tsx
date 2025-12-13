"use client";

import { useEffect, useState } from "react";
import {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialActive,
    Testimonial
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
    MessageSquareQuote
} from "lucide-react";

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        role: "",
        content: "",
        badge_label: "",
        badge_icon: "star",
        badge_color: "lime",
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        loadTestimonials();
    }, []);

    async function loadTestimonials() {
        setIsLoading(true);
        const data = await getTestimonials(false); // Get all, including inactive
        setTestimonials(data);
        setIsLoading(false);
    }

    const filteredTestimonials = testimonials.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingTestimonial(null);
        setFormData({
            name: "",
            location: "",
            role: "",
            content: "",
            badge_label: "",
            badge_icon: "star",
            badge_color: "lime",
            display_order: testimonials.length + 1,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            location: testimonial.location || "",
            role: testimonial.role || "",
            content: testimonial.content,
            badge_label: testimonial.badge_label || "",
            badge_icon: testimonial.badge_icon,
            badge_color: testimonial.badge_color,
            display_order: testimonial.display_order,
            is_active: testimonial.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (editingTestimonial) {
                await updateTestimonial(editingTestimonial.id, formData);
            } else {
                await createTestimonial(formData);
            }
            await loadTestimonials();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Gagal menyimpan testimonial");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus testimonial ini?")) return;

        const success = await deleteTestimonial(id);
        if (success) {
            await loadTestimonials();
        } else {
            alert("Gagal menghapus testimonial");
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        const success = await toggleTestimonialActive(id, !currentState);
        if (success) {
            await loadTestimonials();
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memuat testimonial...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Testimonial</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola testimonial yang ditampilkan di website
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-lime-500/30 transition-all hover:bg-lime-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Testimonial
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari testimonial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                Nama
                            </th>
                            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 md:table-cell">
                                Testimonial
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredTestimonials.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center">
                                    <MessageSquareQuote className="mx-auto h-8 w-8 text-slate-300" />
                                    <p className="mt-2 text-sm text-slate-500">
                                        Belum ada testimonial
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            filteredTestimonials.map((testimonial) => (
                                <tr key={testimonial.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {testimonial.role}, {testimonial.location}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="hidden max-w-xs truncate px-4 py-4 text-sm text-slate-600 md:table-cell">
                                        {testimonial.content}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${testimonial.is_active
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {testimonial.is_active ? (
                                                <>
                                                    <Eye className="h-3 w-3" />
                                                    Aktif
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3" />
                                                    Nonaktif
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(testimonial)}
                                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(testimonial.id)}
                                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editingTestimonial ? "Edit Testimonial" : "Tambah Testimonial"}
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
                                        Nama *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                        placeholder="Nama lengkap"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Lokasi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                        placeholder="Kota"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Peran/Pekerjaan
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Investor kambing"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Testimonial *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    placeholder="Isi testimonial..."
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Label Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.badge_label}
                                        onChange={(e) => setFormData({ ...formData, badge_label: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                        placeholder="Monitoring 24/7"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Warna Badge
                                    </label>
                                    <select
                                        value={formData.badge_color}
                                        onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                    >
                                        <option value="lime">Lime (Hijau)</option>
                                        <option value="sky">Sky (Biru)</option>
                                        <option value="slate">Slate (Abu)</option>
                                        <option value="amber">Amber (Kuning)</option>
                                    </select>
                                </div>
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
                                disabled={isSaving || !formData.name || !formData.content}
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
