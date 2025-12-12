export type GoatStat = {
    label: string;
    value: string;
    valueClassName?: string;
};

export type GoatBadge = {
    label: string;
    className: string;
    dotClassName?: string;
};

export type Goat = {
    id: string;
    nickname: string;
    info: string;
    price: string;
    rawPrice: number; // Added for calculation
    purchaseNote: string;
    image: string;
    badges: GoatBadge[];
    healthScore: string;
    tagLabel: string;
    stats: GoatStat[];
    description?: string; // Added for detail page
};

export const marketplaceGoats: Goat[] = [
    {
        id: "G-204",
        nickname: "Luna",
        info: "12 bulan | 32 kg | Silangan Etawa",
        price: "Rp 3.200.000",
        rawPrice: 3200000,
        purchaseNote: "Pembelian sekali bayar",
        image: "https://images.unsplash.com/photo-1676242968884-12fc1b7f1b58?w=1600&q=80",
        badges: [
            {
                label: "Tersedia",
                className:
                    "text-slate-900 bg-white/90 border border-slate-200 text-[11px]",
                dotClassName: "bg-lime-500",
            },
            {
                label: "Siap dipantau AI",
                className:
                    "text-lime-700 bg-lime-50/95 border border-lime-200 text-[11px]",
            },
        ],
        healthScore: "Skor kesehatan: 99%",
        tagLabel: "Tag RFID #G-204",
        stats: [
            { label: "Vaksinasi", value: "Lengkap" },
            { label: "Temperamen", value: "Tenang" },
            {
                label: "Pemantauan",
                value: "24/7",
                valueClassName: "text-emerald-600",
            },
        ],
        description: "Luna adalah kambing silangan Etawa yang sangat sehat dan aktif. Cocok untuk penggemukan atau sebagai indukan pemula. Memiliki riwayat kesehatan yang sangat baik dan sudah terbiasa dengan pakan konsentrat.",
    },
    {
        id: "G-318",
        nickname: "Aruna",
        info: "18 bulan | 40 kg | Silangan Boer",
        price: "Rp 4.100.000",
        rawPrice: 4100000,
        purchaseNote: "Pembelian sekali bayar",
        image: "https://images.unsplash.com/photo-1534941725085-38c6e5f65f33?w=1600&q=80",
        badges: [
            {
                label: "Tersedia",
                className:
                    "text-slate-900 bg-white/90 border border-slate-200 text-[11px]",
                dotClassName: "bg-lime-500",
            },
            {
                label: "Cocok untuk pembiakan",
                className:
                    "text-sky-700 bg-sky-50/95 border border-sky-200 text-[11px]",
            },
        ],
        healthScore: "Skor kesehatan: 96%",
        tagLabel: "Tag RFID #G-318",
        stats: [
            { label: "Reproduksi", value: "Sudah dicek" },
            { label: "Perilaku", value: "Aktif" },
            {
                label: "Pemantauan",
                value: "24/7",
                valueClassName: "text-emerald-600",
            },
        ],
        description: "Aruna memiliki genetika Boer yang kuat, menjadikannya pilihan tepat untuk program breeding. Pertumbuhan berat badannya di atas rata-rata dan memiliki temperamen yang mudah ditangani.",
    },
    {
        id: "G-452",
        nickname: "Rama",
        info: "8 bulan | 27 kg | Ras lokal",
        price: "Rp 2.600.000",
        rawPrice: 2600000,
        purchaseNote: "Pembelian sekali bayar",
        image: "https://images.unsplash.com/photo-1732457389865-0dff9a711195?w=1600&q=80",
        badges: [
            {
                label: "Dipesan",
                className:
                    "text-slate-900 bg-white/90 border border-slate-200 text-[11px]",
                dotClassName: "bg-amber-400",
            },
            {
                label: "Baru di peternakan",
                className:
                    "text-emerald-700 bg-emerald-50/95 border border-emerald-200 text-[11px]",
            },
        ],
        healthScore: "Skor kesehatan: 94%",
        tagLabel: "Tag RFID #G-452",
        stats: [
            { label: "Vaksinasi", value: "Terjadwal" },
            { label: "Pemantauan", value: "Termasuk" },
            { label: "Status", value: "Dipesan", valueClassName: "text-amber-600" },
        ],
        description: "Rama adalah bibit unggul ras lokal yang baru saja masuk ke fasilitas kami. Sedang dalam masa karantina dan adaptasi, namun menunjukkan potensi pertumbuhan yang baik.",
    },
];
