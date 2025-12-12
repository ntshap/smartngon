import { supabase } from '@/utils/supabase/client';

// Types
export interface Goat {
    id: string;
    rfid_tag: string;
    name: string;
    breed: string;
    birth_date: string;
    weight: number;
    status: 'Aman' | 'Perlu Cek' | 'Sakit';
    health_score: number;
    temperature: number;
    heart_rate: number;
    last_vaccine_date: string;
    price: number;
    is_for_sale: boolean;
    image_url: string;
    description: string;
    farm_id: string;
    owner_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Farm {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    capacity: number;
    owner_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface SensorLog {
    id: string;
    goat_id: string;
    sensor_type: 'temperature' | 'heart_rate' | 'movement' | 'location';
    value: number;
    timestamp: string;
    created_at: string;
}

// ===================================
// GOATS
// ===================================

export async function getGoats() {
    const { data, error } = await supabase
        .from('goats')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching goats:', error);
        return [];
    }

    return data as Goat[];
}

// Sample/Mock data for marketplace (when database is empty)
const SAMPLE_GOATS: Goat[] = [
    {
        id: '00000000-0000-0001-0000-000000000001',
        rfid_tag: 'RFID-001-ETW',
        name: 'Bella',
        breed: 'Etawa',
        birth_date: '2022-03-15',
        weight: 45,
        status: 'Aman',
        health_score: 95,
        temperature: 38.5,
        heart_rate: 85,
        last_vaccine_date: '2024-10-01',
        price: 8500000,
        is_for_sale: true,
        image_url: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=2070&auto=format&fit=crop',
        description: 'Kambing Etawa betina produktif dengan produksi susu tinggi. Sehat dan terrawat dengan monitoring IoT 24/7.',
        farm_id: '00000000-0000-0000-0000-000000000000',
        owner_id: null,
        created_at: '2024-11-01T10:00:00Z',
        updated_at: '2024-11-22T03:00:00Z'
    },
    {
        id: '00000000-0000-0001-0000-000000000002',
        rfid_tag: 'RFID-002-SAN',
        name: 'Snowball',
        breed: 'Saanen',
        birth_date: '2021-08-20',
        weight: 52,
        status: 'Aman',
        health_score: 92,
        temperature: 38.2,
        heart_rate: 78,
        last_vaccine_date: '2024-09-15',
        price: 9200000,
        is_for_sale: true,
        image_url: 'https://images.unsplash.com/photo-1553531087-5ca0fe165b8e?q=80&w=2069&auto=format&fit=crop',
        description: 'Kambing Saanen jantan berkualitas unggul. Genetik import dengan sertifikat kesehatan lengkap.',
        farm_id: '00000000-0000-0000-0000-000000000000',
        owner_id: null,
        created_at: '2024-11-02T10:00:00Z',
        updated_at: '2024-11-22T03:00:00Z'
    },
    {
        id: '00000000-0000-0001-0000-000000000003',
        rfid_tag: 'RFID-003-BOR',
        name: 'Rocky',
        breed: 'Boer',
        birth_date: '2022-01-10',
        weight: 62,
        status: 'Aman',
        health_score: 98,
        temperature: 38.8,
        heart_rate: 82,
        last_vaccine_date: '2024-10-20',
        price: 11500000,
        is_for_sale: true,
        image_url: 'https://images.unsplash.com/photo-1596440496748-fbb51cb95c19?q=80&w=2070&auto=format&fit=crop',
        description: 'Kambing Boer jantan premium untuk breeding. Postur sempurna dan pertumbuhan cepat.',
        farm_id: '00000000-0000-0000-0000-000000000000',
        owner_id: null,
        created_at: '2024-11-03T10:00:00Z',
        updated_at: '2024-11-22T03:00:00Z'
    },
    {
        id: '00000000-0000-0001-0000-000000000004',
        rfid_tag: 'RFID-004-JAW',
        name: 'Dewi',
        breed: 'Jawa Randu',
        birth_date: '2022-06-05',
        weight: 38,
        status: 'Aman',
        health_score: 88,
        temperature: 38.4,
        heart_rate: 88,
        last_vaccine_date: '2024-11-05',
        price: 6500000,
        is_for_sale: true,
        image_url: 'https://images.unsplash.com/photo-1580690832243-edc31cd79d4e?q=80&w=2069&auto=format&fit=crop',
        description: 'Kambing Jawa Randu adaptif dan tahan penyakit. Cocok untuk pemula dengan budget terbatas.',
        farm_id: '00000000-0000-0000-0000-000000000000',
        owner_id: null,
        created_at: '2024-11-04T10:00:00Z',
        updated_at: '2024-11-22T03:00:00Z'
    },
    {
        id: '00000000-0000-0001-0000-000000000005',
        rfid_tag: 'RFID-005-ETW',
        name: 'Sultan',
        breed: 'Etawa',
        birth_date: '2021-12-01',
        weight: 58,
        status: 'Perlu Cek',
        health_score: 75,
        temperature: 39.2,
        heart_rate: 92,
        last_vaccine_date: '2024-08-10',
        price: 7200000,
        is_for_sale: true,
        image_url: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?q=80&w=2070&auto=format&fit=crop',
        description: 'Kambing Etawa jantan dewasa. Saat ini dalam monitoring intensif IoT. Harga spesial.',
        farm_id: '00000000-0000-0000-0000-000000000000',
        owner_id: null,
        created_at: '2024-11-05T10:00:00Z',
        updated_at: '2024-11-22T03:00:00Z'
    },
    {
        id: '00000000-0000-0001-0000-000000000006',
        rfid_tag: 'RFID-006-KAC',
        name: 'Luna',
        breed: 'Kacang',
        birth_date: '2023-02-14',
        weight: 25,
        status: 'Aman',
        health_score: 90,
        temperature: 38.3,
        heart_rate: 80,
        last_vaccine_date: '2024-11-01',
        price: 3500000,
        is_for_sale: true,
        image_url: 'https://images.unsplash.com/photo-1583523032111-ae85d55fff16?q=80&w=2069&auto=format&fit=crop',
        description: 'Kambing Kacang betina muda. Ukuran kompak, perawatan mudah, cocok untuk lahan kecil.',
        farm_id: '00000000-0000-0000-0000-000000000000',
        owner_id: null,
        created_at: '2024-11-06T10:00:00Z',
        updated_at: '2024-11-22T03:00:00Z'
    }
];

export async function getGoatsForSale() {
    const { data, error } = await supabase
        .from('goats')
        .select('*')
        .eq('is_for_sale', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching goats for sale:', error);
        // Return sample data if there's an error
        return SAMPLE_GOATS;
    }

    // If database is empty or returns no results, use sample data
    if (!data || data.length === 0) {
        console.log('Database empty, returning sample marketplace data');
        return SAMPLE_GOATS;
    }

    return data as Goat[];
}

export async function getGoatById(id: string) {
    const { data, error } = await supabase
        .from('goats')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching goat:', error);
        return null;
    }

