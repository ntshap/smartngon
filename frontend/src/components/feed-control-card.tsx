"use client";

import { Zap, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export function FeedControlCard() {
    const [isDispensing, setIsDispensing] = useState(false);
    const [status, setStatus] = useState<"ready" | "dispensing" | "success">("ready");

    const handleDispense = () => {
        if (status !== "ready") return;

        setIsDispensing(true);
        setStatus("dispensing");

        // Simulate dispensing process
        setTimeout(() => {
            setIsDispensing(false);
            setStatus("success");

            // Reset to ready after 3 seconds
            setTimeout(() => {
                setStatus("ready");
            }, 3000);
        }, 2000);
    };

    return (
        <div className="rounded-[2.5rem] border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ring-1 ring-white/10">
            <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-bold">Kontrol Pakan</h3>
                <div
                    className={`rounded-full border px-3 py-1 text-xs font-bold shadow-sm transition-colors duration-300 ${status === "ready"
                            ? "border-white/20 bg-white/10 text-emerald-400"
                            : status === "dispensing"
                                ? "border-amber-500/50 bg-amber-500/20 text-amber-400"
                                : "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                        }`}
                >
                    {status === "ready" && "Ready"}
                    {status === "dispensing" && "Dispensing..."}
                    {status === "success" && "Selesai"}
                </div>
            </div>

            <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
                {/* Circular Progress Mockup */}
                <svg className="h-full w-full -rotate-90 transform transition-all duration-500">
                    <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="currentColor"
                        strokeWidth="24"
                        fill="transparent"
                        className="text-slate-800"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="currentColor"
                        strokeWidth="24"
                        fill="transparent"
                        strokeDasharray="691"
                        strokeDashoffset={status === "dispensing" ? "200" : "500"}
                        strokeLinecap="round"
                        className={`transition-all duration-[2000ms] ease-in-out ${status === "success" ? "text-emerald-400" : "text-emerald-500"
                            } drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold drop-shadow-lg">16:00</span>
                    <span className="text-sm font-semibold text-slate-400">
                        Jadwal Berikutnya
                    </span>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={handleDispense}
                    disabled={status !== "ready"}
                    className={`group flex w-full items-center justify-center gap-2 rounded-[2rem] py-4 font-bold text-white shadow-[0_8px_32px_0_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.6)] disabled:cursor-not-allowed disabled:opacity-80 ${status === "success" ? "bg-emerald-600" : "bg-emerald-500 hover:bg-emerald-400"
                        }`}
                >
                    {status === "ready" && (
                        <>
                            <Zap className="h-5 w-5 fill-white" /> Beri Pakan Sekarang
                        </>
                    )}
                    {status === "dispensing" && (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <CheckCircle2 className="h-5 w-5" /> Berhasil
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
