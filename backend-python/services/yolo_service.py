"""
YOLO Service - Using Roboflow Inference SDK with Pre-trained Detection Model
Fallback to Microsoft Florence-2 or standard object detection
"""
import cv2
import numpy as np
import logging
import os
import base64
import requests
from datetime import datetime
from collections import deque
from inference_sdk import InferenceHTTPClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Roboflow Configuration
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")
ROBOFLOW_WORKSPACE = "smartngon"
ROBOFLOW_WORKFLOW = "find-sheep-heads"

# Pre-trained detection model for sheep/goat - using a public model
# You can replace with your own trained model: "workspace/project/version"
DETECTION_MODEL = "sheep-detection-zxr7b/1"  # Public sheep detection model

# Initialize Roboflow client
roboflow_client = None
if ROBOFLOW_API_KEY:
    try:
        roboflow_client = InferenceHTTPClient(
            api_url="https://detect.roboflow.com",  # Use detect API for object detection
            api_key=ROBOFLOW_API_KEY
        )
        logger.info(f"✅ Roboflow SDK initialized with detection endpoint")
    except Exception as e:
        logger.error(f"Failed to initialize Roboflow client: {e}")
else:
    logger.warning("⚠️ ROBOFLOW_API_KEY not set in environment variables!")


# Movement tracking state
class MovementTracker:
    def __init__(self, max_history=30):
        self.head_positions = deque(maxlen=max_history)
        self.movement_count = 0
        self.last_zone = None
        self.feeding_triggered = False
        self.last_reset_time = datetime.now()
    
    def calculate_zone(self, x_center, frame_width):
        """Calculate which zone the head is in based on x position"""
        x_ratio = x_center / frame_width
        if x_ratio < 0.33:
            return "FEEDING"
        elif x_ratio < 0.66:
            return "FENCE"
        else:
            return "KANDANG"
    
    def update(self, bbox, frame_width, frame_height):
        """Update movement tracking based on new detection"""
        x1, y1, x2, y2 = bbox
        x_center = (x1 + x2) / 2
        y_center = (y1 + y2) / 2
        
        self.head_positions.append((x_center, y_center))
        
        # Calculate current zone
        current_zone = self.calculate_zone(x_center, frame_width)
        
        # Detect zone change = movement
        if self.last_zone and self.last_zone != current_zone:
            self.movement_count += 1
            logger.info(f"🔄 Zone changed: {self.last_zone} -> {current_zone}, moves: {self.movement_count}")
        
        # If in FEEDING zone with significant movement, also count
        if current_zone == "FEEDING" and len(self.head_positions) >= 5:
            recent_positions = list(self.head_positions)[-5:]
            x_movement = max(p[0] for p in recent_positions) - min(p[0] for p in recent_positions)
            if x_movement > frame_width * 0.05:  # 5% of frame width
                self.movement_count += 1
        
        self.last_zone = current_zone
        
        # Trigger feeding after 10 movements
        should_feed = False
        if self.movement_count >= 10 and not self.feeding_triggered:
            should_feed = True
            self.feeding_triggered = True
            logger.info("🍽️ FEEDING TRIGGERED!")
        
        # Reset after 5 minutes
        if (datetime.now() - self.last_reset_time).seconds > 300:
            self.reset()
        
        return {
            "zone": current_zone,
            "movement_count": self.movement_count,
            "should_feed": should_feed,
            "feeding_triggered": self.feeding_triggered,
            "x_center": x_center,
            "y_center": y_center
        }
    
    def reset(self):
        self.head_positions.clear()
        self.movement_count = 0
        self.last_zone = None
        self.feeding_triggered = False
        self.last_reset_time = datetime.now()


# Global movement tracker instance
movement_tracker = MovementTracker()


