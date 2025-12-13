/*
 * Smart Ngangon - ESP32 Smart Feeder Controller
 * 
 * Firmware for ESP32 to control:
 * - Servo motor for automatic feeding
 * - WiFi connectivity
 * - MQTT communication with backend
 * 
 * Hardware:
 * - ESP32 Dev Module
 * - Servo Motor (GPIO 13)
 * - LED Indicator (GPIO 2 - Built-in)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

// ==================== CONFIGURATION ====================
// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// MQTT Broker Settings - DigitalOcean VPS
const char* MQTT_SERVER = "129.212.234.195";
const int MQTT_PORT = 1883;
const char* MQTT_USER = "";
const char* MQTT_PASSWORD = "";

// Device Configuration
const char* DEVICE_ID = "esp32_feeder_001";
const char* KANDANG_ID = "kandang_001";

// Pin Definitions
#define SERVO_PIN 13
#define LED_PIN 2

// MQTT Topics
String TOPIC_FEED_CMD = "smartngangon/kandang/" + String(KANDANG_ID) + "/feed/command";
String TOPIC_FEED_STATUS = "smartngangon/kandang/" + String(KANDANG_ID) + "/feed/status";
String TOPIC_DEVICE_STATUS = "smartngangon/device/" + String(DEVICE_ID) + "/status";

// ==================== OBJECTS ====================
WiFiClient espClient;
PubSubClient mqtt(espClient);
Servo feederServo;

// ==================== VARIABLES ====================
bool isFeeding = false;
unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 30000; // 30 seconds

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=== Smart Ngangon ESP32 Feeder ===");
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  // Initialize servo
  feederServo.attach(SERVO_PIN);
  feederServo.write(0); // Closed position
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup MQTT
  mqtt.setServer(MQTT_SERVER, MQTT_PORT);
  mqtt.setCallback(mqttCallback);
  
  connectMQTT();
  
  Serial.println("Setup complete!");
  blinkLED(3, 200);
}

// ==================== MAIN LOOP ====================
void loop() {
  // Maintain connections
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }
  
  if (!mqtt.connected()) {
    connectMQTT();
  }
  
  mqtt.loop();
  
  // Send heartbeat
  if (millis() - lastHeartbeat > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeat = millis();
  }
}

// ==================== WIFI FUNCTIONS ====================
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println("\nWiFi Connection Failed!");
    digitalWrite(LED_PIN, LOW);
  }
}

// ==================== MQTT FUNCTIONS ====================
void connectMQTT() {
  Serial.print("Connecting to MQTT...");
  
  while (!mqtt.connected()) {
    String clientId = "ESP32-" + String(DEVICE_ID);
    
    if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("Connected!");
      
      // Subscribe to feed command topic
      mqtt.subscribe(TOPIC_FEED_CMD.c_str());
      Serial.print("Subscribed to: ");
      Serial.println(TOPIC_FEED_CMD);
      
      // Publish online status
      sendDeviceStatus("online");
      
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqtt.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  
  // Parse JSON payload
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  
  if (error) {
    Serial.print("JSON parse error: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Handle feed command
  if (String(topic) == TOPIC_FEED_CMD) {
    String action = doc["action"] | "";
    int duration = doc["duration"] | 3000; // Default 3 seconds
    
    if (action == "feed") {
      Serial.println("Feed command received!");
      triggerFeeding(duration);
    }
  }
}

// ==================== FEEDER FUNCTIONS ====================
void triggerFeeding(int duration) {
  if (isFeeding) {
    Serial.println("Already feeding, ignoring command");
    return;
  }
  
  isFeeding = true;
  Serial.println("Starting feeding sequence...");
  
  // Publish feeding started status
  publishFeedStatus("feeding", duration);
  
  // Open servo (90 degrees)
  feederServo.write(90);
  blinkLED(2, 100);
  
  // Wait for duration
  delay(duration);
  
  // Close servo (0 degrees)
  feederServo.write(0);
  
  // Publish feeding completed status
  publishFeedStatus("completed", duration);
  
  isFeeding = false;
  Serial.println("Feeding complete!");
}

void publishFeedStatus(String status, int duration) {
  StaticJsonDocument<128> doc;
  doc["status"] = status;
  doc["duration"] = duration;
  doc["device_id"] = DEVICE_ID;
  doc["timestamp"] = millis();
  
  char buffer[128];
  serializeJson(doc, buffer);
  
  mqtt.publish(TOPIC_FEED_STATUS.c_str(), buffer);
}

// ==================== UTILITY FUNCTIONS ====================
void sendHeartbeat() {
  sendDeviceStatus("online");
}

void sendDeviceStatus(String status) {
  StaticJsonDocument<128> doc;
  doc["status"] = status;
  doc["device_id"] = DEVICE_ID;
  doc["wifi_rssi"] = WiFi.RSSI();
  doc["uptime"] = millis() / 1000;
  
  char buffer[128];
  serializeJson(doc, buffer);
  
  mqtt.publish(TOPIC_DEVICE_STATUS.c_str(), buffer);
}

void blinkLED(int times, int delayMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(delayMs);
    digitalWrite(LED_PIN, LOW);
    delay(delayMs);
  }
}
