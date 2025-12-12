# Smart Ngangon - Python Backend

Backend API menggunakan FastAPI untuk mengelola IoT dan Computer Vision services.

## Setup

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Jalankan server
python main.py
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root info |
| `/health` | GET | Health check |
| `/api/cv/detect` | POST | Run YOLO detection |
| `/api/iot/feed` | POST | Trigger feeding |

## Services

- **MQTT Service**: Komunikasi dengan ESP32
- **RTSP Service**: Streaming dari IP Camera
- **YOLO Service**: Deteksi kambing
- **Supabase Service**: Database operations
