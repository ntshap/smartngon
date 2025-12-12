"use client";

import { Activity, AlertTriangle, Brain, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface AIEvent {
    id: string;
    type: "detection" | "gesture" | "anomaly";
    message: string;
    timestamp: Date;
    confidence?: number;
}

export function AIEventLogCard() {
    const [events, setEvents] = useState<AIEvent[]>([
        {
            id: "1",
            type: "gesture",
            message: "Head Shake Detected (10x)",
            timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
            confidence: 0.98,
        },
        {
            id: "2",
            type: "detection",
            message: "Goat Detected (K-007)",
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
            confidence: 0.95,
        },
        {
            id: "3",
            type: "anomaly",
            message: "Stationary > 30m",
            timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
        },
    ]);

    // Simulate incoming events
    useEffect(() => {
        const interval = setInterval(() => {
            const random = Math.random();
            if (random > 0.7) {
                const newEvent: AIEvent = {
                    id: Date.now().toString(),
                    type: random > 0.9 ? "gesture" : "detection",
                    message: random > 0.9 ? "Head Shake Detected" : "Goat Detected",
                    timestamp: new Date(),
                    confidence: 0.85 + Math.random() * 0.14,
                };
                setEvents((prev) => [newEvent, ...prev].slice(0, 5)); // Keep last 5
            }
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="mt-6 rounded-[2.5rem] border border-white/40 bg-slate-900 p-6 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-sm font-bold">AI Event Log</h3>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            </div>

            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 ${event.type === 'gesture' ? 'text-emerald-400' :
                                event.type === 'anomaly' ? 'text-amber-400' : 'text-blue-400'
                            }`}>
                            {event.type === 'gesture' && <Brain className="h-4 w-4" />}
                            {event.type === 'anomaly' && <AlertTriangle className="h-4 w-4" />}
                            {event.type === 'detection' && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-white">{event.message}</p>
                                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                    <Clock className="h-3 w-3" /> {formatTime(event.timestamp)}
                                </span>
                            </div>
                            {event.confidence && (
                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                    Confidence: {(event.confidence * 100).toFixed(0)}%
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
