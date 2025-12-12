'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import ExpansionModal from './expansion-modal';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';

import type { Goat as SupabaseGoat } from '@/lib/supabase-queries';

interface Goat extends SupabaseGoat {
    last_location_name?: string;
}

interface Zone {
    name: string;
    color: string;
    center: LatLngExpression;
    coords: LatLngExpression[];
}

// KONFIGURASI ZONA SESUAI DIGITAL FARM - BANTUL
const ZONES: Record<string, Zone> = {
    tidur: {
        name: "Kandang Tidur",
        color: '#3b82f6',
        center: [-7.88945, 110.37010] as LatLngExpression,
        coords: [
            [-7.8893, 110.3699],
            [-7.8893, 110.3703],
            [-7.8896, 110.3703],
            [-7.8896, 110.3699]
        ] as LatLngExpression[]
    },
    pakan: {
        name: "Area Pakan",
        color: '#f97316',
        center: [-7.88960, 110.37025] as LatLngExpression,
        coords: [
            [-7.8895, 110.3701],
            [-7.8895, 110.3704],
            [-7.8897, 110.3704],
            [-7.8897, 110.3701]
        ] as LatLngExpression[]
    },
    minum: {
        name: "Water Station",
        color: '#06b6d4',
        center: [-7.88970, 110.36995] as LatLngExpression,
        coords: [
            [-7.8896, 110.3698],
            [-7.8896, 110.3701],
            [-7.8898, 110.3701],
            [-7.8898, 110.3698]
        ] as LatLngExpression[]
    },
    umbaran: {
        name: "Padang Rumput",
        color: '#22c55e',
        center: [-7.88980, 110.37010] as LatLngExpression,
        coords: [
            [-7.8897, 110.3698],
            [-7.8897, 110.3704],
            [-7.8900, 110.3704],
            [-7.8900, 110.3698]
        ] as LatLngExpression[]
    }
};

// Custom Icon untuk Kambing (Sama persis dengan HTML)
const createGoatIcon = (imgUrl: string, isAlert: boolean) => {
    const borderColor = isAlert ? 'border-red-500' : 'border-white';
    const shadow = isAlert ? 'shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'shadow-xl';
    const animation = isAlert ? 'animate-pulse' : '';

    return new L.DivIcon({
        className: 'custom-goat-icon',
        html: `
            <div class="relative group cursor-pointer hover:z-50 transition-transform duration-300 hover:scale-110" style="width: 56px; height: 64px;">
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-white rounded-full border-4 ${borderColor} ${shadow} ${animation} overflow-hidden z-20">
                    <img src="${imgUrl}" class="w-full h-full object-cover">
                </div>
                <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent ${isAlert ? 'border-t-red-500' : 'border-t-white'} z-10"></div>
                ${isAlert ? `
                <div class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border-2 border-white z-30 animate-bounce">
                   !
                </div>` : ''}
            </div>
        `,
        iconSize: [56, 64],
        iconAnchor: [28, 64],
        popupAnchor: [0, -70]
    });
};

// Component untuk kontrol map
function MapControls() {
    const map = useMap();

    return (
        <div className="absolute bottom-8 right-6 z-[1000] flex flex-col gap-2">
            <button
                className="bg-white/90 hover:bg-white text-gray-700 p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all"
                title="Zoom In"
                onClick={() => map.zoomIn()}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <button
                className="bg-white/90 hover:bg-white text-gray-700 p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all"
                title="Zoom Out"
                onClick={() => map.zoomOut()}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <button
                className="bg-white/90 hover:bg-white text-gray-700 p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all mt-2"
                title="Reset View"
                onClick={() => map.flyTo([-7.8896, 110.3700], 19, { duration: 1.5 })}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    );
}

interface SmartMapComponentProps {
    goats?: Goat[];
    inModal?: boolean;
}

