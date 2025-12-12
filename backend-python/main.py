import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Import services
from services.mqtt_service import mqtt_service
from services.supabase_service import supabase_service

# MQTT Message Handlers
async def handle_temperature_data(topic: str, data: dict):
    """Handle temperature sensor data from MQTT"""
    try:
        goat_id = data.get("goat_id")
        temperature = data.get("temperature")
        humidity = data.get("humidity")
        
        if goat_id and temperature:
            await supabase_service.insert_sensor_log(goat_id, "temperature", temperature, "°C")
            logger.info(f"Saved temperature data for goat {goat_id}: {temperature}°C")
        
        if goat_id and humidity:
            await supabase_service.insert_sensor_log(goat_id, "humidity", humidity, "%")
    
    except Exception as e:
        logger.error(f"Error handling temperature data: {e}")

async def handle_location_data(topic: str, data: dict):
    """Handle GPS location data from MQTT"""
    try:
        goat_id = data.get("goat_id")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        location_name = data.get("location_name")
        
        if goat_id and latitude and longitude:
            await supabase_service.update_goat_location(goat_id, latitude, longitude, location_name)
            logger.info(f"Updated location for goat {goat_id}")
    
    except Exception as e:
        logger.error(f"Error handling location data: {e}")

async def handle_rfid_data(topic: str, data: dict):
    """Handle RFID scan events from MQTT"""
    try:
        kandang_id = data.get("kandang_id")
        rfid_tag = data.get("rfid_tag")
        
        if kandang_id and rfid_tag:
            await supabase_service.insert_ai_event(
                None,  # goat_id to be resolved
                "rfid_scan",
                1.0,
                {"kandang_id": kandang_id, "rfid_tag": rfid_tag}
            )
            logger.info(f"RFID scan logged: {rfid_tag} at {kandang_id}")
    
    except Exception as e:
        logger.error(f"Error handling RFID data: {e}")

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Smart Ngangon API...")
    
    try:
        # Connect to MQTT broker
        mqtt_service.connect()
        
        # Register MQTT handlers
        mqtt_service.register_handler("smartngangon/goat/+/temperature", handle_temperature_data)
        mqtt_service.register_handler("smartngangon/goat/+/location", handle_location_data)
        mqtt_service.register_handler("smartngangon/kandang/+/rfid", handle_rfid_data)
        mqtt_service.register_handler("smartngangon/device/+/wifi/scan_results", mqtt_service.handle_wifi_scan_results)
        
        logger.info("MQTT service initialized successfully")
    
    except Exception as e:
        logger.error(f"Failed to initialize MQTT service: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Smart Ngangon API...")
    try:
        mqtt_service.disconnect()
        logger.info("MQTT service disconnected")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

app = FastAPI(
    title="Smart Ngangon API",
    description="Backend for IoT and Computer Vision services",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:3000",  # Frontend
    "http://localhost:3001",
    "*"  # Allow all for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from routers import cv, iot

app.include_router(cv.router)
app.include_router(iot.router)

@app.get("/")
async def root():
    return {
        "message": "Smart Ngangon API is running",
        "status": "online",
        "mqtt_connected": mqtt_service.connected
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mqtt_connected": mqtt_service.connected
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
