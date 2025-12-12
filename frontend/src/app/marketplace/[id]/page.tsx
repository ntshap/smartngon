import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { getGoatById } from "@/lib/supabase-queries";
import {
    Activity,
    ArrowLeft,
    CheckCircle2,
    MapPin,
    ShieldCheck,
    Thermometer,
    Heart
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyButton from "@/components/buy-button";

export default async function GoatDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const goat = await getGoatById(id);

    if (!goat) {
        notFound();
    }

    // Derived Data for UI
    const badges = [
        {
            label: goat.status,
            className: goat.status === 'Aman' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
            dotClassName: goat.status === 'Aman' ? 'bg-emerald-500' : 'bg-amber-500'
        },
        {
            label: goat.breed,
            className: 'bg-slate-100 text-slate-700',
            dotClassName: null
        }
    ];

    const stats = [
        { label: "Berat", value: `${goat.weight} kg`, icon: Activity },
        { label: "Suhu", value: `${goat.temperature}°C`, icon: Thermometer },
        { label: "Detak Jantung", value: `${goat.heart_rate} bpm`, icon: Heart },
    ];

    return (
        <main className="min-h-screen bg-slate-50">
            <NavBar />

            <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
                <Link
                    href="/marketplace"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Marketplace
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm aspect-[4/3]">
                            <img
                                src={goat.image_url || "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80"}
                                alt={goat.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Placeholder thumbnails (using same image for now) */}
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                                >
                                    <img
                                        src={goat.image_url || "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=200&q=80"}
                                        alt="Thumbnail"
                                        className="h-full w-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                {badges.map((badge) => (
                                    <span
                                        key={badge.label}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                                    >
                                        {badge.dotClassName && (
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${badge.dotClassName}`}
                                            />
                                        )}
                                        {badge.label}
                                    </span>
                                ))}
                            </div>
                            <h1 className="font-manrope mt-4 text-4xl font-bold text-slate-900">
                                {goat.name}
                            </h1>
                            <p className="mt-2 text-lg text-slate-600">
                                {goat.breed} • {goat.weight} kg • {goat.rfid_tag}
                            </p>
                        </div>

                        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
                            <div className="mb-6 flex items-baseline justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-sm text-slate-500">Harga Adopsi</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(goat.price)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Lokasi Kandang</p>
                                    <p className="flex items-center justify-end gap-1 font-medium text-slate-900">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        Blok A-12
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-white p-2 shadow-sm">
                                            <Activity className="h-5 w-5 text-lime-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Skor Kesehatan
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Diperbarui hari ini
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-lime-600">{goat.health_score}%</span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-white p-2 shadow-sm">
                                            <ShieldCheck className="h-5 w-5 text-sky-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Status Vaksin
                                            </p>
                                            <p className="text-xs text-slate-500">Lengkap & Rutin</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-sm font-medium text-sky-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Terverifikasi
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <BuyButton goat={goat} />
                                <p className="mt-3 text-center text-xs text-slate-500">
                                    Garansi kesehatan 14 hari. Transaksi aman & terpercaya.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-manrope text-lg font-bold text-slate-900">
                                    Tentang {goat.name}
                                </h3>
                                <p className="mt-2 leading-relaxed text-slate-600">
                                    {goat.description ||
                                        "Kambing ini memiliki kondisi fisik yang prima dan telah melalui pemeriksaan kesehatan ketat. Sangat cocok untuk investasi jangka panjang atau penggemukan."}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-manrope text-lg font-bold text-slate-900">
                                    Statistik Lengkap
                                </h3>
                                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {stats.map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-xl border border-slate-200 bg-white p-3"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <stat.icon className="h-3 w-3 text-slate-400" />
                                                <p className="text-xs text-slate-500">{stat.label}</p>
                                            </div>
                                            <p className="font-medium text-slate-900">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
