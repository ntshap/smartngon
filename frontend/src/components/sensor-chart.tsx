"use client";

import { useEffect, useState } from "react";
import { getSensorLogsByType, subscribeToSensorLogs, type SensorLog } from "@/lib/supabase-queries";

interface SensorChartProps {
    goatId: string;
    sensorType: "temperature" | "heart_rate";
    label: string;
    unit: string;
    color: string;
}

export function SensorChart({ goatId, sensorType, label, unit, color }: SensorChartProps) {
    const [logs, setLogs] = useState<SensorLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        async function fetchLogs() {
            setIsLoading(true);
            const data = await getSensorLogsByType(goatId, sensorType, 12);
            setLogs(data.reverse()); // Oldest first for chart
            setIsLoading(false);
        }
        fetchLogs();

        // Subscribe to real-time updates
        const channel = subscribeToSensorLogs(goatId, (payload) => {
            if (payload.new.sensor_type === sensorType) {
                setLogs((prev) => {
                    const newLogs = [...prev, payload.new];
                    // Keep only last 12 entries
                    return newLogs.slice(-12);
                });
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, [goatId, sensorType]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-sm text-slate-400">Loading...</div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-sm text-slate-500">Belum ada data</p>
            </div>
        );
    }

    // Get min and max for scaling
    const values = logs.map((log) => log.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Calculate bar heights (percentage)
    const bars = logs.map((log) => {
        const percentage = ((log.value - minValue) / range) * 100;
        return {
            height: Math.max(percentage, 5), // Minimum 5% for visibility
            value: log.value,
            timestamp: new Date(log.timestamp),
        };
    });

    // Format time for labels
    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-700">{label}</h4>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`}></span>
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`}></span>
                    </span>
                    <span className="text-xs font-medium text-slate-500">Live</span>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-32 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-end justify-between h-full gap-1">
                    {bars.map((bar, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                            {/* Bar */}
                            <div className="relative w-full flex items-end justify-center h-full">
                                <div
                                    className={`w-full ${color} rounded-t transition-all duration-300 hover:opacity-80 relative`}
                                    style={{ height: `${bar.height}%` }}
                                >
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap">
                                            {bar.value.toFixed(1)} {unit}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Time label */}
                            <span className="text-[9px] text-slate-400 font-medium">
                                {formatTime(bar.timestamp)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium">Min</p>
                    <p className="text-sm font-bold text-slate-900">{minValue.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium">Avg</p>
                    <p className="text-sm font-bold text-slate-900">
                        {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}
                    </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium">Max</p>
                    <p className="text-sm font-bold text-slate-900">{maxValue.toFixed(1)}</p>
                </div>
            </div>
        </div>
    );
}
