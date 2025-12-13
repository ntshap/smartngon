"use client";

import { useEffect, useState } from "react";
import { MessagesSquare, ChevronRight } from "lucide-react";
import { getFaqs, FAQ } from "@/lib/admin-queries";

// Fallback data if database is empty
const FALLBACK_FAQS = [
    {
        id: "1",
        question: "Bagaimana saya tahu kambingnya benar-benar ada dan sehat?",
        answer: "Setiap kambing memiliki foto, video, dan catatan terverifikasi dari peternakan mitra kami. AI dan staf di lokasi kami terus memantau kesehatan dan perilaku. Anda juga dapat menjadwalkan kunjungan langsung atau pemeriksaan dokter hewan independen sebelum membeli.",
        category: "general",
    },
    {
        id: "2",
        question: "Apakah saya perlu perangkat keras di rumah?",
        answer: "Tidak. Semua kamera, pembaca RFID, dan sensor dipasang di peternakan. Anda hanya perlu ponsel atau laptop dengan koneksi internet untuk mengakses dashboard Anda.",
        category: "teknis",
    },
    {
        id: "3",
        question: "Apa yang terjadi jika kambing sakit?",
        answer: "Sistem kami menandai masalah sejak dini sehingga staf peternakan dan dokter hewan dapat bertindak cepat. Anda akan menerima peringatan, ringkasan temuan, dan rekomendasi langkah selanjutnya. Keputusan perawatan dan biaya selalu didiskusikan dengan Anda terlebih dahulu.",
        category: "layanan",
    },
    {
        id: "4",
        question: "Bisakah saya menjual kembali atau memindahkan kepemilikan?",
        answer: "Ya. Anda dapat mendaftarkan kambing untuk dijual kembali di pasar Smart Ngangon atau mentransfer kepemilikan ke pengguna terverifikasi lainnya. Riwayat monitoring dapat dibagikan dengan pemilik baru untuk membuktikan kesehatan dan perawatan.",
        category: "pembelian",
    },
    {
        id: "5",
        question: "Apakah video dan data saya aman?",
        answer: "Kami menggunakan streaming terenkripsi, token akses aman, dan audit rutin untuk melindungi data Anda. Hanya Anda dan staf peternakan berwenang yang dapat melihat informasi detail kambing Anda.",
        category: "teknologi",
    },
    {
        id: "6",
        question: "Di mana Smart Ngangon tersedia saat ini?",
        answer: "Saat ini kami beroperasi dengan peternakan mitra di wilayah terpilih di Indonesia dan sedang berekspansi. Bergabunglah dengan daftar tunggu untuk diberi tahu saat kami meluncur di daerah Anda.",
        category: "layanan",
    },
];

export function FaqSection() {
    const [faqs, setFaqs] = useState<FAQ[] | typeof FALLBACK_FAQS>(FALLBACK_FAQS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFaqs() {
            try {
                const data = await getFaqs(true);
                if (data && data.length > 0) {
                    setFaqs(data);
                }
            } catch (error) {
                console.error("Error loading FAQs:", error);
            }
            setIsLoading(false);
        }
        loadFaqs();
    }, []);

    // Split FAQs into two columns
    const midpoint = Math.ceil(faqs.length / 2);
    const leftColumn = faqs.slice(0, midpoint);
    const rightColumn = faqs.slice(midpoint);

    return (
        <section className="animate-on-scroll border-gradient relative mx-auto mt-20 w-full max-w-7xl rounded-3xl border border-slate-200 bg-white/90 pb-10 pl-6 pr-6 pt-6 backdrop-blur before:rounded-3xl sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="font-manrope text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                        Pertanyaan yang sering diajukan
                    </h2>
                    <p className="mt-2 max-w-[48ch] text-sm text-slate-600 sm:text-base">
                        Gambaran singkat bagaimana Smart Ngangon bekerja. Hubungi kami jika
                        butuh detail lebih lanjut.
                    </p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                    <MessagesSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Hubungi tim kami
                </button>
            </div>

            <div className="mb-6 mt-6 h-px bg-slate-200"></div>

            <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                <div className="space-y-4">
                    {leftColumn.map((faq) => (
                        <details
                            key={faq.id}
                            className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                                <span className="text-sm font-medium text-slate-900">
                                    {faq.question}
                                </span>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500 transition group-open:rotate-90">
                                    <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
                                </span>
                            </summary>
                            <p className="mt-3 text-xs text-slate-700 whitespace-pre-wrap">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>

                <div className="space-y-4">
                    {rightColumn.map((faq) => (
                        <details
                            key={faq.id}
                            className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                                <span className="text-sm font-medium text-slate-900">
                                    {faq.question}
                                </span>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500 transition group-open:rotate-90">
                                    <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
                                </span>
                            </summary>
                            <p className="mt-3 text-xs text-slate-700 whitespace-pre-wrap">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
