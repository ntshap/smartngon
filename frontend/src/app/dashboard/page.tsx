"use client";

import Image from "next/image";
import SmartMap from "@/components/smart-map";
import LiveCamera from "@/components/live-camera-wrapper";
import { WeatherWidget } from "@/components/weather-widget";
import { FeedControlCard } from "@/components/feed-control-card";
import { SmartFeedCard } from "@/components/smart-feed-card";
import { GoatDetailModal } from "@/components/goat-detail-modal";
import { AIAssistantFAB } from "@/components/ai-assistant-fab";
import { useState, useEffect } from "react";
import { getGoats, type Goat } from "@/lib/supabase-queries";
import { SensorChart } from "@/components/sensor-chart";
import { GoatFormModal } from "@/components/goat-form-modal";
import { GrowthHistoryCard } from "@/components/growth-history-card";
import { OptimalSellingCard } from "@/components/optimal-selling-card";
import { WifiManagerModal } from "@/components/wifi-manager-modal";

import {
    AlertTriangle,
    ArrowRight,
    Bot,
    CheckCircle,
    Filter,
    Loader2,
    MoreHorizontal,
    Video,
    Wifi,
} from "lucide-react";

export default function DashboardPage() {
    const [goatsData, setGoatsData] = useState<Goat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGoat, setSelectedGoat] = useState<Goat | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);

    // MOCK DATA FOR DEMO IF DB IS EMPTY
    const MOCK_GOATS: Goat[] = [
        {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Kambing Gibas',
            rfid_tag: 'TAG-001',
            breed: 'Gibas',
            birth_date: '2023-01-01',
            weight: 45,
            health_score: 100,
            temperature: 38.5,
            heart_rate: 80,
            last_vaccine_date: '2023-01-01',
            price: 0,
            is_for_sale: false,
            description: '',
            farm_id: '00000000-0000-0000-0000-000000000000',
            owner_id: '00000000-0000-0000-0000-000000000000',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: '/images/goats/kambing a.jpg',
            status: 'Aman'
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Kambing Etawa',
            rfid_tag: 'TAG-002',
            breed: 'Etawa',
            birth_date: '2023-01-01',
            weight: 50,
            health_score: 100,
            temperature: 38.5,
            heart_rate: 80,
            last_vaccine_date: '2023-01-01',
            price: 0,
            is_for_sale: false,
            description: '',
            farm_id: '00000000-0000-0000-0000-000000000000',
            owner_id: '00000000-0000-0000-0000-000000000000',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: '/images/goats/kambing b.jpg',
            status: 'Aman'
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            name: 'Domba Garut',
            rfid_tag: 'TAG-003',
            breed: 'Garut',
            birth_date: '2023-01-01',
            weight: 60,
            health_score: 80,
            temperature: 39.5,
            heart_rate: 90,
            last_vaccine_date: '2023-01-01',
            price: 0,
            is_for_sale: false,
            description: '',
            farm_id: '00000000-0000-0000-0000-000000000000',
            owner_id: '00000000-0000-0000-0000-000000000000',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: '/images/goats/kambing c.jpg',
            status: 'Perlu Cek'
        }
    ];

    async function loadGoats() {
        setIsLoading(true);
        let data = await getGoats();

        // Fallback to mock data if DB is empty
        if (data.length === 0) {
            data = MOCK_GOATS;
        }

        setGoatsData(data);
        setIsLoading(false);
    }

    useEffect(() => {
        loadGoats();
    }, []);

    const handleGoatClick = (goat: Goat) => {
        setSelectedGoat(goat);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleAddGoat = () => {
        setSelectedGoat(null);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleGoatAdded = () => {
        loadGoats();
    };

    return (
        <>
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <h1 className="font-manrope text-4xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
                        Kandang Saya
                    </h1>
                    <p className="mt-2 font-semibold text-slate-600">
                        Pantau kesehatan dan lokasi ternak Anda secara real-time.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <WeatherWidget />
                    <button
                        onClick={() => setIsWifiModalOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/40 text-slate-700 shadow-lg hover:bg-white hover:scale-110 transition-all"
                        title="WiFi Manager"
                    >
                        <Wifi className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleAddGoat}
                        className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all"
                    >
                        <span>+ Tambah Ternak</span>
                    </button>
                    <span className="hidden md:flex items-center gap-2 rounded-full border border-white/40 bg-white/70 backdrop-blur-xl px-4 py-2 text-sm font-bold text-slate-700 shadow-lg ring-1 ring-white/60">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        </span>
                        System Online
                    </span>
                </div>
            </div>

            {/* Main Dashboard Grid - Top Row (Overview) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Column 1: Status Card (Alerts) */}
                <div className="flex flex-col justify-between rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-700">
                                Status Kandang
                            </span>
                            <span className="rounded-full border border-slate-200/50 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-amber-600 shadow-sm">
                                Perlu Cek
                            </span>
                        </div>
                        <div className="mt-6 flex items-start gap-4">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/80 backdrop-blur-sm text-amber-600 shadow-lg">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-600">
                                    Peringatan Aktif
                                </p>
                                <p className="text-lg font-bold text-slate-900 leading-snug">
                                    Kambing K-007 diam terlalu lama.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => goatsData.length > 0 && handleGoatClick(goatsData[0])}
                            className="group flex w-full items-center justify-center gap-2 rounded-[2rem] bg-slate-900 py-4 font-bold text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                        >
                            Lihat Detail <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Column 2: Goat Grid (Living Room Style) */}
                <div className="flex flex-col rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Daftar Ternak</h3>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/80 backdrop-blur-sm text-slate-700 shadow-sm hover:bg-white">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {isLoading ? (
                            <div className="col-span-2 flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            </div>
                        ) : goatsData.length === 0 ? (
                            <div className="col-span-2 text-center py-12">
                                <p className="text-slate-600 font-semibold">Belum ada data kambing</p>
                            </div>
                        ) : (
                            <>
                                {goatsData.slice(0, 3).map((goat) => (
                                    <button
                                        key={goat.id}
                                        onClick={() => handleGoatClick(goat)}
                                        className="text-left rounded-[2rem] border border-white/50 bg-white/60 backdrop-blur-md p-5 shadow-sm transition-all hover:border-white/70 hover:bg-white/80 hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        <div className="mb-4 relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/80 shadow-md ring-2 ring-white/50">
                                            <Image src={goat.image_url} alt={goat.name} fill className="object-cover" sizes="48px" />
                                        </div>
                                        <p className="font-bold text-slate-900">{goat.name}</p>
                                        <p className="text-xs font-bold text-slate-600">{goat.breed}</p>
                                        <div className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${goat.status === 'Aman' ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>
                                            {goat.status === 'Aman' ? (
                                                <CheckCircle className="h-3 w-3" />
                                            ) : (
                                                <AlertTriangle className="h-3 w-3" />
                                            )}
                                            {goat.status}
                                        </div>
                                    </button>
                                ))}

                                {/* View All Button */}
                                {goatsData.length > 3 && (
                                    <div className="flex items-center justify-center rounded-[2rem] border border-white/50 bg-white/60 backdrop-blur-md p-5 shadow-sm transition-all hover:bg-white/80 hover:shadow-lg cursor-pointer">
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 backdrop-blur-sm text-slate-600 shadow-sm">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">Lihat Semua</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Column 3: Biodata & Logs (Moved from Detail Section) */}
                <div className="space-y-4">
                    {/* Bio Card */}
                    <div className="rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Bot className="h-5 w-5 text-slate-700" /> Biodata K-007
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-200/30 pb-3">
                                <span className="text-sm font-bold text-slate-600">Berat</span>
                                <span className="font-bold text-slate-900">45 kg</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200/30 pb-3">
                                <span className="text-sm font-bold text-slate-600">Umur</span>
                                <span className="font-bold text-slate-900">2 Tahun</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-bold text-slate-600">RFID</span>
                                <span className="font-mono font-bold text-slate-900">TAG-8821</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Logs (Subtle Card) */}
                    <div className="rounded-[2.5rem] border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60">
                        <h3 className="mb-6 text-lg font-bold text-slate-900">Log Aktivitas</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/80 backdrop-blur-md shadow-sm">
                                    <Video className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Anomaly Detected</p>
                                    <p className="text-xs font-semibold text-slate-600">10:03 WIB • Diam &gt; 30m</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/80 backdrop-blur-md shadow-sm">
                                    <Wifi className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Masuk Area Pakan</p>
                                    <p className="text-xs font-semibold text-slate-600">10:01 WIB • RFID</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: AI Vision System (FULL WIDTH) */}
            <div id="detail-k007" className="mt-6">
                <div className="rounded-[2.5rem] border border-white/40 bg-slate-900 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60 overflow-hidden">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">AI Vision System</h3>
                        <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 backdrop-blur-sm">
                            Live
                        </span>
                    </div>
                    <div className="relative h-[450px] w-full rounded-2xl border border-white/10 overflow-hidden">
                        <LiveCamera />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Smart Feed AI + Peta Zonal (Side by Side) */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left: Smart Feed AI */}
                <SmartFeedCard
                    farmId={selectedGoat?.farm_id || (goatsData.length > 0 ? goatsData[0].farm_id : undefined)}
                    goatId={selectedGoat?.id || (goatsData.length > 0 ? goatsData[0].id : undefined)}
                />

                {/* Right: Peta Zonal (Compact) */}
                <div className="relative flex flex-col rounded-[2.5rem] border border-white/40 bg-slate-900 p-6 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/60 overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Peta Zonal</h3>
                        <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 backdrop-blur-sm">
                            Real-time
                        </span>
                    </div>

                    <div className="relative z-10 h-[320px] w-full rounded-2xl border border-white/10 overflow-hidden flex-1">
                        <SmartMap goats={goatsData} />
                    </div>
                </div>
            </div>

            {/* Financial & Growth Section */}
            {
                selectedGoat && (
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <GrowthHistoryCard
                            currentWeight={selectedGoat.weight || 0}
                            age={selectedGoat.birth_date ? `${new Date().getFullYear() - new Date(selectedGoat.birth_date).getFullYear()} Tahun` : "N/A"}
                        />
                        <OptimalSellingCard currentWeight={selectedGoat.weight || 0} />
                    </div>
                )
            }

            {/* If no goat selected but data exists, show for first goat */}
            {
                !selectedGoat && goatsData.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <GrowthHistoryCard
                            currentWeight={goatsData[0].weight || 0}
                            age={goatsData[0].birth_date ? `${new Date().getFullYear() - new Date(goatsData[0].birth_date).getFullYear()} Tahun` : "N/A"}
                        />
                        <OptimalSellingCard currentWeight={goatsData[0].weight || 0} />
                    </div>
                )
            }

            {/* Modals & Floating Elements */}
            <GoatDetailModal
                isOpen={isModalOpen && !!selectedGoat && !isEditing}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedGoat(null);
                }}
                goat={selectedGoat}
                onEdit={(goat) => {
                    setIsEditing(true);
                }}
            />

            <GoatFormModal
                isOpen={isModalOpen && (isEditing || !selectedGoat)}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                }}
                onSuccess={handleGoatAdded}
                initialData={isEditing ? selectedGoat : null}
            />

            <AIAssistantFAB />

            <WifiManagerModal
                isOpen={isWifiModalOpen}
                onClose={() => setIsWifiModalOpen(false)}
            />
        </>
    );
}
