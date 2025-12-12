# **Daftar Fitur Lengkap - Smart Ngangon**

Berikut adalah rincian semua fitur yang akan dibangun, dibagi berdasarkan area platform.

## **1. Fitur Publik (Landing Page & Marketplace)**

Fitur yang dapat diakses oleh semua pengunjung.

* **Landing Page:** Halaman informasi utama yang menjelaskan layanan Smart Ngangon (termasuk fitur AI/CV, Peta, dll.).  
* **Marketplace (Katalog Kambing):** Galeri untuk melihat semua kambing yang tersedia untuk dibeli.  
* **Pencarian & Filter:** Kemampuan untuk memfilter dan mengurutkan kambing (berdasarkan harga, umur, jenis).  
* **Keranjang Belanja:** Fungsionalitas untuk menambahkan beberapa kambing ke keranjang.  
* **Checkout via WhatsApp:** Alur pemesanan di mana ringkasan keranjang diformat menjadi *template* pesan dan dikirim ke nomor WhatsApp Admin.

## **2. Fitur Dashboard Pemilik**

Fitur eksklusif yang hanya dapat diakses oleh pemilik yang sudah login (setelah membeli kambing dan dibuatkan akun oleh Admin).

### **A. Autentikasi & Navigasi Dasar**

* **Halaman Login:** Gerbang masuk untuk pemilik.  
* **Dashboard Utama (/dashboard):** Halaman ringkasan yang menampilkan semua kambing milik pengguna dalam bentuk GoatGrid.  
* **Halaman Detail Kambing (/dashboard/goat/[id]):** Halaman "ruang kontrol" untuk satu kambing spesifik.  
* **Navigasi Global:** Sidebar dan Header untuk navigasi antar halaman.

### **B. Fitur Pemantauan (Monitoring) - (Nilai Jual Utama)**

* **Pemantauan Video Live (LiveFeedPlayer):** Widget untuk melihat *streaming* video langsung dari kamera di kandang.  
* **Peta Lokasi Zonal (CheckpointMap):** Visualisasi tata letak kandang (bukan GPS) yang menunjukkan lokasi terakhir kambing berdasarkan *checkpoint* RFID (misal: "Area Pakan", "Area Kandang").  
* **Log Aktivitas & Kesehatan (ActivityLog):** *Timeline* histori semua *event* untuk satu kambing (misal: "10:01 - Terlihat di 'Area Pakan'", "10:03 - Deteksi Anomali").

### **C. Fitur Notifikasi & AI (Alerts)**

* **Deteksi Anomali CV (AI):** Fitur sistem utama di mana packages/cv/ mendeteksi perilaku abnormal (misal: diam terlalu lama, isolasi).  
* **Ringkasan Notifikasi (NotificationSummary):** Widget *live* di dashboard utama yang memberi tahu jika ada *alert* AI/CV baru yang belum dibaca.  
* **Halaman Histori Notifikasi:** Halaman khusus (/dashboard/notifications) untuk melihat semua riwayat notifikasi (dari AI dan Sistem).

### **D. Fitur Kontrol (Controls)**

* **Kontrol Pakan Manual (ManualControls):** Tombol di halaman detail kambing untuk memberi pakan secara manual di luar jadwal.  
* **Otomatisasi Pakan Terjadwal:** Fitur *backend* di mana sistem memberi pakan secara otomatis (misal: jam 08:00 & 16:00).

### **E. Fitur Informasi**

* **Biodata Kambing (GoatBiodata):** Widget yang menampilkan data statis kambing (Jenis, Umur, Berat, Tanggal Beli).

## **3. Fitur Sistem & Admin (Backend & IoT)**

Fitur-fitur "di balik layar" yang membuat sistem berjalan.

* **Panel Admin (Sederhana):** Antarmuka *backend* (non-publik) bagi admin untuk membuat akun login baru bagi pemilik dan mengaitkan kambing yang dibeli.  
* **Integrasi MQTT:** Sistem *backend* (packages/api/) yang "mendengarkan" data dari perangkat IoT (RFID & CV) dan "menerbitkan" perintah (Pakan Manual).  
* **Integrasi WebSockets:** Sistem *backend* yang mengirim *update live* (notifikasi baru, lokasi baru) ke *frontend* (dashboard) secara *real-time*.  
* **Manajemen WiFi (ESP32):** Fungsionalitas pada perangkat keras (ESP32) untuk terhubung ke WiFi kandang.