export default function SmartMapComponent({ goats = [], inModal = false }: SmartMapComponentProps) {
    const [showAlert, setShowAlert] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [goatsData, setGoatsData] = useState<Goat[]>([
        {
            id: 'K007',
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
            farm_id: '',
            owner_id: '',
            created_at: '',
            updated_at: '',
            image_url: 'https://images.unsplash.com/photo-1545063328-c8e3fcf02ec8?auto=format&fit=crop&w=100&q=80',
            last_location_name: 'Area Pakan',
            status: 'Aman'
        },
        {
            id: 'K012',
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
            farm_id: '',
            owner_id: '',
            created_at: '',
            updated_at: '',
            image_url: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=100&q=80',
            last_location_name: 'Kandang Tidur',
            status: 'Aman'
        },
        {
            id: 'D005',
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
            farm_id: '',
            owner_id: '',
            created_at: '',
            updated_at: '',
            image_url: 'https://images.unsplash.com/photo-1605058655011-5d7001c576cc?auto=format&fit=crop&w=100&q=80',
            last_location_name: 'Padang Rumput',
            status: 'Perlu Cek'
        }
    ]);

    const activeGoats = goats.length > 0 ? goats : goatsData;

    // Show alert after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowAlert(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Simulate movement (optional - can be controlled by real data)
    useEffect(() => {
        const interval = setInterval(() => {
            setGoatsData(prev => {
                const newData = [...prev];
                const randomIndex = Math.floor(Math.random() * newData.length);
                const zoneKeys = Object.keys(ZONES);
                let newZone = newData[randomIndex].last_location_name;

                while (newZone === newData[randomIndex].last_location_name) {
                    newZone = Object.values(ZONES)[Math.floor(Math.random() * zoneKeys.length)].name;
                }

                newData[randomIndex] = {
                    ...newData[randomIndex],
                    last_location_name: newZone
                };

                return newData;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden">

            {/* Header Overlay */}
            <div className={`absolute z-[1000] flex flex-col ${inModal ? 'top-4 left-4 gap-3' : 'top-1.5 left-1.5 gap-1.5'}`}>
                <div className={`bg-black/70 backdrop-blur-md text-white rounded-lg border border-white/10 shadow-lg flex items-center transition-all hover:bg-black/80 ${inModal ? 'p-3 gap-4 rounded-xl shadow-xl' : 'p-1.5 gap-1.5'}`}>
                    <div>
                        <h3 className={`font-bold uppercase tracking-widest text-emerald-400 ${inModal ? 'text-[10px] mb-0.5' : 'text-[7px] mb-0'}`}>Live Tracking</h3>
                        <div className={`flex items-center ${inModal ? 'gap-1.5' : 'gap-1'}`}>
                            <span className={`relative flex ${inModal ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5'}`}>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-full w-full bg-rose-500"></span>
                            </span>
                            <span className={`font-mono text-gray-200 font-medium ${inModal ? 'text-xs' : 'text-[8px]'}`}>SATELLITE ACTIVE</span>
                        </div>
                    </div>
                    <div className={`bg-white/20 ${inModal ? 'h-8 w-px' : 'h-5 w-px'}`}></div>
                    <div className={`${inModal ? 'text-xs pr-2' : 'text-[8px] pr-1'}`}>
                        <p className="text-gray-400">Total Ternak</p>
                        <p className={`font-bold text-white leading-none ${inModal ? 'text-xl' : 'text-sm'}`}>{activeGoats.length} Ekor</p>
                    </div>
                </div>

                {/* Alert */}
                {showAlert && activeGoats.some(g => g.status === 'Perlu Cek' || g.status === 'Sakit') && (
                    <div className={`bg-orange-500/90 backdrop-blur-md text-white rounded-lg border border-orange-400 shadow-lg flex items-center animate-bounce ${inModal ? 'p-3 gap-3 rounded-xl shadow-xl' : 'p-1.5 gap-1.5'}`}>
                        <div className={`bg-white text-orange-500 rounded-full flex items-center justify-center shrink-0 ${inModal ? 'w-8 h-8' : 'w-5 h-5'}`}>
                            <svg className={`${inModal ? 'w-4 h-4' : 'w-2.5 h-2.5'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className={`font-bold text-orange-100 uppercase ${inModal ? 'text-xs' : 'text-[8px]'}`}>Peringatan AI</p>
                            <p className={`font-bold ${inModal ? 'text-sm' : 'text-[10px]'}`}>Domba Garut: Diam &gt; 30 Menit</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Expand button */}
            {!inModal && (
                <div className="absolute top-4 right-4 z-[1000]">
                    <button
                        onClick={() => setIsExpanded(true)}
                        title="Perbesar Peta"
                        className="bg-white/90 hover:bg-white text-gray-700 p-3 rounded-xl shadow-lg backdrop-blur-sm transition-all hover:scale-105 border border-gray-200/50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6M9 21H3v-6M21 3l-6 6M3 21l6-6" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Legend */}
            <div className={`absolute z-[1000] bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 ${inModal ? 'bottom-4 left-4 p-4 rounded-xl shadow-xl text-xs min-w-[180px]' : 'bottom-1.5 left-1.5 p-2 text-[9px] min-w-[120px]'}`}>
                <h4 className={`font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 ${inModal ? 'mb-3 pb-2' : 'mb-1.5 pb-1'}`}>Zona Kandang</h4>
                <div className={`${inModal ? 'space-y-2' : 'space-y-1'}`}>
                    {Object.entries(ZONES).map(([key, zone]) => (
                        <div key={key} className={`flex items-center ${inModal ? 'gap-2' : 'gap-1'}`}>
                            <span className={`rounded-sm opacity-60 border ${inModal ? 'w-3 h-3' : 'w-2 h-2'}`} style={{ backgroundColor: zone.color, borderColor: zone.color }}></span>
                            <span className="text-gray-700 font-medium">{zone.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <MapContainer
                center={[-7.8896, 110.3700] as LatLngExpression}
                zoom={19}
                minZoom={15}
                maxZoom={20}
                zoomControl={false}
                attributionControl={false}
                style={{ height: "100%", width: "100%" }}
                className={`z-0 ${inModal ? '' : 'rounded-[2rem]'}`}
            >
                {/* Satellite Imagery */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={20}
                    maxNativeZoom={19}
                />

                {/* Label Layer (optional) */}
                <TileLayer
                    url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png"
                    opacity={0.3}
                />

                {/* Zone Polygons */}
                {Object.entries(ZONES).map(([key, zone]) => (
                    <Polygon
                        key={key}
                        positions={zone.coords}
                        pathOptions={{
                            color: zone.color,
                            fillColor: zone.color,
                            fillOpacity: 0.2,
                            weight: 2,
                            dashArray: '6, 6',
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    >
                        <Popup>
                            <div className="text-center font-sans">
                                <strong className="text-sm">{zone.name}</strong>
                            </div>
                        </Popup>
                    </Polygon>
                ))}

                {/* Goat Markers */}
                {activeGoats.map((goat) => {
                    const currentZone = Object.values(ZONES).find(z => z.name === goat.last_location_name) || ZONES.tidur;
                    const isAlert = goat.status === 'Perlu Cek' || goat.status === 'Sakit';
                    const statusClass = isAlert ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200';
                    const statusText = isAlert ? '⚠️ PERLU CEK' : '✅ SEHAT';

                    return (
                        <Marker
                            key={goat.id}
                            position={currentZone.center}
                            icon={createGoatIcon(goat.image_url, isAlert)}
                            zIndexOffset={isAlert ? 1000 : 0}
                        >
                            <Popup>
                                <div className="font-sans text-center p-1">
                                    <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                                        <img src={goat.image_url} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt={goat.name} />
                                        <div className="text-left">
                                            <div className="font-bold text-gray-900 leading-tight">{goat.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{goat.id}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className={`inline-block text-[10px] font-bold px-2 py-1 rounded border ${statusClass}`}>
                                            {statusText}
                                        </div>
                                        <div className="text-xs text-gray-500 bg-gray-50 py-1 px-2 rounded">
                                            Lokasi: <span className="font-semibold text-gray-700">{currentZone.name}</span>
                                        </div>
                                    </div>

                                    <button className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-white text-xs py-1.5 rounded transition-colors font-medium">
                                        Lihat Detail CCTV
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapControls />
            </MapContainer>
            {/* Modal for expanded map view */}
            {!inModal && (
                <ExpansionModal open={isExpanded} onClose={() => setIsExpanded(false)} title="Peta Zonal - Live Tracking Ternak" noPadding>
                    <div className="h-full w-full">
                        <SmartMapComponent inModal />
                    </div>
                </ExpansionModal>
            )}
        </div>
    );
}
