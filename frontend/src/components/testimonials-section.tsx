import { ShieldCheck, Stethoscope, Star, Activity, Smartphone } from "lucide-react";

export function TestimonialsSection() {
    return (
        <section className="animate-on-scroll border-gradient relative mx-auto mt-20 w-full max-w-7xl rounded-3xl border border-slate-200 bg-slate-50/80 pb-10 pl-6 pr-6 pt-6 backdrop-blur before:rounded-3xl sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="font-manrope text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                        Pemilik yang tidur lebih nyenyak
                    </h2>
                    <p className="mt-2 max-w-[50ch] text-sm text-slate-600 sm:text-base">
                        Smart Ngangon dibangun bersama peternak lokal, dokter hewan, dan
                        investor untuk membuat kepemilikan kambing jarak jauh benar-benar
                        dapat diandalkan.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1">
                        <ShieldCheck
                            className="h-3.5 w-3.5 text-lime-500"
                            strokeWidth={1.5}
                        />
                        Hardware standar peternakan
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1">
                        <Stethoscope
                            className="h-3.5 w-3.5 text-sky-500"
                            strokeWidth={1.5}
                        />
                        Model AI terinformasi dokter hewan
                    </div>
                </div>
            </div>

            <div className="mb-6 mt-6 h-px bg-slate-200"></div>

            <div className="grid grid-cols-1 gap-5 text-sm md:grid-cols-3">
                <article className="hover-lift rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-medium text-slate-900">
                                Rudi, investor kambing
                            </p>
                            <p className="text-xs text-slate-500">Bandung</p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full border border-lime-200 bg-lime-50 px-2 py-1 text-xs text-lime-700">
                            <Star className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.5} />
                            Monitoring 24/7
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-700">
                        “Sebelum Smart Ngangon, saya tidak tahu kondisi kambing saya di
                        antara kunjungan. Sekarang saya cek HP setiap pagi dan melihat skor
                        kesehatan serta video langsung dalam hitungan detik.”
                    </p>
                </article>

                <article className="hover-lift rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-medium text-slate-900">
                                Sari, peternak mitra
                            </p>
                            <p className="text-xs text-slate-500">Yogyakarta</p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700">
                            <Activity className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Deteksi dini
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-700">
                        “AI memberi tahu saya ketika satu kambing diam tidak seperti
                        biasanya. Kami menanganinya dengan cepat dan menghindari penyakit
                        parah. Rasanya seperti punya dokter hewan yang mengawasi kandang.”
                    </p>
                </article>

                <article className="hover-lift rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-medium text-slate-900">
                                Andi, pemilik modern
                            </p>
                            <p className="text-xs text-slate-500">Surabaya</p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white">
                            <Smartphone
                                className="h-3.5 w-3.5 text-lime-300"
                                strokeWidth={1.5}
                            />
                            Aplikasi di mana saja
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-700">
                        “Saya sering bepergian untuk kerja, tapi saya masih bisa melihat
                        kambing bersama anak-anak dari hotel. Dashboard-nya bersih, cepat,
                        dan sangat menenangkan.”
                    </p>
                </article>
            </div>
        </section>
    );
}
