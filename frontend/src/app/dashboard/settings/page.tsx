'use client';

import { User, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight } from 'lucide-react';


const settingSections = [
    {
        title: 'Akun',
        items: [
            { icon: User, label: 'Profil Saya', description: 'Kelola informasi pribadi dan foto profil' },
            { icon: Shield, label: 'Keamanan', description: 'Password dan autentikasi dua faktor' },
            { icon: CreditCard, label: 'Pembayaran', description: 'Metode pembayaran dan riwayat tagihan' },
        ]
    },
    {
        title: 'Preferensi',
        items: [
            { icon: Bell, label: 'Notifikasi', description: 'Atur preferensi email dan push notification' },
            { icon: HelpCircle, label: 'Bantuan & Support', description: 'FAQ dan kontak customer service' },
        ]
    }
];

export default function SettingsPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Pengaturan</h1>
            <p className="mb-8 text-slate-500">Kelola akun dan preferensi aplikasi Anda</p>

            <div className="space-y-8">
                {/* Profile Card */}
                <div className="flex items-center gap-6 rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
                    <div className="relative h-24 w-24 shrink-0">
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <button className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-2 text-white shadow-lg hover:bg-emerald-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Bapak Budi</h2>
                        <p className="text-slate-500">bapak.budi@example.com</p>
                        <div className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                            Paket Premium
                        </div>
                    </div>
                </div>

                {/* Settings Sections */}
                {settingSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">{section.title}</h3>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl">
                            {section.items.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.label}
                                        className={`flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-slate-50 ${index !== section.items.length - 1 ? 'border-b border-slate-100' : ''
                                            }`}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900">{item.label}</h4>
                                            <p className="text-xs text-slate-500">{item.description}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Danger Zone */}
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-rose-500">Zona Bahaya</h3>
                    <div className="overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/50 backdrop-blur-xl">
                        <button className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-rose-100/50">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-rose-700">Keluar Aplikasi</h4>
                                <p className="text-xs text-rose-500">Akhiri sesi anda di perangkat ini</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
