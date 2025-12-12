import os
import time
import json
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

load_dotenv()

BROKER = os.getenv("MQTT_BROKER", "broker.hivemq.com")
PORT = int(os.getenv("MQTT_PORT", 1883))
TOPIC = "smartngangon/goat/test-goat/command/feed"

print(f"Connecting to {BROKER}:{PORT}...")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully!")
        payload = {
            "action": "feed",
            "duration_ms": 3000
        }
        client.publish(TOPIC, json.dumps(payload))
        print(f"Sent message to {TOPIC}: {payload}")
        print("Check your ESP32 Serial Monitor now!")
    else:
        print(f"Connection failed with code {rc}")
    client.disconnect()

client = mqtt.Client(client_id="test_script")
client.on_connect = on_connect
client.connect(BROKER, PORT, 60)
client.loop_forever()
