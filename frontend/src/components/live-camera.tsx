'use client';

import { useEffect, useRef, useState } from 'react';
import ExpansionModal from './expansion-modal';

export default function LiveCamera({ inModal }: { inModal?: boolean } = {}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isAIEnabled, setIsAIEnabled] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnomaliMode, setIsAnomaliMode] = useState(false);
    const [fps, setFps] = useState(0);
    const [confidence, setConfidence] = useState(0);
    const [detections, setDetections] = useState<any[]>([]);
    const detectionsRef = useRef<any[]>([]); // Ref to avoid stale closure in drawAI
    const [isInferencing, setIsInferencing] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState('');
    const [zoneInfo, setZoneInfo] = useState<any>(null);
    const [movementCount, setMovementCount] = useState(0);
    const [feedingTriggered, setFeedingTriggered] = useState(false);
    const [apiConnected, setApiConnected] = useState<boolean | null>(null); // null = unknown, true = connected, false = failed
    const [apiError, setApiError] = useState('');

    // Smoothed detection positions for interpolation
    const smoothedBoxesRef = useRef<Map<number, { x: number, y: number, w: number, h: number }>>(new Map());

    const animationRef = useRef<number | undefined>(undefined);
    const boxRef = useRef({ x: 0, y: 0, w: 300, h: 400, targetX: 0, targetY: 0 });
    const inferenceIntervalRef = useRef<number | null>(null);
    const sendSizeRef = useRef({ w: 640, h: 480 });
    const lastDetectionTimeRef = useRef<number>(0); // For holdover logic
    const HOLDOVER_MS = 1500; // Keep detection visible for 1.5s after lost (prevents flickering)

    useEffect(() => {
        void setupCamera();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (cameraReady && isAIEnabled !== undefined) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            drawAI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cameraReady, isAIEnabled, isAnomaliMode]);

    // Setup inference loop (start/stop when toggling AI)
    useEffect(() => {
        if (cameraReady && isAIEnabled) {
            // start interval if not already
            if (!inferenceIntervalRef.current) {
                inferenceIntervalRef.current = window.setInterval(() => {
                    void analyzeFrame();
                }, 150); // Faster inference for responsive tracking
            }
        } else {
            if (inferenceIntervalRef.current) {
                clearInterval(inferenceIntervalRef.current);
                inferenceIntervalRef.current = null;
            }
            setDetections([]);
        }

        return () => {
            if (inferenceIntervalRef.current) {
                clearInterval(inferenceIntervalRef.current);
                inferenceIntervalRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cameraReady, isAIEnabled]);

    async function setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setCameraReady(true);
                    setError('');
                };
            }
        } catch (e) {
            setError('Camera Access Denied');
            console.error(e);
        }
    }

    // Capture a resized frame from the video element and return as a Blob
    async function captureFrameBlob(): Promise<Blob | null> {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return null;

        const sendW = sendSizeRef.current.w;
        const sendH = sendSizeRef.current.h;

        const off = document.createElement('canvas');
        off.width = sendW;
        off.height = sendH;
        const ctx = off.getContext('2d');
        if (!ctx) return null;

        // Draw mirrored video (video is mirrored via CSS scaleX), so draw normally
        ctx.drawImage(video, 0, 0, sendW, sendH);

        return await new Promise((resolve) => {
            off.toBlob((b) => resolve(b), 'image/jpeg', 0.75);
        });
    }

    // Send captured frame to backend API and update detections
    async function analyzeFrame() {
        // Only run in browser
        if (typeof window === 'undefined') return;
        if (isInferencing) return;

        setIsInferencing(true);
        try {
            const blob = await captureFrameBlob();
            if (!blob) return;

            const fd = new FormData();
            fd.append('file', blob, 'frame.jpg');

            const res = await fetch('http://localhost:8000/cv/analyze', {
                method: 'POST',
                body: fd,
                mode: 'cors'
            });

            if (!res.ok) {
                console.error('API error', res.status);
                setApiConnected(false);
                setApiError(`API Error: ${res.status}`);
                setDetections([]);
                return;
            }

            // API connected successfully
            setApiConnected(true);
            setApiError('');

            const data = await res.json();
            const analysis = data?.analysis;
            if (analysis && Array.isArray(analysis.detections) && analysis.detections.length > 0) {
                setDetections(analysis.detections);
                detectionsRef.current = analysis.detections; // Sync ref for drawAI
                lastDetectionTimeRef.current = Date.now(); // Track last detection time
                setConfidence(Math.round((analysis.detections[0]?.confidence || 0) * 100));

                // Update zone tracking info
                if (analysis.zone_info) {
                    setZoneInfo(analysis.zone_info);
                    setMovementCount(analysis.zone_info.movement_count || 0);
                    setFeedingTriggered(analysis.zone_info.feeding_triggered || false);
                }
            } else {
                // Holdover: only clear detections if enough time has passed
                const timeSinceLastDetection = Date.now() - lastDetectionTimeRef.current;
                if (timeSinceLastDetection > HOLDOVER_MS) {
                    setDetections([]);
                    detectionsRef.current = [];
                    setZoneInfo(null);
                    setConfidence(0);
                }
                // Otherwise keep previous detections visible
            }

        } catch (e) {
            console.error('Inference error', e);
            setApiConnected(false);
            setApiError('Backend tidak terhubung - jalankan: python -m uvicorn main:app --port 8000');
            setDetections([]);
            detectionsRef.current = []; // Clear ref on error
        } finally {
            setIsInferencing(false);
        }
    }

    function drawAI() {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video || !video.videoWidth) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // DEBUG: Log detection state - use ref for fresh data
        const currentDetections = detectionsRef.current;
        if (currentDetections.length > 0) {
            console.log(`[drawAI] Detections: ${currentDetections.length}, isAIEnabled: ${isAIEnabled}`, currentDetections);
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame as background of canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw zone divider lines (vertical lines at 33% and 66%)
        if (isAIEnabled) {
            const zone1X = canvas.width * 0.33;  // FEEDING | FENCE boundary
            const zone2X = canvas.width * 0.66;  // FENCE | KANDANG boundary

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);

            // Left boundary (FEEDING | FENCE)
            ctx.beginPath();
            ctx.moveTo(zone1X, 0);
            ctx.lineTo(zone1X, canvas.height);
            ctx.stroke();

            // Right boundary (FENCE | KANDANG)
            ctx.beginPath();
            ctx.moveTo(zone2X, 0);
            ctx.lineTo(zone2X, canvas.height);
            ctx.stroke();

            ctx.setLineDash([]);  // Reset to solid lines

            // Save context state
            ctx.save();

            // Flip context horizontally to counter the canvas mirror effect
            ctx.scale(-1, 1);

            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';

            // Zone labels with background boxes for better visibility
            // Note: Due to camera mirror, FEEDING (left in backend) appears on RIGHT of screen

            // KANDANG zone label (appears on LEFT of mirrored screen)
            const kandangCenterX = -((zone2X + canvas.width) / 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';  // Blue bg
            ctx.fillRect(kandangCenterX - 50, 10, 100, 28);
            ctx.fillStyle = '#3b82f6';
            ctx.fillText('🏠 KANDANG', kandangCenterX, 30);

            // FENCE zone label (CENTER)
            const fenceCenterX = -((zone1X + zone2X) / 2);
            ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';  // Yellow bg
            ctx.fillRect(fenceCenterX - 40, 10, 80, 28);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('⚠️ FENCE', fenceCenterX, 30);

            // FEEDING zone label (appears on RIGHT of mirrored screen)
            const feedingCenterX = -(zone1X / 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';  // Green bg
            ctx.fillRect(feedingCenterX - 50, 10, 100, 28);
            ctx.fillStyle = '#22c55e';
            ctx.fillText('🍽️ FEEDING', feedingCenterX, 30);

            // Restore context
            ctx.restore();
            ctx.textAlign = 'left';
        }

        // Check if we have detections to render - use ref for fresh data
        const hasDetections = isAIEnabled && Array.isArray(currentDetections) && currentDetections.length > 0;

        if (hasDetections) {
            // Scale detection coordinates (backend uses sent frame size)
            const sendW = sendSizeRef.current.w;
            const sendH = sendSizeRef.current.h;
            const scaleX = canvas.width / sendW;
            const scaleY = canvas.height / sendH;

            // Lerp factor for smooth interpolation (0.3 = 30% towards target each frame)
            const lerpFactor = 0.3;

            currentDetections.forEach((det, idx) => {
                const [x1, y1, x2, y2] = det.bbox;

                // YOLO detects whole body - focus on FACE area (not horns)
                const fullW = (x2 - x1) * scaleX;
                const fullH = (y2 - y1) * scaleY;

                // Head box: shifted DOWN to focus on FACE, not horns
                const headH = fullH * 0.45;
                const headW = Math.max(fullW * 0.85, headH * 1.1); // Slightly wider than tall
                const headX = x1 * scaleX + (fullW - headW) / 2; // Center horizontally
                const headY = y1 * scaleY + fullH * 0.15; // Shift DOWN 15% to avoid horns

                const targetX = headX;
                const targetY = headY;
                const targetW = headW;
                const targetH = headH;

                // Get or initialize smoothed position for this detection
                let smoothed = smoothedBoxesRef.current.get(idx);
                if (!smoothed) {
                    smoothed = { x: targetX, y: targetY, w: targetW, h: targetH };
                    smoothedBoxesRef.current.set(idx, smoothed);
                }

                // Apply linear interpolation for smooth transition
                smoothed.x += (targetX - smoothed.x) * lerpFactor;
                smoothed.y += (targetY - smoothed.y) * lerpFactor;
                smoothed.w += (targetW - smoothed.w) * lerpFactor;
                smoothed.h += (targetH - smoothed.h) * lerpFactor;

                const { x, y, w, h } = smoothed;

                const color = det.behavior === 'Lying Down' || isAnomaliMode ? '#ef4444' : '#22c55e';

                // Draw bracket-style bbox
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = color;
                const cornerSize = Math.min(40, Math.floor(Math.min(w, h) * 0.25));

                ctx.moveTo(x, y + cornerSize); ctx.lineTo(x, y); ctx.lineTo(x + cornerSize, y);
                ctx.moveTo(x + w - cornerSize, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cornerSize);
                ctx.moveTo(x + w, y + h - cornerSize); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - cornerSize, y + h);
                ctx.moveTo(x + cornerSize, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - cornerSize);
                ctx.stroke();

                // Label - flip context to fix mirrored text
                ctx.save();
                ctx.scale(-1, 1);

                const label = `${det.class}: ${Math.round(det.confidence * 100)}% - ${det.behavior}`;
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.85;
                ctx.fillRect(-x - Math.min(220, w + 10), y - 26, Math.min(220, w + 10), 24);
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px monospace';
                ctx.fillText(label, -x - Math.min(220, w + 10) + 8, y - 6);

                ctx.restore();
            });

            // Clean up old smoothed boxes if detections reduced
            if (smoothedBoxesRef.current.size > currentDetections.length) {
                for (let i = currentDetections.length; i < smoothedBoxesRef.current.size; i++) {
                    smoothedBoxesRef.current.delete(i);
                }
            }

            setFps(Math.round(1000 / 150)); // Updated for 150ms interval
        } else if (isAIEnabled) {
            // show overlay text when no detections
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Save and flip context to fix mirrored text
            ctx.save();
            ctx.scale(-1, 1);

            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(-centerX - 150, centerY - 40, 300, 80);

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️ NO GOAT DETECTED', -centerX, centerY - 10);

            ctx.fillStyle = '#9ca3af';
            ctx.font = '12px monospace';
            ctx.fillText('Point camera at goat/sheep', -centerX, centerY + 15);

            ctx.restore();
            ctx.textAlign = 'left';
            setFps(2);
            setConfidence(0);
        } else {
            // AI disabled: clear overlay (canvas already showing video)
        }

        animationRef.current = requestAnimationFrame(drawAI);
    }

    const wrapperClasses = `relative w-full overflow-hidden bg-black ${inModal ? '' : 'h-full rounded-[2rem] border border-white/50 shadow-xl'}`;

    return (
        <div className={wrapperClasses}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-30 bg-gray-900/80 backdrop-blur p-4 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold tracking-wider text-xs uppercase">AI Vision System</h3>
                        <p className="text-[10px] text-gray-400 font-mono">
                            {/* API Status Indicator */}
                            <span className={`inline-flex items-center gap-1 mr-2 ${apiConnected === null ? 'text-yellow-400' :
                                apiConnected ? 'text-green-400' : 'text-red-400'
                                }`}>
                                <span className={`inline-block w-2 h-2 rounded-full ${apiConnected === null ? 'bg-yellow-400 animate-pulse' :
                                    apiConnected ? 'bg-green-400' : 'bg-red-400 animate-pulse'
                                    }`} />
                                {apiConnected === null ? 'CONNECTING...' :
                                    apiConnected ? 'API: OK' : 'API: OFFLINE'}
                            </span>
                            | DETECTED: {detections.length}
                            {zoneInfo && (
                                <>
                                    {' | '}
                                    <span className={`font-bold ${zoneInfo.zone === 'FEEDING' ? 'text-green-400' :
                                        zoneInfo.zone === 'FENCE' ? 'text-yellow-400' :
                                            'text-blue-400'
                                        }`}>
                                        ZONE: {zoneInfo.zone}
                                    </span>
                                    {' | '}
                                    <span className={`font-bold ${movementCount >= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                                        }`}>
                                        MOVES: {movementCount}/10
                                    </span>
                                    {feedingTriggered && (
                                        <span className="ml-2 text-rose-500 font-bold animate-pulse">
                                            🔔 FEEDING!
                                        </span>
                                    )}
                                </>
                            )}
                        </p>
                        {/* Error Message */}
                        {apiError && (
                            <p className="text-[9px] text-red-400 font-mono mt-1 max-w-md truncate">
                                ⚠️ {apiError}
                            </p>
                        )}
                    </div>
                </div>
                {/* Expand Button (hidden when rendered inside modal) */}
                {!inModal && (
                    <div className="absolute top-3 right-3 z-40">
                        <button
                            onClick={() => setIsExpanded(true)}
                            title="Perbesar"
                            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6M9 21H3v-6M21 3l-6 6M3 21l6-6" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="font-mono text-emerald-400 text-xs flex gap-3">
                    <span>FPS: <span>{fps}</span></span>
                    <span>CONF: <span>{confidence}%</span></span>
                </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-black aspect-video group overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full transform scale-x-[-1] z-10"
                />

                {/* Scanlines Effect */}
                <div className="absolute inset-0 pointer-events-none z-20 opacity-30" style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.2))',
                    backgroundSize: '100% 4px'
                }} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-20" />

                {/* Loading / Error State */}
                {!cameraReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900 z-40">
                        {error ? (
                            <div className="text-rose-500 text-center">
                                <svg className="w-12 h-12 mx-auto mb-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-mono">{error}</p>
                            </div>
                        ) : (
                            <>
                                <svg className="w-12 h-12 mb-4 text-emerald-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-mono">INITIALIZING NEURAL ENGINE...</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-between items-center z-30 relative">
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAIEnabled(!isAIEnabled)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg ${isAIEnabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                            : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            {isAIEnabled ? (
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            ) : (
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            )}
                        </svg>
                        <span>AI Overlay: {isAIEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                    <button
                        onClick={() => setIsAnomaliMode(!isAnomaliMode)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-all"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        Sim. Anomali
                    </button>
                </div>
                <div className="text-xs text-gray-500 font-mono hidden md:block">
                    MODEL: GOAT_DETECTION_V2.pt
                </div>
            </div>
            {/* Modal for expanded view */}
            {!inModal && (
                <ExpansionModal open={isExpanded} onClose={() => setIsExpanded(false)} title="AI Vision System - Live Camera" noPadding>
                    {/* Render a larger instance inside modal but mark it as inModal to avoid nested expand button */}
                    <div className="w-full h-full">
                        <LiveCamera inModal />
                    </div>
                </ExpansionModal>
            )}
        </div>
    );
}

// Render modal wrapper at bottom so it doesn't get captured by the card layout above
function LiveCameraModalWrapper() {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            {/* placeholder - actual LiveCamera instances in dashboard control their own expanded state */}
        </>
    );
}
