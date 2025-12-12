# Product Requirements Document (PRD)
# Smart Ngangon - Platform Peternakan Kambing Cerdas

## 1. Ringkasan Produk

**Smart Ngangon** adalah platform web berbasis AI dan IoT untuk manajemen peternakan kambing modern. Platform ini memungkinkan pemilik untuk memantau, mengontrol, dan mengelola ternak mereka dari mana saja.

## 2. Target Pengguna

- **Peternak Individual**: Pemilik kandang skala kecil-menengah
- **Pembeli Kambing**: Konsumen yang ingin membeli kambing secara online
- **Admin**: Pengelola sistem yang mengatur akun dan transaksi

## 3. Fitur Utama

### 3.1 Marketplace
- Katalog kambing dengan foto, spesifikasi, dan harga
- Sistem keranjang belanja
- Checkout via WhatsApp

### 3.2 Dashboard Pemantauan
- Live video streaming dari kandang
- Peta zonal lokasi kambing
- Log aktivitas dan kesehatan

### 3.3 AI & Otomatisasi
- Deteksi anomali perilaku (Computer Vision)
- Kontrol pakan otomatis dan manual
- Notifikasi real-time

## 4. Teknologi

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI**: YOLOv8
- **IoT**: ESP32, MQTT

## 5. Metrik Keberhasilan

- Akurasi deteksi AI > 90%
- Response time < 2 detik
- Uptime sistem > 99%
