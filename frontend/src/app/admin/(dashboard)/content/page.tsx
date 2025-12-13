"use client";

import { useEffect, useState } from "react";
import {
    getAllSiteContent,
    updateSiteContent,
    SiteContent
} from "@/lib/admin-queries";
import {
    Save,
    Search,
    FileText,
    Check,
    RefreshCw
} from "lucide-react";

export default function ContentAdminPage() {
    const [contents, setContents] = useState<SiteContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [editedValues, setEditedValues] = useState<Record<string, string>>({});
    const [savingKeys, setSavingKeys] = useState<string[]>([]);
    const [savedKeys, setSavedKeys] = useState<string[]>([]);

    useEffect(() => {
        loadContent();
    }, []);

    async function loadContent() {
        setIsLoading(true);
        const data = await getAllSiteContent();
        setContents(data);

        // Initialize edited values
        const initial: Record<string, string> = {};
        data.forEach((c) => {
            initial[c.key] = c.value || "";
        });
        setEditedValues(initial);

        setIsLoading(false);
    }

    const categories = [...new Set(contents.map((c) => c.category))];

    const filteredContents = contents.filter((c) => {
        const matchesSearch =
            c.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.value?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (c.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const groupedContents = filteredContents.reduce((acc, content) => {
        if (!acc[content.category]) acc[content.category] = [];
        acc[content.category].push(content);
        return acc;
    }, {} as Record<string, SiteContent[]>);

    const handleChange = (key: string, value: string) => {
        setEditedValues((prev) => ({ ...prev, [key]: value }));
        // Remove from saved if editing again
        setSavedKeys((prev) => prev.filter((k) => k !== key));
    };

    const handleSave = async (key: string) => {
        setSavingKeys((prev) => [...prev, key]);

        const success = await updateSiteContent(key, editedValues[key]);

        if (success) {
            setSavedKeys((prev) => [...prev, key]);
            setTimeout(() => {
                setSavedKeys((prev) => prev.filter((k) => k !== key));
            }, 2000);
        } else {
            alert("Gagal menyimpan konten");
        }

        setSavingKeys((prev) => prev.filter((k) => k !== key));
    };

    const hasChanges = (key: string) => {
        const original = contents.find((c) => c.key === key)?.value || "";
        return editedValues[key] !== original;
    };

    const formatKey = (key: string) => {
        return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memuat konten...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Konten Website</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Edit teks dan konten yang ditampilkan di website
                    </p>
                </div>
                <button
                    onClick={loadContent}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari konten..."
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
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Content Groups */}
            {Object.keys(groupedContents).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-12">
                    <FileText className="h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">Belum ada konten</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedContents).map(([category, items]) => (
                        <div key={category} className="rounded-xl border border-slate-200 bg-white">
                            <div className="border-b border-slate-100 px-5 py-3">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    {category}
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {items.map((content) => (
                                    <div key={content.key} className="p-5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium text-slate-900">
                                                    {formatKey(content.key)}
                                                </label>
                                                {content.description && (
                                                    <p className="text-xs text-slate-500">
                                                        {content.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {savedKeys.includes(content.key) && (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                                        <Check className="h-3 w-3" />
                                                        Tersimpan
                                                    </span>
                                                )}
                                                {hasChanges(content.key) && (
                                                    <button
                                                        onClick={() => handleSave(content.key)}
                                                        disabled={savingKeys.includes(content.key)}
                                                        className="flex items-center gap-1.5 rounded-lg bg-lime-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-lime-600 disabled:opacity-50"
                                                    >
                                                        {savingKeys.includes(content.key) ? (
                                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                        ) : (
                                                            <Save className="h-3 w-3" />
                                                        )}
                                                        Simpan
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {content.type === "html" || (content.value?.length || 0) > 100 ? (
                                            <textarea
                                                value={editedValues[content.key] || ""}
                                                onChange={(e) => handleChange(content.key, e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={editedValues[content.key] || ""}
                                                onChange={(e) => handleChange(content.key, e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