    return data as Goat;
}

export async function getMyGoats(userId: string) {
    const { data, error } = await supabase
        .from('goats')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my goats:', error);
        return [];
    }

    return data as Goat[];
}

// ===================================
// FARMS
// ===================================

export async function getFarms() {
    const { data, error } = await supabase
        .from('farms')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching farms:', error);
        return [];
    }

    return data as Farm[];
}

export async function getFarmById(id: string) {
    const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching farm:', error);
        return null;
    }

    return data as Farm;
}

// ===================================
// SENSOR LOGS
// ===================================

export async function getSensorLogs(goatId: string, limit: number = 24) {
    const { data, error } = await supabase
        .from('sensor_logs')
        .select('*')
        .eq('goat_id', goatId)
        .order('timestamp', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching sensor logs:', error);
        return [];
    }

    return data as SensorLog[];
}

export async function getSensorLogsByType(
    goatId: string,
    sensorType: 'temperature' | 'heart_rate' | 'movement' | 'location',
    limit: number = 24
) {
    const { data, error } = await supabase
        .from('sensor_logs')
        .select('*')
        .eq('goat_id', goatId)
        .eq('sensor_type', sensorType)
        .order('timestamp', { ascending: false })
        .limit(limit);

    // If error or empty data, and it's a mock ID (starts with 00000000), return mock logs
    if (error || !data || data.length === 0) {
        if (goatId.startsWith('00000000-')) {
            console.log('Generating mock sensor logs for:', goatId);
            const mockLogs: SensorLog[] = [];
            const now = new Date();

            for (let i = 0; i < limit; i++) {
                const time = new Date(now.getTime() - i * 1000 * 60 * 5); // Every 5 mins
                let value = 0;

                if (sensorType === 'temperature') {
                    value = 38 + Math.random() * 1.5; // 38.0 - 39.5
                } else if (sensorType === 'heart_rate') {
                    value = 70 + Math.random() * 30; // 70 - 100
                } else if (sensorType === 'movement') {
                    value = Math.random() * 10;
                }

                mockLogs.push({
                    id: `mock-log-${i}`,
                    goat_id: goatId,
                    sensor_type: sensorType,
                    value: parseFloat(value.toFixed(2)),
                    timestamp: time.toISOString(),
                    created_at: time.toISOString()
                });
            }
            return mockLogs;
        }

        if (error) {
            console.error('Error fetching sensor logs by type:', error);
            return [];
        }
    }

    return data as SensorLog[];
}

