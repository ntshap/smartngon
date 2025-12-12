# ESP32 Smart Feeder Firmware

Kode firmware untuk ESP32 yang mengontrol sistem pakan otomatis Smart Ngangon.

## Hardware Requirements

- ESP32 Dev Module
- Servo Motor (SG90 atau MG996R)
- Power Supply 5V 2A

## Pin Configuration

| Component | GPIO Pin |
|-----------|----------|
| Servo Motor | GPIO 13 |
| LED Indicator | GPIO 2 (Built-in) |

## Setup

1. Install Arduino IDE dan ESP32 Board Manager
2. Install libraries:
   - `PubSubClient` (MQTT)
   - `ESP32Servo`
   - `ArduinoJson`
3. Edit konfigurasi WiFi dan MQTT di file `.ino`
4. Upload ke ESP32

## MQTT Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `smartngangon/kandang/{id}/feed/command` | Subscribe | Terima perintah pakan |
| `smartngangon/kandang/{id}/feed/status` | Publish | Kirim status feeding |
| `smartngangon/device/{id}/status` | Publish | Heartbeat device |

## Command Format

```json
{
  "action": "feed",
  "duration": 3000
}
```
