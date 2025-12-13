-- =====================================================
-- SMART NGANGON ADMIN CMS - Database Migration
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. SITE CONTENT (Teks & Pengaturan Website)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'text', -- text, html, image, json
    category VARCHAR(50) DEFAULT 'general',
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "site_content_public_read" ON site_content
    FOR SELECT USING (true);

-- Authenticated users with admin role can write
CREATE POLICY "site_content_admin_write" ON site_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default content
INSERT INTO site_content (key, value, type, category, description) VALUES
    ('hero_title', 'Beli kambing dengan percaya diri, pantau dari mana saja.', 'text', 'hero', 'Judul utama di hero section'),
    ('hero_subtitle', 'Smart Ngangon menggabungkan kamera bertenaga AI dan sensor IoT sehingga Anda bisa membeli kambing secara online dan mengawasi kesehatan, pergerakan, serta kenyamanan mereka 24/7 langsung dari ponsel Anda.', 'text', 'hero', 'Sub-judul di hero section'),
    ('hero_cta_primary', 'Jelajahi kambing siap jual', 'text', 'hero', 'Tombol CTA utama'),
    ('hero_cta_secondary', 'Tonton cara kerjanya', 'text', 'hero', 'Tombol CTA sekunder'),
    ('hero_trust_text', 'Dipercaya peternak, investor, dan pemilik ternak cerdas di seluruh wilayah', 'text', 'hero', 'Teks trust di bawah CTA'),
    ('cta_title', 'Siap memulai peternakan cerdas?', 'text', 'cta', 'Judul section CTA'),
    ('cta_subtitle', 'Bergabung dengan ratusan peternak modern yang sudah menggunakan Smart Ngangon', 'text', 'cta', 'Sub-judul section CTA'),
    ('footer_copyright', '© 2025 Smart Ngangon. All rights reserved.', 'text', 'footer', 'Copyright text')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 2. TESTIMONIALS
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    role VARCHAR(100),
    content TEXT NOT NULL,
    avatar_url TEXT,
    badge_label VARCHAR(50),
    badge_icon VARCHAR(30) DEFAULT 'star',
    badge_color VARCHAR(20) DEFAULT 'lime', -- lime, sky, slate
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read active testimonials
CREATE POLICY "testimonials_public_read" ON testimonials
    FOR SELECT USING (is_active = true);

-- Admin can do everything
CREATE POLICY "testimonials_admin_all" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default testimonials
INSERT INTO testimonials (name, location, role, content, badge_label, badge_icon, badge_color, display_order) VALUES
    ('Rudi', 'Bandung', 'Investor kambing', 'Sebelum Smart Ngangon, saya tidak tahu kondisi kambing saya di antara kunjungan. Sekarang saya cek HP setiap pagi dan melihat skor kesehatan serta video langsung dalam hitungan detik.', 'Monitoring 24/7', 'star', 'lime', 1),
    ('Sari', 'Yogyakarta', 'Peternak mitra', 'AI memberi tahu saya ketika satu kambing diam tidak seperti biasanya. Kami menanganinya dengan cepat dan menghindari penyakit parah. Rasanya seperti punya dokter hewan yang mengawasi kandang.', 'Deteksi dini', 'activity', 'sky', 2),
    ('Andi', 'Surabaya', 'Pemilik modern', 'Saya sering bepergian untuk kerja, tapi saya masih bisa melihat kambing bersama anak-anak dari hotel. Dashboard-nya bersih, cepat, dan sangat menenangkan.', 'Aplikasi di mana saja', 'smartphone', 'slate', 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. FAQs
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public can read active FAQs
CREATE POLICY "faqs_public_read" ON faqs
    FOR SELECT USING (is_active = true);

-- Admin can do everything
CREATE POLICY "faqs_admin_all" ON faqs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
    ('Bagaimana cara kerja monitoring AI?', 'Kamera kami menggunakan model AI terlatih yang menganalisis perilaku kambing secara real-time. Sistem dapat mendeteksi tanda-tanda sakit, stress, atau perilaku tidak normal dan langsung mengirim notifikasi ke ponsel Anda.', 'teknologi', 1),
    ('Apakah saya perlu koneksi internet di kandang?', 'Ya, diperlukan koneksi internet stabil untuk streaming video dan pengiriman data sensor. Kami merekomendasikan minimal 10 Mbps untuk pengalaman optimal.', 'teknis', 2),
    ('Berapa lama garansi perangkat IoT?', 'Semua perangkat IoT kami memiliki garansi 1 tahun dari tanggal pembelian, mencakup kerusakan manufaktur dan dukungan teknis gratis.', 'layanan', 3),
    ('Bagaimana proses pembelian kambing?', 'Pilih kambing dari marketplace, tambahkan ke keranjang, dan checkout via WhatsApp. Tim kami akan menghubungi Anda untuk konfirmasi dan pengaturan pengiriman.', 'pembelian', 4),
    ('Apakah bisa dikunjungi ke kandang?', 'Tentu! Kami menyambut kunjungan dengan perjanjian minimal H-1. Anda bisa melihat langsung fasilitas dan kambing yang akan dibeli.', 'layanan', 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. PRICING PLANS
-- =====================================================
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2),
    period VARCHAR(50) DEFAULT 'bulan',
    description TEXT,
    features JSONB DEFAULT '[]',
    highlight_feature VARCHAR(255),
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Public can read active plans
CREATE POLICY "pricing_plans_public_read" ON pricing_plans
    FOR SELECT USING (is_active = true);

-- Admin can do everything
CREATE POLICY "pricing_plans_admin_all" ON pricing_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default pricing plans
INSERT INTO pricing_plans (name, price, period, description, features, highlight_feature, is_popular, display_order) VALUES
    ('Starter', 0, 'gratis', 'Untuk pemilik pemula', '["Akses dashboard dasar", "1 kamera monitoring", "Notifikasi email", "Support via email"]', 'Gratis selamanya', false, 1),
    ('Pro', 150000, 'bulan', 'Untuk peternak serius', '["Semua fitur Starter", "Unlimited kamera", "AI health detection", "Notifikasi WhatsApp", "Priority support", "Export laporan"]', 'Paling populer', true, 2),
    ('Enterprise', 500000, 'bulan', 'Untuk peternakan skala besar', '["Semua fitur Pro", "Custom integrations", "Dedicated account manager", "SLA 99.9%", "Training on-site", "API access"]', 'Custom solutions', false, 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. UPDATE PROFILES TABLE (Add admin role)
-- =====================================================
-- Check if role column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user';
    END IF;
END $$;

-- =====================================================
-- 6. CREATE ADMIN USER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION set_user_as_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET role = 'admin'
    WHERE id = (
        SELECT id FROM auth.users WHERE email = user_email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. HELPER FUNCTION: Update timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON pricing_plans;
CREATE TRIGGER update_pricing_plans_updated_at
    BEFORE UPDATE ON pricing_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- DONE! 
-- To set a user as admin, run:
-- SELECT set_user_as_admin('admin@smartngangon.com');
-- =====================================================
