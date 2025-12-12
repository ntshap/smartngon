"use client";

import { useState, useEffect } from "react";
import { Brain, Check, Clock, Utensils, Zap, Plus, Edit2, Loader2 } from "lucide-react";
import { ScheduleFormModal } from "./schedule-form-modal";

interface Schedule {
    id: string;
    farm_id: string;
    time: string;
    amount_kg: number;
    is_active: boolean;
    status?: 'completed' | 'skipped' | 'pending'; // Derived from time vs current time
}

interface SmartFeedCardProps {
    farmId?: string;
    goatId?: string; // For manual feed trigger
}

export function SmartFeedCard({ farmId = "00000000-0000-0000-0000-000000000000", goatId }: SmartFeedCardProps) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [nextFeed, setNextFeed] = useState("--:--");
    const [isAIDetecting, setIsAIDetecting] = useState(true);
    const [lastFedBy, setLastFedBy] = useState<"schedule" | "ai">("ai");
    const [isLoading, setIsLoading] = useState(false);
    const [isFeeding, setIsFeeding] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    const fetchSchedules = async () => {
        // Only fetch in browser, not during SSR
        if (typeof window === 'undefined') return;
        
        try {
            const response = await fetch(`http://localhost:8000/iot/schedules/${farmId}`, { 
                cache: 'no-store',
                mode: 'cors'
            });
            
            if (!response.ok) {
                console.warn(`Schedule fetch failed with status: ${response.status}`);
                return;
            }
            
            const result = await response.json();
            if (result.status === "success") {
                // Process schedules to determine status
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                const currentTimeVal = currentHour * 60 + currentMinute;

                const processedSchedules = result.data.map((s: any) => {
                    const [h, m] = s.time.split(':').map(Number);
                    const scheduleTimeVal = h * 60 + m;

                    let status: 'completed' | 'skipped' | 'pending' = 'pending';
                    if (currentTimeVal > scheduleTimeVal) {
                        status = 'completed'; // Simplified logic
                    }

                    return { ...s, status };
                });

                setSchedules(processedSchedules);
            }
        } catch (error) {
            console.error("Failed to fetch schedules", error);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    useEffect(() => {
        if (!isMounted) return;
        
        fetchSchedules();
        // Refresh every minute to update statuses
        const interval = setInterval(fetchSchedules, 60000);
        return () => clearInterval(interval);
    }, [farmId, isMounted]);

    // Update next feed time based on pending schedules
    useEffect(() => {
        const pendingSchedule = schedules.find(s => s.status === 'pending');
        if (pendingSchedule) {
            setNextFeed(pendingSchedule.time);
        } else if (schedules.length > 0) {
            // If all completed, show first schedule of next day (or just the first one)
            setNextFeed(schedules[0].time);
        } else {
            setNextFeed("--:--");
        }
    }, [schedules]);

    const handleManualFeed = async () => {
        console.log("Button clicked!"); // DEBUG
        if (!goatId) {
            alert("DEBUG: Goat ID is missing!");
            return;
        }

        console.log("Sending feed command for goat:", goatId); // DEBUG
        setIsFeeding(true);
        try {
            const response = await fetch(`http://localhost:8000/iot/feed/${goatId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ duration_ms: 3000, amount_kg: 0.5 })
            });

            console.log("Response status:", response.status); // DEBUG

            const result = await response.json();
            console.log("Response result:", result); // DEBUG

            if (result.status === "success") {
                alert("DEBUG: Success! Backend received command.");
                setLastFedBy("schedule");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert(`DEBUG: Error calling backend: ${error}`);
        } finally {
            setIsFeeding(false);
        }
    };

    const handleAddSchedule = () => {
        setSelectedSchedule(null);
        setIsModalOpen(true);
    };

    const handleEditSchedule = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-slate-900 p-6 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60 h-full flex flex-col">
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>

                {/* Header */}
                <div className="relative z-10 mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                            <Brain className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Smart Feed AI</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-medium text-emerald-400">Mendeteksi Gesture...</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 backdrop-blur-sm">
                        Auto-Mode
                    </div>
                </div>

                {/* Main Circular Indicator */}
                <div className="relative z-10 mb-8 flex justify-center">
                    <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-white/10 bg-slate-800/50 shadow-inner">
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="currentColor"
                                strokeWidth="7"
                                fill="transparent"
                                className="text-slate-700"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="currentColor"
                                strokeWidth="7"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 88}
                                strokeDashoffset={2 * Math.PI * 88 * 0.3} // 70% filled
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-400">Jadwal Berikutnya</p>
                            <h2 className="text-4xl font-bold tracking-tight text-white">{nextFeed}</h2>
                            <p className="mt-1 text-xs font-medium text-emerald-400">
                                {lastFedBy === 'ai' ? 'Terakhir: AI Trigger (10:30)' : 'Terakhir: Jadwal (08:00)'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Schedule Timeline */}
                <div className="relative z-10 mb-5 flex-1">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-300 mb-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Timeline Hari Ini</span>
                        </div>
                        <button
                            onClick={handleAddSchedule}
                            className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs hover:bg-white/20 transition-colors"
                        >
                            <Plus className="h-3 w-3" /> Tambah
                        </button>
                    </div>
                    <div className="space-y-1.5 rounded-xl bg-white/5 p-2.5 backdrop-blur-sm max-h-[150px] overflow-y-auto custom-scrollbar">
                        {schedules.length === 0 ? (
                            <p className="text-center text-xs text-slate-500 py-4">Belum ada jadwal</p>
                        ) : (
                            schedules.map((schedule, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => handleEditSchedule(schedule)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-semibold text-slate-300">{schedule.time}</span>
                                        <span className="text-xs text-slate-500">{schedule.amount_kg}kg</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {schedule.status === 'completed' && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                                <Check className="h-3 w-3" /> Selesai
                                            </span>
                                        )}
                                        {schedule.status === 'skipped' && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                                                <Zap className="h-3 w-3" /> Di-skip AI
                                            </span>
                                        )}
                                        {schedule.status === 'pending' && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                                <Clock className="h-3 w-3" /> Menunggu
                                            </span>
                                        )}
                                        <Edit2 className="h-3 w-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Manual Override Button */}
                <button
                    onClick={handleManualFeed}
                    disabled={isFeeding}
                    className="relative z-10 mt-auto w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center justify-center gap-2">
                        {isFeeding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Utensils className="h-4 w-4" />
                        )}
                        {isFeeding ? "Memberi Pakan..." : "Beri Pakan Sekarang (Manual)"}
                    </span>
                </button>
            </div>

            <ScheduleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchSchedules}
                initialData={selectedSchedule}
                farmId={farmId}
            />
        </>
    );
}
