"use client";

import { TrendingUp } from "lucide-react";

interface GrowthHistoryCardProps {
    currentWeight: number; // in kg
    age: string; // e.g., "2 Tahun"
}

export function GrowthHistoryCard({ currentWeight, age }: GrowthHistoryCardProps) {
    // Mock Data Generation based on current weight
    // We'll generate 6 months of data ending at currentWeight
    const generateMockData = () => {
        const data = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
        let weight = currentWeight * 0.7; // Start at 70% of current weight

        for (let i = 0; i < 6; i++) {
            // Add some random fluctuation but general upward trend
            const growth = (currentWeight - weight) / (6 - i) + (Math.random() * 2 - 1);
            weight += growth;
            data.push({
                month: months[i],
                weight: weight,
            });
        }
        // Ensure last point is exactly current weight
        data[5].weight = currentWeight;
        return data;
    };

    const data = generateMockData();

    // Chart Dimensions
    const width = 300;
    const height = 150;
    const padding = 20;

    // Scales
    const maxWeight = Math.max(...data.map((d) => d.weight)) + 5;
    const minWeight = Math.min(...data.map((d) => d.weight)) - 5;
    const xScale = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const yScale = (weight: number) => height - padding - ((weight - minWeight) / (maxWeight - minWeight)) * (height - 2 * padding);

    // Generate Path
    const points = data.map((d, i) => `${xScale(i)},${yScale(d.weight)}`).join(" ");

    // Smooth Curve (Catmull-Rom or simple Bezier approximation)
    // For simplicity, we'll use a basic polyline for now, or a simple curve function if needed.
    // Let's try a simple cubic bezier for smoother look
    const pathD = data.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${xScale(i)},${yScale(point.weight)}`;

        const prev = a[i - 1];
        const currentX = xScale(i);
        const currentY = yScale(point.weight);
        const prevX = xScale(i - 1);
        const prevY = yScale(prev.weight);

        // Control points
        const cp1x = prevX + (currentX - prevX) / 3;
        const cp1y = prevY;
        const cp2x = currentX - (currentX - prevX) / 3;
        const cp2y = currentY;

        return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${currentX},${currentY}`;
    }, "");

    return (
        <div className="rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Histori Pertumbuhan</h3>
                <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    Pertambahan
                </div>
            </div>

            <div className="flex items-end gap-4 mb-4">
                <div>
                    <p className="text-sm font-bold text-slate-500">Berat</p>
                    <p className="text-3xl font-bold text-slate-900">{currentWeight} kg</p>
                </div>
                <div className="mb-1">
                    <p className="text-xs font-bold text-slate-500">Usia</p>
                    <p className="text-sm font-bold text-slate-900">{age}</p>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-sm">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                        const y = padding + (i / 4) * (height - 2 * padding);
                        return (
                            <line
                                key={i}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                        );
                    })}

                    {/* The Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#10b981" // Emerald-500
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {data.map((d, i) => (
                        <circle
                            key={i}
                            cx={xScale(i)}
                            cy={yScale(d.weight)}
                            r="4"
                            fill="white"
                            stroke="#10b981"
                            strokeWidth="2"
                            className="transition-all hover:r-6"
                        />
                    ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between px-2 mt-2">
                    {data.map((d, i) => (
                        <span key={i} className="text-[10px] font-medium text-slate-400">
                            {d.month}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
