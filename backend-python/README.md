# Smart Ngangon - Python Backend

This is the backend service for Smart Ngangon, handling:
1. **Computer Vision**: YOLOv8 inference for goat detection and behavior analysis.
2. **IoT Gateway**: MQTT/HTTP ingestion for ESP32 sensor data.

## Setup

1. Install Python 3.10+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in credentials.
4. Run server:
   ```bash
   python main.py
   ```

## Features
- **FastAPI**: High-performance API framework.
- **YOLOv8**: State-of-the-art object detection.
- **MQTT**: Real-time IoT data ingestion.
