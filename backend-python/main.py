"""
Smart Ngangon Backend API
FastAPI server for IoT and CV services
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from services.mqtt_service import mqtt_service
from services.supabase_service import supabase_service
from services.rtsp_service import rtsp_service
from routers import cv, iot


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("Starting Smart Ngangon Backend...")
    
    # Connect MQTT
    try:
        mqtt_service.connect()
        logger.info("MQTT service connected")
    except Exception as e:
        logger.error(f"Failed to connect MQTT: {e}")
    
    # Start RTSP stream
    try:
        rtsp_service.start()
        logger.info("RTSP service started")
    except Exception as e:
        logger.error(f"Failed to start RTSP: {e}")
    
    # Register MQTT handlers
    mqtt_service.register_handler("smartngangon/+/feed/status", iot.handle_feed_status)
    mqtt_service.register_handler("smartngangon/+/device/status", iot.handle_device_status)
    
    yield
    
    # Shutdown
    logger.info("Shutting down Smart Ngangon Backend...")
    mqtt_service.disconnect()
    rtsp_service.stop()


app = FastAPI(
    title="Smart Ngangon API",
    description="Backend API for Smart Goat Farm Management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cv.router, prefix="/api/cv", tags=["Computer Vision"])
app.include_router(iot.router, prefix="/api/iot", tags=["IoT"])


@app.get("/")
async def root():
    return {
        "message": "Smart Ngangon API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mqtt_connected": mqtt_service.connected,
        "rtsp_running": rtsp_service.is_running
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
