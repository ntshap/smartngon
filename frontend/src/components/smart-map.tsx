'use client';

import dynamic from 'next/dynamic';

import type { Goat as SupabaseGoat } from '@/lib/supabase-queries';

interface Goat extends SupabaseGoat {
    last_location_name?: string;
}

interface SmartMapProps {
    goats?: Goat[];
    inModal?: boolean;
}

// Dynamically import the map to avoid SSR issues with Leaflet
const DynamicSmartMap = dynamic<SmartMapProps>(
    () => import('@/components/smart-map-component'),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-300">Loading Map...</p>
                </div>
            </div>
        )
    }
);

export default function SmartMap({ goats, inModal }: SmartMapProps) {
    return <DynamicSmartMap goats={goats} inModal={inModal} />;
}
