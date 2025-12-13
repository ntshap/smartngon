"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Beef,
    MessageSquareQuote,
    HelpCircle,
    FileText,
    Image,
    Settings,
    LogOut,
    CreditCard,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Kambing", href: "/admin/goats", icon: Beef },
    { label: "Testimonial", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "FAQ", href: "/admin/faqs", icon: HelpCircle },
    { label: "Pricing", href: "/admin/pricing", icon: CreditCard },
    { label: "Konten", href: "/admin/content", icon: FileText },
    { label: "Media", href: "/admin/media", icon: Image },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin");
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500">
                        <span className="text-sm font-bold text-white">SN</span>
                    </div>
                    {!collapsed && (
                        <span className="text-sm font-semibold text-slate-900">
                            Admin Panel
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:block"
                >
                    <ChevronLeft
                        className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? "bg-lime-50 text-lime-700"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${isActive ? "text-lime-600" : "text-slate-400"}`}
                                    />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-200 p-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="h-5 w-5 text-slate-400" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden"
            >
                <Menu className="h-5 w-5 text-slate-600" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white ${collapsed ? "lg:w-16" : "lg:w-64"
                    } transition-all duration-200`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
