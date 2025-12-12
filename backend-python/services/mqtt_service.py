"""
MQTT Service for IoT device communication
Handles connection to MQTT broker and message routing
"""
import os
import json
import logging
from typing import Callable, Dict
import paho.mqtt.client as mqtt
from datetime import datetime

logger = logging.getLogger(__name__)

class MQTTService:
    def __init__(self):
        # Default to HiveMQ public broker (same as ESP32 firmware)
        self.broker = os.getenv("MQTT_BROKER", "broker.hivemq.com")
        self.port = int(os.getenv("MQTT_PORT", "1883"))
        self.username = os.getenv("MQTT_USERNAME", "")
        self.password = os.getenv("MQTT_PASSWORD", "")
        self.client_id = os.getenv("MQTT_CLIENT_ID", "smartngangon-backend")
        
        self.client = mqtt.Client(client_id=self.client_id)
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        
        # Message handlers registry
        self.handlers: Dict[str, Callable] = {}
        
        # Set credentials if provided
        if self.username and self.password:
            self.client.username_pw_set(self.username, self.password)
        
        self.connected = False
        self.wifi_networks = [] # Store latest scan results
    
    def connect(self):
        """Connect to MQTT broker"""
        try:
            logger.info(f"Connecting to MQTT broker at {self.broker}:{self.port}")
            self.client.connect(self.broker, self.port, keepalive=60)
            self.client.loop_start()
            logger.info("MQTT client loop started")
        except Exception as e:
            logger.error(f"Failed to connect to MQTT broker: {e}")
            raise
    
    def disconnect(self):
        """Disconnect from MQTT broker"""
        self.client.loop_stop()
        self.client.disconnect()
        logger.info("Disconnected from MQTT broker")
    
    def _on_connect(self, client, userdata, flags, rc):
        """Callback when connected to broker"""
        if rc == 0:
            self.connected = True
            logger.info("Successfully connected to MQTT broker")
            
            # Subscribe to all sensor topics
            self.subscribe("smartngangon/goat/+/temperature")
            self.subscribe("smartngangon/goat/+/location")
            self.subscribe("smartngangon/goat/+/status")
            self.subscribe("smartngangon/goat/+/status")
            self.subscribe("smartngangon/kandang/+/rfid")
            self.subscribe("smartngangon/device/+/wifi/scan_results")
        else:
            logger.error(f"Failed to connect to MQTT broker. Return code: {rc}")
    
    def _on_disconnect(self, client, userdata, rc):
        """Callback when disconnected from broker"""
        self.connected = False
        if rc != 0:
            logger.warning(f"Unexpected disconnection from MQTT broker. Return code: {rc}")
            # Auto-reconnect for unexpected disconnections
            try:
                logger.info("Attempting to reconnect to MQTT broker...")
                self.client.reconnect()
            except Exception as e:
                logger.error(f"Failed to reconnect: {e}")
        else:
            logger.info("Disconnected from MQTT broker")
    
    def _on_message(self, client, userdata, msg):
        """Callback when message received"""
        try:
            topic = msg.topic
            payload = msg.payload.decode('utf-8')
            
            logger.info(f"Received message on topic '{topic}': {payload}")
            
            # Parse JSON payload
            try:
                data = json.loads(payload)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON payload: {payload}")
                return
            
            # Route to appropriate handler
            for pattern, handler in self.handlers.items():
                if self._topic_matches(pattern, topic):
                    handler(topic, data)
                    break
        
        except Exception as e:
            logger.error(f"Error processing message: {e}")
    
    def _topic_matches(self, pattern: str, topic: str) -> bool:
        """Check if topic matches pattern (supports + wildcard)"""
        pattern_parts = pattern.split('/')
        topic_parts = topic.split('/')
        
        if len(pattern_parts) != len(topic_parts):
            return False
        
        for p, t in zip(pattern_parts, topic_parts):
            if p != '+' and p != t:
                return False
        
        return True
    
    def subscribe(self, topic: str, qos: int = 0):
        """Subscribe to a topic"""
        self.client.subscribe(topic, qos)
        logger.info(f"Subscribed to topic: {topic}")
    
    def publish(self, topic: str, payload: dict, qos: int = 0):
        """Publish message to a topic"""
        if not self.connected:
            logger.error(f"Cannot publish to {topic} - MQTT not connected")
            return False
        
        try:
            payload_str = json.dumps(payload)
            result = self.client.publish(topic, payload_str, qos)
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"✅ Published to {topic}: {payload_str}")
                return True
            else:
                logger.error(f"❌ Failed to publish to {topic}, rc={result.rc}")
                return False
        
        except Exception as e:
            logger.error(f"❌ Error publishing message: {e}")
            return False
    
    def register_handler(self, topic_pattern: str, handler: Callable):
        """Register a handler for a topic pattern"""
        self.handlers[topic_pattern] = handler
        logger.info(f"Registered handler for topic pattern: {topic_pattern}")
    
    def send_feed_command(self, goat_id: str, duration_ms: int = 3000):
        """Send feed command to ESP32"""
        topic = f"smartngangon/goat/{goat_id}/command/feed"
        payload = {
            "action": "feed",
            "duration_ms": duration_ms,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        # Diagnostic logging
        logger.info(f"🔔 MANUAL FEED REQUEST - goat_id: {goat_id}")
        logger.info(f"📡 MQTT broker: {self.broker}:{self.port}")
        logger.info(f"📡 MQTT connected: {self.connected}")
        logger.info(f"📡 Topic: {topic}")
        logger.info(f"📡 Payload: {payload}")
        
        result = self.publish(topic, payload, qos=1)
        
        if result:
            logger.info(f"✅ MQTT publish SUCCESS - command sent to ESP32")
        else:
            logger.error(f"❌ MQTT publish FAILED - ESP32 did not receive command")
    
    def send_config_command(self, goat_id: str, config: dict):
        """Send configuration command to ESP32"""
        topic = f"smartngangon/goat/{goat_id}/command/config"
        payload = {
            "action": "config",
            "config": config,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        self.publish(topic, payload, qos=1)

    def send_wifi_scan_command(self, device_id: str = "all"):
        """Send WiFi scan command to ESP32"""
        topic = f"smartngangon/device/{device_id}/command/wifi_scan"
        payload = {
            "action": "scan_wifi",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        self.publish(topic, payload, qos=1)
        
        # For demo purposes, if we don't have a real device, populate with mock data after a delay
        # In production, this would be handled by _on_message receiving the actual results
        if device_id == "demo":
            self.wifi_networks = [
                {"ssid": "SmartNgangon_Farm", "rssi": -50, "auth_mode": "WPA2"},
                {"ssid": "Guest_Network", "rssi": -75, "auth_mode": "Open"},
                {"ssid": "Admin_Office", "rssi": -60, "auth_mode": "WPA2"},
                {"ssid": "Sensor_Net_01", "rssi": -85, "auth_mode": "WPA2"},
            ]

    def send_wifi_connect_command(self, ssid: str, password: str, device_id: str = "all"):
        """Send WiFi connect command to ESP32"""
        topic = f"smartngangon/device/{device_id}/command/wifi_connect"
        payload = {
            "action": "connect_wifi",
            "ssid": ssid,
            "password": password,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        self.publish(topic, payload, qos=1)

    def handle_wifi_scan_results(self, topic: str, data: dict):
        """Handle received WiFi scan results"""
        if "networks" in data:
            self.wifi_networks = data["networks"]
            logger.info(f"Updated WiFi networks list: {len(self.wifi_networks)} networks found")


# Global MQTT service instance
mqtt_service = MQTTService()
