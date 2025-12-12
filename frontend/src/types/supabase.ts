export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'admin' | 'farmer' | 'investor'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'admin' | 'farmer' | 'investor'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'admin' | 'farmer' | 'investor'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            farms: {
                Row: {
                    id: string
                    name: string
                    location: string
                    latitude: number | null
                    longitude: number | null
                    capacity: number
                    owner_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    location: string
                    latitude?: number | null
                    longitude?: number | null
                    capacity?: number
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    location?: string
                    latitude?: number | null
                    longitude?: number | null
                    capacity?: number
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "farms_owner_id_fkey"
                        columns: ["owner_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            goats: {
                Row: {
                    id: string
                    rfid_tag: string
                    name: string
                    breed: string
                    birth_date: string | null
                    weight: number | null
                    status: 'Aman' | 'Perlu Cek' | 'Sakit'
                    health_score: number
                    temperature: number | null
                    heart_rate: number | null
                    last_vaccine_date: string | null
                    price: number | null
                    is_for_sale: boolean
                    image_url: string | null
                    description: string | null
                    farm_id: string | null
                    owner_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    rfid_tag: string
                    name: string
                    breed: string
                    birth_date?: string | null
                    weight?: number | null
                    status?: 'Aman' | 'Perlu Cek' | 'Sakit'
                    health_score?: number
                    temperature?: number | null
                    heart_rate?: number | null
                    last_vaccine_date?: string | null
                    price?: number | null
                    is_for_sale?: boolean
                    image_url?: string | null
                    description?: string | null
                    farm_id?: string | null
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    rfid_tag?: string
                    name?: string
                    breed?: string
                    birth_date?: string | null
                    weight?: number | null
                    status?: 'Aman' | 'Perlu Cek' | 'Sakit'
                    health_score?: number
                    temperature?: number | null
                    heart_rate?: number | null
                    last_vaccine_date?: string | null
                    price?: number | null
                    is_for_sale?: boolean
                    image_url?: string | null
                    description?: string | null
                    farm_id?: string | null
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "goats_farm_id_fkey"
                        columns: ["farm_id"]
                        referencedRelation: "farms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "goats_owner_id_fkey"
                        columns: ["owner_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            sensor_logs: {
                Row: {
                    id: string
                    goat_id: string | null
                    sensor_type: 'temperature' | 'heart_rate' | 'movement' | 'location'
                    value: number
                    timestamp: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    goat_id?: string | null
                    sensor_type: 'temperature' | 'heart_rate' | 'movement' | 'location'
                    value: number
                    timestamp?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    goat_id?: string | null
                    sensor_type?: 'temperature' | 'heart_rate' | 'movement' | 'location'
                    value?: number
                    timestamp?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "sensor_logs_goat_id_fkey"
                        columns: ["goat_id"]
                        referencedRelation: "goats"
                        referencedColumns: ["id"]
                    }
                ]
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string | null
                    goat_id: string | null
                    amount: number
                    status: 'pending' | 'completed' | 'failed' | 'refunded'
                    transaction_type: 'buy' | 'sell' | 'maintenance'
                    payment_method: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    goat_id?: string | null
                    amount: number
                    status?: 'pending' | 'completed' | 'failed' | 'refunded'
                    transaction_type: 'buy' | 'sell' | 'maintenance'
                    payment_method?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    goat_id?: string | null
                    amount?: number
                    status?: 'pending' | 'completed' | 'failed' | 'refunded'
                    transaction_type?: 'buy' | 'sell' | 'maintenance'
                    payment_method?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transactions_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_goat_id_fkey"
                        columns: ["goat_id"]
                        referencedRelation: "goats"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
