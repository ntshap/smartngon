import cv2
import time
import logging
import os
import threading
from services.yolo_service import analyze_image

logger = logging.getLogger(__name__)

class RTSPService:
    """
    RTSP Camera Service - Captures frames from IP camera and analyzes with YOLO
    """
    def __init__(self):
        self.rtsp_url = os.getenv("RTSP_URL", "")
        self.enabled = os.getenv("RTSP_ENABLED", "false").lower() == "true"
        self.running = False
        self.thread = None
        self.last_frame = None
        self.last_result = None
        self.frame_interval = int(os.getenv("RTSP_INTERVAL", "2"))
        self.mqtt_service = None
        
    def set_mqtt_service(self, mqtt_service):
        """Set MQTT service reference for sending commands"""
        self.mqtt_service = mqtt_service
        
    def start(self):
        """Start RTSP capture and analysis"""
        if not self.enabled:
            logger.warning("RTSP service disabled (set RTSP_ENABLED=true to enable)")
            return
            
        if not self.rtsp_url:
            logger.warning("RTSP service: no URL configured (set RTSP_URL)")
            return
            
        self.running = True
        self.thread = threading.Thread(target=self._capture_loop, daemon=True)
        self.thread.start()
        logger.info(f"RTSP service started with {self.frame_interval}s interval")
        logger.info(f"RTSP URL: {self.rtsp_url[:30]}...")
        
    def stop(self):
        """Stop RTSP capture"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        logger.info("RTSP service stopped")
        
    def _capture_loop(self):
        """Main capture loop - runs in background thread"""
        reconnect_delay = 5
        
        while self.running:
            try:
                logger.info("Connecting to RTSP stream...")
                cap = cv2.VideoCapture(self.rtsp_url)
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                
                if not cap.isOpened():
                    logger.error("Failed to open RTSP stream")
                    time.sleep(reconnect_delay)
                    continue
                    
                logger.info("RTSP stream connected!")
                
                while self.running and cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        logger.warning("Failed to read frame, reconnecting...")
                        break
                    
                    # Encode frame to JPEG
                    encode_params = [cv2.IMWRITE_JPEG_QUALITY, 80]
                    _, buffer = cv2.imencode('.jpg', frame, encode_params)
                    self.last_frame = buffer.tobytes()
                    
                    # Analyze with YOLO
                    result = analyze_image(self.last_frame)
                    self.last_result = result
                    
                    # Check if should trigger feeding
                    if result.get("should_trigger_feeding"):
                        logger.warning("🔔 Auto-feeding triggered by CV!")
                        self._trigger_feeding()
                    
                    # Log detection summary
                    count = result.get("count", 0)
                    zone_info = result.get("zone_info") or {}
                    zone = zone_info.get("zone", "UNKNOWN")
                    moves = zone_info.get("movement_count", 0)
                    logger.info(f"CV Analysis: {count} goats, zone={zone}, moves={moves}/10")
                    
                    # Wait before next frame
                    time.sleep(self.frame_interval)
                    
                cap.release()
                
            except Exception as e:
                logger.error(f"RTSP error: {e}")
                time.sleep(reconnect_delay)
                
    def _trigger_feeding(self):
        """Send MQTT command to trigger feeding"""
        if self.mqtt_service:
            try:
                self.mqtt_service.publish_feed_command(
                    goat_id="auto-cv",
                    duration_ms=3000
                )
                logger.info("Feed command sent via MQTT")
            except Exception as e:
                logger.error(f"Failed to send feed command: {e}")
        else:
            logger.warning("MQTT service not available, cannot trigger feeding")
                
    def get_latest_frame(self):
        """Get the most recent captured frame as JPEG bytes"""
        return self.last_frame
        
    def get_latest_result(self):
        """Get the most recent analysis result"""
        return self.last_result
        
    def get_status(self):
        """Get service status"""
        return {
            "enabled": self.enabled,
            "running": self.running,
            "rtsp_url": self.rtsp_url[:30] + "..." if self.rtsp_url else None,
            "interval_seconds": self.frame_interval,
            "has_frame": self.last_frame is not None
        }

# Global instance
rtsp_service = RTSPService()
