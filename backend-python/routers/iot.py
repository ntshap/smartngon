from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import logging

from services.mqtt_service import mqtt_service
from services.supabase_service import supabase_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/iot", tags=["IoT"])

# Request Models
class SensorData(BaseModel):
    goat_id: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    heart_rate: Optional[int] = None
    battery: Optional[int] = None

class LocationData(BaseModel):
    goat_id: str
    latitude: float
    longitude: float
    location_name: Optional[str] = None

class RFIDEvent(BaseModel):
    kandang_id: str
    rfid_tag: str
    event_type: str = "feed_access"

class FeedCommand(BaseModel):
    duration_ms: int = 3000
    amount_kg: Optional[float] = None

class ScheduleCreate(BaseModel):
    farm_id: str
    time: str
    amount_kg: Optional[float] = 0.5

class ScheduleUpdate(BaseModel):
    time: Optional[str] = None
    amount_kg: Optional[float] = None
    is_active: Optional[bool] = None

# Endpoints
@router.post("/sensor/temperature")
async def receive_temperature(data: SensorData, background_tasks: BackgroundTasks):
    """Receive temperature sensor data from ESP32"""
    try:
        if data.temperature is not None:
            # Save to database
            background_tasks.add_task(
                supabase_service.insert_sensor_log,
                data.goat_id,
                "temperature",
                data.temperature,
                "°C"
            )
        
        if data.humidity is not None:
            background_tasks.add_task(
                supabase_service.insert_sensor_log,
                data.goat_id,
                "humidity",
                data.humidity,
                "%"
            )
        
        # Check for abnormal temperature
        if data.temperature and (data.temperature < 37.5 or data.temperature > 40.0):
            background_tasks.add_task(
                supabase_service.update_goat_status,
                data.goat_id,
                "Perlu Cek"
            )
            
            # Log AI event for abnormal temperature
            background_tasks.add_task(
                supabase_service.insert_ai_event,
                data.goat_id,
                "temperature_anomaly",
                1.0,
                {"temperature": data.temperature, "threshold": "37.5-40.0"}
            )
        
        return {"status": "success", "message": "Temperature data received"}
    
    except Exception as e:
        logger.error(f"Error processing temperature data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/location")
async def update_location(data: LocationData, background_tasks: BackgroundTasks):
    """Update goat GPS location"""
    try:
        background_tasks.add_task(
            supabase_service.update_goat_location,
            data.goat_id,
            data.latitude,
            data.longitude,
            data.location_name
        )
        
        return {"status": "success", "message": "Location updated"}
    
    except Exception as e:
        logger.error(f"Error updating location: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rfid")
async def handle_rfid_event(data: RFIDEvent, background_tasks: BackgroundTasks):
    """Handle RFID tag detection"""
    try:
        # Find goat by RFID tag
        # Note: You'll need to add rfid_tag field to goats table
        # For now, we'll just log the event
        
        background_tasks.add_task(
            supabase_service.insert_ai_event,
            None,  # goat_id will be resolved later
            "rfid_scan",
            1.0,
            {
                "kandang_id": data.kandang_id,
                "rfid_tag": data.rfid_tag,
                "event_type": data.event_type
            }
        )
        
        return {"status": "success", "message": "RFID event logged", "rfid_tag": data.rfid_tag}
    
    except Exception as e:
        logger.error(f"Error handling RFID event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feed/{goat_id}")
async def trigger_feed(goat_id: str, command: FeedCommand, background_tasks: BackgroundTasks):
    """Trigger feeding for a specific goat"""
    try:
        # Send MQTT command to ESP32
        mqtt_service.send_feed_command(goat_id, command.duration_ms)
        
        # Log feeding event
        background_tasks.add_task(
            supabase_service.insert_feeding_log,
            goat_id,
            command.amount_kg,
            "manual",
            f"Manual feed trigger via API, duration: {command.duration_ms}ms"
        )
        
        return {
            "status": "success",
            "message": f"Feed command sent to goat {goat_id}",
            "duration_ms": command.duration_ms
        }
    
    except Exception as e:
        logger.error(f"Error triggering feed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sensor/{goat_id}/latest")
async def get_latest_sensors(goat_id: str, limit: int = 10):
    """Get latest sensor readings for a goat"""
    try:
        logs = await supabase_service.get_latest_sensor_logs(goat_id, limit)
        return {"status": "success", "data": logs}
    
    except Exception as e:
        logger.error(f"Error fetching sensor data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feeding/{goat_id}/logs")
async def get_feeding_history(goat_id: str, limit: int = 20):
    """Get feeding history for a goat"""
    try:
        logs = await supabase_service.get_feeding_logs(goat_id, limit)
        return {"status": "success", "data": logs}
    
    except Exception as e:
        logger.error(f"Error fetching feeding logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schedules/{farm_id}")
async def get_schedules(farm_id: str):
    """Get feeding schedules for a farm"""
    try:
        schedules = await supabase_service.get_feeding_schedules(farm_id)
        return {"status": "success", "data": schedules}
    
    except Exception as e:
        logger.error(f"Error fetching schedules: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedules")
async def create_schedule(schedule: ScheduleCreate):
    """Create a new feeding schedule"""
    try:
        result = await supabase_service.insert_feeding_schedule(
            schedule.farm_id,
            schedule.time,
            schedule.amount_kg
        )
        return {"status": "success", "data": result}
    
    except Exception as e:
        logger.error(f"Error creating schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/schedules/{schedule_id}")
async def update_schedule(schedule_id: str, schedule: ScheduleUpdate):
    """Update a feeding schedule"""
    try:
        result = await supabase_service.update_feeding_schedule(
            schedule_id,
            schedule.time,
            schedule.amount_kg,
            schedule.is_active
        )
        return {"status": "success", "data": result}
    
    except Exception as e:
        logger.error(f"Error updating schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/schedules/{schedule_id}")
async def delete_schedule(schedule_id: str):
    """Delete a feeding schedule"""
    try:
        result = await supabase_service.delete_feeding_schedule(schedule_id)
        return {"status": "success", "message": "Schedule deleted"}
    
    except Exception as e:
        logger.error(f"Error deleting schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/wifi/scan")
async def scan_wifi(device_id: str = "all"):
    """Trigger WiFi scan on ESP32"""
    try:
        mqtt_service.send_wifi_scan_command(device_id)
        return {"status": "success", "message": "WiFi scan command sent"}
    except Exception as e:
        logger.error(f"Error sending scan command: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wifi/networks")
async def get_wifi_networks():
    """Get latest WiFi scan results"""
    return {"status": "success", "data": mqtt_service.wifi_networks}

@router.post("/wifi/connect")
async def connect_wifi(ssid: str, password: str, device_id: str = "all"):
    """Send WiFi credentials to ESP32"""
    try:
        mqtt_service.send_wifi_connect_command(ssid, password, device_id)
        return {"status": "success", "message": f"Connecting to {ssid}..."}
    except Exception as e:
        logger.error(f"Error sending connect command: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def iot_health_check():
    """Check IoT service health"""
    return {
        "status": "healthy",
        "mqtt_connected": mqtt_service.connected,
        "timestamp": datetime.utcnow().isoformat()
    }
