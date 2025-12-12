'use client';

import { Bell, Check, Clock, Info, AlertTriangle } from 'lucide-react';

const notifications = [
    {
        id: 1,
        title: 'Peringatan: Domba Garut Diam > 30 Menit',
        message: 'Sistem mendeteksi anomali pada Domba Garut (D005). Tidak ada pergerakan signifikan selama 30 menit terakhir di area Padang Rumput.',
        time: '2 menit yang lalu',
        type: 'alert',
        read: false,
    },
    {
        id: 2,
        title: 'Jadwal Pakan Sore',
        message: 'Waktunya pemberian pakan sore untuk semua ternak di Kandang A dan B.',
        time: '1 jam yang lalu',
        type: 'info',
        read: false,
    },
    {
        id: 3,
        title: 'Laporan Kesehatan Mingguan',
        message: 'Laporan kesehatan mingguan telah digenerate otomatis oleh sistem. Semua ternak dalam kondisi sehat.',
        time: '5 jam yang lalu',
        type: 'success',
        read: true,
    },
    {
        id: 4,
        title: 'Stok Pakan Menipis',
        message: 'Stok konsentrat tinggal 15%. Segera lakukan pemesanan ulang.',
        time: '1 hari yang lalu',
        type: 'warning',
        read: true,
    },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Notifikasi</h1>
                    <p className="text-slate-500">Pusat informasi dan peringatan sistem</p>
                </div>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Tandai semua dibaca
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`relative overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-md ${notification.read
                            ? 'bg-white border-slate-200'
                            : 'bg-emerald-50/50 border-emerald-100'
                            }`}
                    >
                        <div className="flex gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.type === 'alert' ? 'bg-rose-100 text-rose-600' :
                                notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                    notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {notification.type === 'alert' && <AlertTriangle className="h-5 w-5" />}
                                {notification.type === 'warning' && <Info className="h-5 w-5" />}
                                {notification.type === 'success' && <Check className="h-5 w-5" />}
                                {notification.type === 'info' && <Bell className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <h3 className={`font-bold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="flex items-center text-xs text-slate-400">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {notification.time}
                                    </span>
                                </div>
                                <p className={`mt-1 text-sm ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                        {!notification.read && (
                            <div className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-500"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
