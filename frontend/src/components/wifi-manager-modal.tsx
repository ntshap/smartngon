"use client";

import { useState, useEffect } from "react";
import { X, Wifi, Lock, RefreshCw, Check, Signal, SignalHigh, SignalMedium, SignalLow } from "lucide-react";

interface WifiNetwork {
    ssid: string;
    rssi: number;
    auth_mode: string;
}

interface WifiManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WifiManagerModal({ isOpen, onClose }: WifiManagerModalProps) {
    const [networks, setNetworks] = useState<WifiNetwork[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
    const [password, setPassword] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

    const scanNetworks = async () => {
        setIsScanning(true);
        setNetworks([]);
        try {
            // Trigger scan
            await fetch("http://localhost:8000/iot/wifi/scan", { method: "POST" });

            // Poll for results (simulated delay for demo)
            setTimeout(async () => {
                const response = await fetch("http://localhost:8000/iot/wifi/networks");
                const result = await response.json();
                if (result.status === "success") {
                    setNetworks(result.data);
                }
                setIsScanning(false);
            }, 2000);
        } catch (error) {
            console.error("Scan failed", error);
            setIsScanning(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            scanNetworks();
        } else {
            // Reset state when closed
            setSelectedNetwork(null);
            setPassword("");
            setConnectionStatus("idle");
        }
    }, [isOpen]);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNetwork) return;

        setIsConnecting(true);
        try {
            const response = await fetch(`http://localhost:8000/iot/wifi/connect?ssid=${encodeURIComponent(selectedNetwork.ssid)}&password=${encodeURIComponent(password)}`, {
                method: "POST"
            });

            if (response.ok) {
                setConnectionStatus("success");
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setConnectionStatus("error");
            }
        } catch (error) {
            setConnectionStatus("error");
        } finally {
            setIsConnecting(false);
        }
    };

    const getSignalIcon = (rssi: number) => {
        if (rssi > -50) return <SignalHigh className="h-4 w-4 text-emerald-400" />;
        if (rssi > -70) return <SignalMedium className="h-4 w-4 text-yellow-400" />;
        return <SignalLow className="h-4 w-4 text-red-400" />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-slate-900 shadow-2xl ring-1 ring-white/10">
                {/* Header */}
                <div className="relative border-b border-white/10 bg-slate-800/50 px-6 py-4 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-emerald-400" /> WiFi Manager
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Network List */}
                    {!selectedNetwork ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-300">Jaringan Tersedia</span>
                                <button
                                    onClick={scanNetworks}
                                    disabled={isScanning}
                                    className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors disabled:animate-spin"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {isScanning ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-3">
                                        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
                                        <span className="text-xs font-medium">Memindai jaringan...</span>
                                    </div>
                                ) : networks.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        Tidak ada jaringan ditemukan
                                    </div>
                                ) : (
                                    networks.map((net, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedNetwork(net)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getSignalIcon(net.rssi)}
                                                <span className="font-bold text-slate-200">{net.ssid}</span>
                                            </div>
                                            {net.auth_mode !== "Open" && (
                                                <Lock className="h-3 w-3 text-slate-500 group-hover:text-slate-300" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Password Form */
                        <form onSubmit={handleConnect} className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedNetwork(null)}
                                    className="text-xs font-bold text-slate-400 hover:text-white"
                                >
                                    &larr; Kembali
                                </button>
                                <span className="text-lg font-bold text-white">{selectedNetwork.ssid}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Password WiFi</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password..."
                                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isConnecting}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-lg transition-all ${connectionStatus === 'success'
                                        ? 'bg-emerald-500'
                                        : connectionStatus === 'error'
                                            ? 'bg-red-500'
                                            : 'bg-blue-600 hover:bg-blue-500'
                                    }`}
                            >
                                {isConnecting ? (
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                ) : connectionStatus === 'success' ? (
                                    <>
                                        <Check className="h-5 w-5" /> Terhubung!
                                    </>
                                ) : connectionStatus === 'error' ? (
                                    "Gagal Terhubung"
                                ) : (
                                    "Hubungkan"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
