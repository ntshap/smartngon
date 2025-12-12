"use client";

import {
    Bell,
    Home,
    LineChart,
    LogOut,
    Menu,
    Settings,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarLinks = [
    { href: "/dashboard", label: "Kandang Saya", icon: Home },
    { href: "/dashboard/notifications", label: "Notifikasi", icon: Bell, badge: "2" },
    { href: "/dashboard/analytics", label: "Analitik", icon: LineChart },
    { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="relative flex h-screen overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover z-0"
            >
                <source src="/green%20background.mp4" type="video/mp4" />
            </video>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-[2px]"></div>

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white/90 backdrop-blur-xl border-r border-white/50 text-slate-600 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-24 items-center gap-3 px-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                            <Image
                                src="/smart%20ngangon%20logo.png"
                                alt="Logo"
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain brightness-0 invert"
                            />
                        </div>
                        <div>
                            <span className="block font-manrope text-lg font-bold tracking-tight text-slate-900">
                                Smart Ngangon
                            </span>
                            <span className="block text-xs text-slate-400">
                                Modern Farming OS
                            </span>
                        </div>
                        <button
                            className="ml-auto text-slate-600 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                        <div className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Menu Utama
                        </div>
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 ${isActive
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                                            }`}
                                    />
                                    <span>{link.label}</span>
                                    {link.badge && (
                                        <span
                                            className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isActive
                                                ? "bg-emerald-600 text-white"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="border-t border-gray-100 p-6">
                        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/50 p-3 shadow-sm transition-colors hover:border-emerald-100 hover:shadow-md">
                            <div className="relative">
                                <img
                                    src="https://i.pravatar.cc/150?img=12"
                                    alt="User Avatar"
                                    className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                                />
                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-bold text-slate-900">
                                    Bapak Budi
                                </p>
                                <p className="truncate text-xs text-slate-400">Pemilik</p>
                            </div>
                            <button className="text-slate-400 transition-colors hover:text-rose-500">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="relative flex flex-1 flex-col overflow-hidden z-10">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-4 md:hidden">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                            <Image
                                src="/smart%20ngangon%20logo.png"
                                alt="Logo"
                                width={20}
                                height={20}
                                className="h-5 w-5 object-contain brightness-0 invert"
                            />
                        </div>
                        <span className="font-manrope text-lg font-bold text-slate-900">
                            Smart Ngangon
                        </span>
                    </div>
                    <button
                        className="text-slate-600 hover:text-slate-900"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    <div className="mx-auto max-w-[1600px] space-y-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