def call_roboflow_detection(image_base64: str):
    """
    Call Roboflow Detection API with base64 image
    Uses object detection model (not workflow/SAM)
    """
    if not roboflow_client:
        logger.error("Roboflow client not initialized")
        return {"error": "Client not initialized"}
    
    try:
        logger.info("Calling Roboflow Detection API...")
        
        # Try using SDK infer method for standard detection
        result = roboflow_client.infer(image_base64, model_id=DETECTION_MODEL)
        
        logger.info(f"Roboflow detection response received")
        return result
        
    except Exception as e:
        logger.error(f"Roboflow detection error: {e}")
        
        # Fallback: Try direct API call
        try:
            logger.info("Trying direct API call fallback...")
            url = f"https://detect.roboflow.com/{DETECTION_MODEL}"
            params = {"api_key": ROBOFLOW_API_KEY}
            
            response = requests.post(
                url,
                params=params,
                data=image_base64,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Direct API response: {len(result.get('predictions', []))} predictions")
                return result
            else:
                logger.error(f"Direct API error: {response.status_code} - {response.text}")
                return {"error": response.text}
                
        except Exception as e2:
            logger.error(f"Fallback API error: {e2}")
            return {"error": str(e2)}


def parse_detection_response(response, frame_width: int, frame_height: int) -> list:
    """
    Parse Roboflow detection response into detection format
    Standard detection format: {"predictions": [{"x", "y", "width", "height", "class", "confidence"}]}
    """
    detections = []
    
    if "error" in response:
        return detections
    
    # Get predictions
    predictions = response.get("predictions", [])
    
    logger.info(f"Roboflow returned {len(predictions)} predictions")
    
    for pred in predictions:
        try:
            # Standard Roboflow detection format
            x_center = pred.get("x", 0)
            y_center = pred.get("y", 0)
            width = pred.get("width", 0)
            height = pred.get("height", 0)
            confidence = pred.get("confidence", 0)
            class_name = pred.get("class", "animal")
            
            # Convert to bbox format [x1, y1, x2, y2]
            x1 = x_center - width / 2
            y1 = y_center - height / 2
            x2 = x_center + width / 2
            y2 = y_center + height / 2
            
            # Filter low confidence
            if confidence < 0.25:
                continue
            
            # Normalize class name
            display_class = "Kambing"
            if "sheep" in class_name.lower() or "goat" in class_name.lower():
                display_class = "Kambing"
            elif "head" in class_name.lower():
                display_class = "Kambing"
            else:
                display_class = class_name.title()
            
            detections.append({
                "class": display_class,
                "confidence": confidence,
                "bbox": [x1, y1, x2, y2],
                "behavior": "Normal"
            })
            
            logger.info(f"Detection: {display_class} ({confidence:.2f}) at [{x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}]")
            
        except Exception as e:
            logger.error(f"Error parsing prediction: {e}")
            continue
    
    return detections


def analyze_image(image_bytes: bytes):
    """
    Analyze image using Roboflow Detection API
    Returns detected animals and zone tracking info
    """
    try:
        # Decode image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            logger.error("Failed to decode image")
            return {"error": "Failed to decode image"}
        
        frame_height, frame_width = img.shape[:2]
        logger.info(f"Image decoded: shape=({frame_height}, {frame_width}, 3)")
        
        # Encode image to base64
        _, buffer = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 85])
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Call Roboflow detection
        response = call_roboflow_detection(image_base64)
        
        # Parse detections
        detections = parse_detection_response(response, frame_width, frame_height)
        
        # Update zone tracking if we have detections
        zone_info = None
        should_trigger_feeding = False
        
        if detections:
            # Use first detection for zone tracking
            bbox = detections[0]["bbox"]
            zone_info = movement_tracker.update(
                bbox,
                frame_width,
                frame_height
            )
            should_trigger_feeding = zone_info["should_feed"]
            logger.info(f"✅ Zone tracking: zone={zone_info['zone']}, moves={zone_info['movement_count']}, trigger={should_trigger_feeding}")
        else:
            logger.info("No valid detections - skipping zone tracking")
        
        logger.info(f"Detected {len(detections)} sheep/goat heads")
        
        return {
            "detections": detections,
            "count": len(detections),
            "zone_info": zone_info,
            "should_trigger_feeding": should_trigger_feeding,
            "frame_size": {"width": frame_width, "height": frame_height}
        }
        
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
