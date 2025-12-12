'use client';

import dynamic from 'next/dynamic';

interface LiveCameraProps {
    inModal?: boolean;
}

// Dynamically import LiveCamera to reduce initial bundle size and compile time
const DynamicLiveCamera = dynamic<LiveCameraProps>(
    () => import('@/components/live-camera').then(mod => ({ default: mod.default })),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-slate-800 rounded-xl">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-300">Loading Camera...</p>
                </div>
            </div>
        )
    }
);

export default function LiveCameraWrapper({ inModal }: LiveCameraProps) {
    return <DynamicLiveCamera inModal={inModal} />;
}