// ===================================
// REAL-TIME SUBSCRIPTIONS
// ===================================

export function subscribeToGoatUpdates(
    goatId: string,
    callback: (payload: any) => void
) {
    const channel = supabase
        .channel(`goat-${goatId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'goats',
                filter: `id=eq.${goatId}`
            },
            callback
        )
        .subscribe();

    return channel;
}

export function subscribeToSensorLogs(
    goatId: string,
    callback: (payload: any) => void
) {
    const channel = supabase
        .channel(`sensor-logs-${goatId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'sensor_logs',
                filter: `goat_id=eq.${goatId}`
            },
            callback
        )
        .subscribe();

    return channel;
}

export async function createGoat(goat: any) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User must be logged in to create a goat");
    }

    const goatWithUser = {
        ...goat,
        owner_id: user.id
    };

    const { data, error } = await supabase
        .from('goats')
        .insert([goatWithUser])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Goat;
}

export async function updateGoat(id: string, updates: Partial<Goat>) {
    const { data, error } = await supabase
        .from('goats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Goat;
}

// ===================================
// TRANSACTIONS
// ===================================

export async function buyGoat(goatId: string, price: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Anda harus login untuk membeli kambing.");
    }

    // 1. Create Transaction Record
    const { data: transaction, error: transError } = await supabase
        .from('transactions')
        .insert([
            {
                user_id: user.id,
                goat_id: goatId,
                amount: price,
                status: 'completed', // Auto-complete for demo simplicity
                transaction_type: 'buy',
                payment_method: 'balance', // Mock payment
                notes: 'Pembelian via Marketplace'
            }
        ])
        .select()
        .single();

    if (transError) {
        console.error('Transaction failed:', transError);
        throw new Error("Gagal memproses transaksi.");
    }

    // 2. Update Goat Status
    const { error: goatError } = await supabase
        .from('goats')
        .update({
            is_for_sale: false,
            owner_id: user.id,
            status: 'Aman' // Reset status if needed
        })
        .eq('id', goatId);

    if (goatError) {
        console.error('Failed to update goat ownership:', goatError);
        // In a real app, we should rollback the transaction here
        throw new Error("Gagal mengupdate kepemilikan kambing.");
    }

    return transaction;
}
