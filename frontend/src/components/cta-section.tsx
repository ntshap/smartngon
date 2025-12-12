import { UserPlus } from "lucide-react";
import { GlowButton } from "./glow-button";

export function CtaSection() {
    return (
        <section className="animate-on-scroll relative mx-auto mt-20 w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 pb-7 pl-6 pr-6 pt-7 text-slate-50 sm:p-8">
            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    background:
                        "radial-gradient(circle at top, rgba(190,242,100,0.25), transparent 55%), radial-gradient(circle at 10% 80%, rgba(56,189,248,0.15), transparent 55%)",
                }}
            ></div>
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="font-manrope text-3xl font-medium tracking-tight sm:text-4xl">
                        Siap bertemu kambing pintar pertama Anda?
                    </h2>
                    <p className="mt-2 max-w-[48ch] text-sm text-slate-200 sm:text-base">
                        Jelajahi marketplace, pilih kambing yang Anda suka, dan dapatkan
                        dashboard langsung hanya dalam beberapa klik.
                    </p>
                </div>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <GlowButton label="Lihat Kambing" />
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-500 bg-transparent px-4 py-2 text-xs text-slate-100 transition hover:border-lime-300 hover:bg-slate-800 hover:text-white sm:text-sm">
                        Gabung Waitlist
                        <UserPlus
                            className="h-3.5 w-3.5 text-lime-300"
                            strokeWidth={1.5}
                        />
                    </button>
                </div>
            </div>
        </section>
    );
}
