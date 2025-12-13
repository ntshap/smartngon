"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, checkIsAdmin } from "@/lib/admin-queries";
import { supabase } from "@/utils/supabase/client";
import {
    User,
    Mail,
    Shield,
    Save,
    Loader2
} from "lucide-react";

export default function SettingsAdminPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsLoading(false);
    }

    const handleAddAdmin = async () => {
        if (!adminEmail.trim()) {
            setMessage({ type: "error", text: "Masukkan email user" });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            // Find user by email
            const { data: users, error: findError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('email', adminEmail.toLowerCase())
                .single();

            if (findError || !users) {
                setMessage({ type: "error", text: "User dengan email tersebut tidak ditemukan" });
                setIsSaving(false);
                return;
            }

            // Update role to admin
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', users.id);

            if (updateError) {
                setMessage({ type: "error", text: "Gagal mengubah role user" });
            } else {
                setMessage({ type: "success", text: `${adminEmail} berhasil dijadikan admin` });
                setAdminEmail("");
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Terjadi kesalahan" });
        }

        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memuat pengaturan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Pengaturan</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Kelola pengaturan akun dan akses admin
                </p>
            </div>

            {/* Current User Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-900">
                    <User className="h-4 w-4 text-slate-400" />
                    Akun Anda
                </h2>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-700">
                            {user?.email?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{user?.email}</p>
                            <p className="text-xs text-slate-500">
                                Role: <span className="font-medium text-lime-600">{user?.profile?.role || "user"}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Admin */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Shield className="h-4 w-4 text-slate-400" />
                    Tambah Admin Baru
                </h2>

                <p className="mb-4 text-sm text-slate-500">
                    Jadikan user yang sudah terdaftar sebagai admin. User harus sudah memiliki akun di sistem.
                </p>

                {message && (
                    <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.type === "success"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                        />
                    </div>
                    <button
                        onClick={handleAddAdmin}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-600 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Jadikan Admin
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-medium text-amber-800">Catatan Penting</h3>
                <ul className="mt-2 space-y-1 text-xs text-amber-700">
                    <li>• Hanya admin yang bisa mengakses halaman /admin</li>
                    <li>• Pastikan Anda tidak menghapus semua admin dari sistem</li>
                    <li>• Perubahan role akan langsung aktif</li>
                </ul>
            </div>
        </div>
    );
}
