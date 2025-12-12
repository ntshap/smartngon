import time
import json
import random
import os
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BROKER = os.getenv("MQTT_BROKER", "localhost")
PORT = int(os.getenv("MQTT_PORT", 1883))
USERNAME = os.getenv("MQTT_USERNAME", "")
PASSWORD = os.getenv("MQTT_PASSWORD", "")

# Use a demo device ID that matches what the frontend might expect or generic
DEVICE_ID = "demo-device-001"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"✅ Connected to MQTT Broker as {DEVICE_ID}")
        print("   Waiting for commands...")
        
        # Subscribe to commands for this specific device
        topic_specific = f"smartngangon/device/{DEVICE_ID}/command/#"
        client.subscribe(topic_specific)
        
        # Subscribe to 'all' devices commands (broadcasts)
        topic_all = "smartngangon/device/all/command/#"
        client.subscribe(topic_all)
        
        print(f"   Subscribed to: {topic_specific}")
        print(f"   Subscribed to: {topic_all}")
    else:
        print(f"❌ Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    topic = msg.topic
    payload = msg.payload.decode()
    print(f"\n📩 Received command on {topic}")
    
    try:
        data = json.loads(payload)
        action = data.get("action")
        
        if action == "scan_wifi":
            simulate_wifi_scan(client)
        elif action == "connect_wifi":
            simulate_wifi_connect(client, data)
        else:
            print(f"   Unknown action: {action}")
            
    except json.JSONDecodeError:
        print("   ❌ Invalid JSON received")

import subprocess
import re

def get_real_windows_wifi():
    """Scans for real WiFi networks on Windows using netsh"""
    networks = []
    try:
        # Run netsh command
        output = subprocess.check_output(['netsh', 'wlan', 'show', 'networks', 'mode=Bssid'], shell=True).decode('utf-8', errors='ignore')
        
        # Parse output
        current_ssid = None
        current_auth = None
        
        lines = output.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith("SSID"):
                parts = line.split(":", 1)
                if len(parts) > 1:
                    current_ssid = parts[1].strip()
            elif line.startswith("Authentication"):
                parts = line.split(":", 1)
                if len(parts) > 1:
                    current_auth = parts[1].strip()
            elif line.startswith("Signal"):
                parts = line.split(":", 1)
                if len(parts) > 1 and current_ssid:
                    try:
                        signal_percent = int(parts[1].strip().replace("%", ""))
                        # Convert percent to rough RSSI
                        rssi = (signal_percent / 2) - 100
                        
                        # Add network if we have an SSID
                        if current_ssid:
                            networks.append({
                                "ssid": current_ssid,
                                "rssi": int(rssi),
                                "auth_mode": current_auth or "Unknown"
                            })
                            current_ssid = None # Reset for next network
                    except ValueError:
                        pass
                        
    except Exception as e:
        print(f"   ⚠️ Error scanning WiFi: {e}")
        # Fallback to mock data if scan fails
        return []
        
    # Deduplicate by SSID (keep strongest signal)
    unique_networks = {}
    for net in networks:
        ssid = net['ssid']
        if ssid not in unique_networks or net['rssi'] > unique_networks[ssid]['rssi']:
            unique_networks[ssid] = net
            
    return list(unique_networks.values())

def simulate_wifi_scan(client):
    print("   📡 Scanning for REAL WiFi networks (Windows)...")
    
    # Try to get real networks
    networks = get_real_windows_wifi()
    
    # If no real networks found (or error), fall back to simulation
    if not networks:
        print("   ⚠️ No real networks found, using simulation data.")
        time.sleep(1.5)
        base_networks = [
            {"ssid": "SmartNgangon_Farm", "auth_mode": "WPA2"},
            {"ssid": "Guest_Network", "auth_mode": "Open"},
            {"ssid": "Admin_Office", "auth_mode": "WPA2"},
            {"ssid": "Sensor_Net_01", "auth_mode": "WPA2"},
            {"ssid": "Warung_Kopi", "auth_mode": "WPA2"},
        ]
        networks = []
        for net in base_networks:
            net["rssi"] = random.randint(-90, -40)
            networks.append(net)
    
    # Sort by signal strength
    networks.sort(key=lambda x: x["rssi"], reverse=True)
    
    result_topic = f"smartngangon/device/{DEVICE_ID}/wifi/scan_results"
    
    payload = {
        "device_id": DEVICE_ID,
        "networks": networks,
        "timestamp": time.time()
    }
    
    client.publish(result_topic, json.dumps(payload))
    print(f"   📤 Published {len(networks)} networks to {result_topic}")

def simulate_wifi_connect(client, data):
    ssid = data.get("ssid")
    password = data.get("password")
    print(f"   🔐 Connecting to '{ssid}' with password '{password}'...")
    
    time.sleep(2) # Simulate connection delay
    
    # Simulate success
    print(f"   ✅ Successfully connected to {ssid}")
    
    # Publish status update
    status_topic = f"smartngangon/device/{DEVICE_ID}/status"
    client.publish(status_topic, json.dumps({
        "status": "online", 
        "wifi_ssid": ssid,
        "ip_address": "192.168.1.105"
    }))

def main():
    print("🤖 Smart Ngangon Device Simulator")
    print("=================================")
    
    client = mqtt.Client(client_id=f"simulator-{DEVICE_ID}")
    
    if USERNAME and PASSWORD:
        client.username_pw_set(USERNAME, PASSWORD)
        
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        print(f"Connecting to {BROKER}:{PORT}...")
        client.connect(BROKER, PORT, 60)
        client.loop_forever()
    except KeyboardInterrupt:
        print("\nStopping simulator...")
        client.disconnect()
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
