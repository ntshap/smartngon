"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Stethoscope, Star, Activity, Smartphone } from "lucide-react";
import { getTestimonials, Testimonial } from "@/lib/admin-queries";

// Fallback data if database is empty
const FALLBACK_TESTIMONIALS = [
    {
        id: "1",
        name: "Rudi",
        location: "Bandung",
        role: "Investor kambing",
        content: "Sebelum Smart Ngangon, saya tidak tahu kondisi kambing saya di antara kunjungan. Sekarang saya cek HP setiap pagi dan melihat skor kesehatan serta video langsung dalam hitungan detik.",
        badge_label: "Monitoring 24/7",
        badge_icon: "star",
        badge_color: "lime",
    },
    {
        id: "2",
        name: "Sari",
        location: "Yogyakarta",
        role: "Peternak mitra",
        content: "AI memberi tahu saya ketika satu kambing diam tidak seperti biasanya. Kami menanganinya dengan cepat dan menghindari penyakit parah. Rasanya seperti punya dokter hewan yang mengawasi kandang.",
        badge_label: "Deteksi dini",
        badge_icon: "activity",
        badge_color: "sky",
    },
    {
        id: "3",
        name: "Andi",
        location: "Surabaya",
        role: "Pemilik modern",
        content: "Saya sering bepergian untuk kerja, tapi saya masih bisa melihat kambing bersama anak-anak dari hotel. Dashboard-nya bersih, cepat, dan sangat menenangkan.",
        badge_label: "Aplikasi di mana saja",
        badge_icon: "smartphone",
        badge_color: "slate",
    },
];

const getBadgeIcon = (icon: string) => {
    switch (icon) {
        case "star":
            return Star;
        case "activity":
            return Activity;
        case "smartphone":
            return Smartphone;
        default:
            return Star;
    }
};

const getBadgeClasses = (color: string) => {
    switch (color) {
        case "lime":
            return "border-lime-200 bg-lime-50 text-lime-700";
        case "sky":
            return "border-sky-200 bg-sky-50 text-sky-700";
        case "slate":
            return "border-slate-800 bg-slate-900 text-white";
        case "amber":
            return "border-amber-200 bg-amber-50 text-amber-700";
        default:
            return "border-lime-200 bg-lime-50 text-lime-700";
    }
};

export function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[] | typeof FALLBACK_TESTIMONIALS>(FALLBACK_TESTIMONIALS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadTestimonials() {
            try {
                const data = await getTestimonials(true);
                if (data && data.length > 0) {
                    setTestimonials(data);
                }
            } catch (error) {
                console.error("Error loading testimonials:", error);
            }
            setIsLoading(false);
        }
        loadTestimonials();
    }, []);

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
                {testimonials.slice(0, 3).map((testimonial) => {
                    const BadgeIcon = getBadgeIcon(testimonial.badge_icon || "star");
                    const badgeClasses = getBadgeClasses(testimonial.badge_color || "lime");

                    return (
                        <article
                            key={testimonial.id}
                            className="hover-lift rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {testimonial.name}, {testimonial.role}
                                    </p>
                                    <p className="text-xs text-slate-500">{testimonial.location}</p>
                                </div>
                                {testimonial.badge_label && (
                                    <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${badgeClasses}`}>
                                        <BadgeIcon
                                            className={`h-3.5 w-3.5 ${testimonial.badge_color === "slate" ? "text-lime-300" : ""}`}
                                            strokeWidth={1.5}
                                        />
                                        {testimonial.badge_label}
                                    </div>
                                )}
                            </div>
                            <p className="mt-3 text-xs text-slate-700">
                                "{testimonial.content}"
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
