from fastapi import APIRouter, UploadFile, File, HTTPException
from services.yolo_service import analyze_image
# Use the SHARED mqtt_service instance (already connected in main.py)
from services.mqtt_service import mqtt_service
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cv", tags=["Computer Vision"])

@router.post("/analyze")
async def analyze_frame(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    results = analyze_image(contents)
    
    # Check if feeding should be triggered
    if results.get("should_trigger_feeding", False):
        logger.warning("🔔 FEEDING TRIGGER ACTIVATED - Sending MQTT command to servo")
        
        if mqtt_service and mqtt_service.connected:
            # Publish feeding command to servo topic
            # Topic MUST match ESP32 subscription: smartngangon/goat/+/command/feed
            payload = {
                "action": "feed",
                "duration_ms": 3000,
                "timestamp": str(datetime.now()),
                "reason": "head_movement_detected"
            }
            # Use goat/1/command/feed to match ESP32 wildcard subscription
            success = mqtt_service.publish("smartngangon/goat/1/command/feed", payload)
            if success:
                logger.info("✅ MQTT feeding command sent successfully to servo")
            else:
                logger.error("❌ MQTT publish failed - servo did not receive command")
        else:
            logger.warning(f"❌ MQTT not connected (connected={mqtt_service.connected if mqtt_service else 'None'}) - cannot trigger feeding")
    
    return {
        "filename": file.filename,
        "analysis": results
    }
