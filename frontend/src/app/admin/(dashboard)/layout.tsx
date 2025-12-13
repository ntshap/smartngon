"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { checkIsAdmin } from "@/lib/admin-queries";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const isAdmin = await checkIsAdmin();
            if (!isAdmin) {
                router.push("/admin");
                return;
            }
            setIsAuthorized(true);
            setIsLoading(false);
        }
        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                <div className="mx-auto max-w-7xl p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
