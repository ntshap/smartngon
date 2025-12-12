'use client';

// Placeholder for charts since recharts is not installed
// In a real app, you would install recharts: npm install recharts

const weightData = [
    { name: 'Minggu 1', berat: 25 },
    { name: 'Minggu 2', berat: 26.5 },
    { name: 'Minggu 3', berat: 28.2 },
    { name: 'Minggu 4', berat: 30.1 },
    { name: 'Minggu 5', berat: 32.5 },
    { name: 'Minggu 6', berat: 34.8 },
];

const activityData = [
    { name: '06:00', aktivitas: 85 },
    { name: '09:00', aktivitas: 65 },
    { name: '12:00', aktivitas: 45 },
    { name: '15:00', aktivitas: 70 },
    { name: '18:00', aktivitas: 90 },
    { name: '21:00', aktivitas: 30 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Analitik Ternak</h1>
                <p className="text-slate-500">Statistik pertumbuhan dan kesehatan ternak Anda</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Total Ternak */}
                <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
                    <h3 className="text-sm font-medium text-slate-500">Total Populasi</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">48</span>
                        <span className="text-sm font-medium text-emerald-600">+12%</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Dibandingkan bulan lalu</p>
                </div>

                {/* Card 2: Rata-rata Berat */}
                <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
                    <h3 className="text-sm font-medium text-slate-500">Rata-rata Berat</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">32.5</span>
                        <span className="text-sm font-medium text-slate-600">kg</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Naik 2.3kg dari minggu lalu</p>
                </div>

                {/* Card 3: Skor Kesehatan */}
                <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
                    <h3 className="text-sm font-medium text-slate-500">Skor Kesehatan</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-600">96</span>
                        <span className="text-sm font-medium text-slate-600">/100</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Kondisi kandang sangat baik</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Chart 1: Pertumbuhan Berat (Placeholder) */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
                    <h3 className="mb-6 font-bold text-slate-900">Grafik Pertumbuhan Berat (Avg)</h3>
                    <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pb-4 border-b border-l border-slate-200">
                        {weightData.map((data, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                <div
                                    className="w-full bg-emerald-100 rounded-t-lg relative group-hover:bg-emerald-200 transition-all"
                                    style={{ height: `${(data.berat / 40) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {data.berat} kg
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-500 rotate-0 whitespace-nowrap">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart 2: Aktivitas Harian (Placeholder) */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
                    <h3 className="mb-6 font-bold text-slate-900">Aktivitas Harian Ternak</h3>
                    <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pb-4 border-b border-l border-slate-200">
                        {activityData.map((data, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                <div
                                    className="w-full bg-blue-500 rounded-t-md relative group-hover:bg-blue-600 transition-all"
                                    style={{ height: `${data.aktivitas}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {data.aktivitas}%
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-500">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
