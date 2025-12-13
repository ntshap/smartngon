"use client";

import { useEffect, useState } from "react";
import { getAdminStats, AdminStats } from "@/lib/admin-queries";
import {
    Beef,
    MessageSquareQuote,
    HelpCircle,
    TrendingUp,
    Eye,
    ShoppingCart,
    Activity
} from "lucide-react";
import Link from "next/link";

interface StatCard {
    label: string;
    value: string | number;
    icon: React.ElementType;
    href: string;
    color: string;
    bgColor: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const data = await getAdminStats();
            setStats(data);
            setIsLoading(false);
        }
        loadStats();
    }, []);

    const statCards: StatCard[] = [
        {
            label: "Total Kambing",
            value: stats?.totalGoats || 0,
            icon: Beef,
            href: "/admin/goats",
            color: "text-lime-600",
            bgColor: "bg-lime-50",
        },
        {
            label: "Dijual di Marketplace",
            value: stats?.goatsForSale || 0,
            icon: ShoppingCart,
            href: "/admin/goats",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            label: "Testimonial",
            value: stats?.totalTestimonials || 0,
            icon: MessageSquareQuote,
            href: "/admin/testimonials",
            color: "text-sky-600",
            bgColor: "bg-sky-50",
        },
        {
            label: "FAQ",
            value: stats?.totalFaqs || 0,
            icon: HelpCircle,
            href: "/admin/faqs",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
    ];

    const quickActions = [
        { label: "Tambah Kambing", href: "/admin/goats?action=new", icon: Beef },
        { label: "Tambah Testimonial", href: "/admin/testimonials?action=new", icon: MessageSquareQuote },
        { label: "Tambah FAQ", href: "/admin/faqs?action=new", icon: HelpCircle },
        { label: "Lihat Website", href: "/", icon: Eye },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
                    <p className="text-sm text-slate-500">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Selamat datang di Admin Panel Smart Ngangon
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}
                            >
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <TrendingUp className="h-4 w-4 text-slate-300 transition-colors group-hover:text-lime-500" />
                        </div>
                        <p className="mt-4 text-2xl font-semibold text-slate-900">
                            {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-sm font-medium text-slate-900">
                    Aksi Cepat
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-lime-300 hover:bg-lime-50 hover:text-lime-700"
                        >
                            <action.icon className="h-4 w-4" />
                            <span>{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Activity Placeholder */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-medium text-slate-900">
                        Aktivitas Terbaru
                    </h2>
                </div>
                <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Activity className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">
                        Belum ada aktivitas terbaru
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Aktivitas CRUD akan muncul di sini
                    </p>
                </div>
            </div>
        </div>
    );
}
