# roboflow_service.py
# Roboflow Serverless API integration for Smart Ngangon
# Replaces local YOLO model with cloud-based inference

import os
import base64
import logging
import cv2
import numpy as np
from datetime import datetime
from collections import deque
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
WORKSPACE_NAME = "smartngon"
WORKFLOW_ID = "find-sheep-heads"
API_URL = "https://detect.roboflow.com"

# Initialize Roboflow client
client = None
try:
    from inference_sdk import InferenceHTTPClient
    
    if ROBOFLOW_API_KEY:
        client = InferenceHTTPClient(
            api_url=API_URL,
            api_key=ROBOFLOW_API_KEY,
        )
        logger.info(f"✅ Roboflow client initialized (workspace: {WORKSPACE_NAME}, workflow: {WORKFLOW_ID})")
    else:
        logger.error("❌ ROBOFLOW_API_KEY not found in environment!")
except ImportError:
    logger.error("❌ inference-sdk not installed! Run: pip install inference-sdk")


# ============================================================
# Movement Tracking (copied from yolo_service.py for parity)
# ============================================================

class MovementTracker:
    """Track goat head movements for automatic feeding trigger"""
    
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
            return "FEEDING"  # Left zone - feeding area
        elif x_ratio < 0.66:
            return "FENCE"    # Middle zone - fence/border
        else:
            return "KANDANG"  # Right zone - resting area
    
    def update(self, bbox, frame_width, frame_height):
        """Update movement tracking with new detection"""
        x1, y1, x2, y2 = bbox
        x_center = (x1 + x2) / 2
        y_center = (y1 + y2) / 2
        
        current_zone = self.calculate_zone(x_center, frame_width)
        
        # Reset counter if goat returns to KANDANG zone
        if current_zone == "KANDANG":
            if self.movement_count > 0:
                logger.info(f"Goat returned to KANDANG - resetting counter from {self.movement_count}")
            self.movement_count = 0
            self.feeding_triggered = False
            self.last_reset_time = datetime.now()
        
        # Count zone crossing: when head enters FEEDING zone from FENCE
        if current_zone == "FEEDING" and self.last_zone == "FENCE":
            self.movement_count += 1
            logger.info(f"Zone crossing detected! FENCE → FEEDING. Count: {self.movement_count}/10")
        
        # Track movement within FEEDING zone
        if current_zone == "FEEDING":
            if len(self.head_positions) > 0:
                last_x, last_y = self.head_positions[-1]
                distance = ((x_center - last_x)**2 + (y_center - last_y)**2)**0.5
                
                if distance > 30:
                    self.movement_count += 1
                    logger.info(f"Head movement in FEEDING zone! Count: {self.movement_count}/10")
            
            self.head_positions.append((x_center, y_center))
        
        # Check if feeding should be triggered
        should_feed = (current_zone == "FEEDING" and 
                      self.movement_count >= 10 and 
                      not self.feeding_triggered)
        
        if should_feed:
            self.feeding_triggered = True
            logger.warning(f"🔔 FEEDING TRIGGER! Movement count reached {self.movement_count}")
        
        self.last_zone = current_zone
        
        return {
            "zone": current_zone,
            "movement_count": self.movement_count,
            "should_feed": should_feed,
            "feeding_triggered": self.feeding_triggered
        }


# Global movement tracker instance
movement_tracker = MovementTracker()


# ============================================================
# Main Analysis Function
# ============================================================

def analyze_image(image_bytes: bytes) -> dict:
    """
    Analyze image using Roboflow Workflow via Serverless API.
    
    Args:
        image_bytes: Raw image bytes (JPEG/PNG)
    
    Returns:
        dict with keys: status, count, detections, zone_info, should_trigger_feeding
    """
    
    if client is None:
        logger.error("Roboflow client not initialized!")
        return {"error": "Roboflow client not initialized", "detections": []}
    
    try:
        # Decode image with OpenCV to ensure proper format
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            logger.error("Failed to decode image")
            return {"error": "Failed to decode image", "detections": []}
        
        # Get actual frame dimensions
        frame_height, frame_width = img.shape[:2]
        logger.info(f"📷 Image decoded: {frame_width}x{frame_height}")
        
        # Re-encode to JPEG with good quality
        encode_params = [cv2.IMWRITE_JPEG_QUALITY, 85]
        _, buffer = cv2.imencode('.jpg', img, encode_params)
        image_bytes_clean = buffer.tobytes()
        
        # Convert to base64
        image_base64 = base64.b64encode(image_bytes_clean).decode("utf-8")
        
        # Save debug image for manual testing
        debug_path = "/tmp/debug_roboflow_input.jpg"
        with open(debug_path, "wb") as f:
            f.write(image_bytes_clean)
        logger.info(f"DEBUG: Saved clean image to {debug_path}")
        
        # Log image size
        logger.info(f"📷 Sending image to Roboflow ({len(image_bytes_clean)} bytes)")
        
        # Run workflow - with data URI prefix
        result = client.run_workflow(
            workspace_name=WORKSPACE_NAME,
            workflow_id=WORKFLOW_ID,
            images={
                "image": f"data:image/jpeg;base64,{image_base64}"
            }
        )
        
        # Parse result
        detections = []
        zone_info = None
        should_trigger_feeding = False
        
        # Default frame dimensions (will be overridden if we can detect them)
        frame_width = 640
        frame_height = 480
        
        if result and len(result) > 0:
            workflow_output = result[0]
            
            # Log what we received
            logger.info(f"Roboflow response keys: {list(workflow_output.keys())}")
            
            # DEBUG: Log full predictions structure
            for key in workflow_output.keys():
                value = workflow_output[key]
                if isinstance(value, list):
                    logger.info(f"DEBUG [{key}]: list with {len(value)} items")
                    if len(value) > 0:
                        first_item = value[0]
                        if isinstance(first_item, dict):
                            logger.info(f"DEBUG [{key}][0] keys: {list(first_item.keys())}")
                            logger.info(f"DEBUG [{key}][0]: {first_item}")
                        else:
                            logger.info(f"DEBUG [{key}][0]: {type(first_item)} = {first_item}")
                elif isinstance(value, dict):
                    logger.info(f"DEBUG [{key}]: dict with keys {list(value.keys())}")
                else:
                    logger.info(f"DEBUG [{key}]: {type(value)}")
            
            # Try to find predictions in various common keys
            predictions = None
            for key in ['predictions', 'model_predictions', 'detections', 'output', 'sam_predictions']:
                if key in workflow_output:
                    preds = workflow_output[key]
                    logger.info(f"DEBUG: workflow_output['{key}'] = {type(preds)}")
                    
                    if isinstance(preds, list):
                        predictions = preds
                        logger.info(f"Using predictions from key: {key}, count: {len(preds)}")
                        break
                    elif isinstance(preds, dict):
                        logger.info(f"DEBUG: preds is dict with keys: {list(preds.keys())}")
                        if 'predictions' in preds:
                            nested = preds['predictions']
                            logger.info(f"DEBUG: preds['predictions'] = {type(nested)}, content: {nested}")
                            predictions = nested
                            logger.info(f"Using nested predictions from key: {key}")
                        break
            
            # Log final predictions state
            logger.info(f"DEBUG: Final predictions = {type(predictions)}, content: {predictions}")
            
            if predictions and len(predictions) > 0:
                logger.info(f"Found {len(predictions)} raw predictions")
                
                for pred in predictions:
                    if not isinstance(pred, dict):
                        continue
                    
                    x1, y1, x2, y2 = 0, 0, 0, 0
                    
                    # Check if this is SAM segmentation output (list of x,y points)
                    # SAM output looks like: [{'x': 408.0, 'y': 132.0}, {'x': 408.0, 'y': 131.0}, ...]
                    if isinstance(pred, dict) and 'x' in pred and 'y' in pred and 'width' not in pred:
                        # This is a single point from SAM polygon - skip individual points
                        # The actual prediction should contain 'class' field
                        if 'class' not in pred:
                            continue
                    
                    # Handle SAM predictions that have polygon points embedded
                    # Look for the prediction that has 'class' and potentially nested polygon
                    if 'class' in pred:
                        class_name = pred.get('class', 'Kambing')
                        confidence = pred.get('confidence', pred.get('score', 0.95))
                        
                        # Check for polygon points (SAM output)
                        points = pred.get('points', pred.get('polygon', []))
                        
                        if points and isinstance(points, list) and len(points) > 0:
                            # Calculate bounding box from polygon points
                            if isinstance(points[0], dict):
                                # Points are dicts like {'x': 408.0, 'y': 132.0}
                                x_coords = [p.get('x', 0) for p in points if isinstance(p, dict)]
                                y_coords = [p.get('y', 0) for p in points if isinstance(p, dict)]
                            else:
                                # Points are tuples/lists like [408.0, 132.0]
                                x_coords = [p[0] for p in points if len(p) >= 2]
                                y_coords = [p[1] for p in points if len(p) >= 2]
                            
                            if x_coords and y_coords:
                                x1 = int(min(x_coords))
                                y1 = int(min(y_coords))
                                x2 = int(max(x_coords))
                                y2 = int(max(y_coords))
                        
                        # If no polygon, try standard bbox formats
                        elif 'x' in pred and 'width' in pred:
                            # Center format
                            x = pred.get('x', 0)
                            y = pred.get('y', 0)
                            w = pred.get('width', 0)
                            h = pred.get('height', 0)
                            x1 = int(x - w/2)
                            y1 = int(y - h/2)
                            x2 = int(x + w/2)
                            y2 = int(y + h/2)
                        elif 'x1' in pred:
                            # Corner format
                            x1 = int(pred.get('x1', 0))
                            y1 = int(pred.get('y1', 0))
                            x2 = int(pred.get('x2', 0))
                            y2 = int(pred.get('y2', 0))
                        else:
                            # Try bbox array
                            bbox = pred.get('bbox', pred.get('box', None))
                            if bbox and len(bbox) >= 4:
                                x1, y1, x2, y2 = int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])
                            else:
                                # Default small box if no coordinates found
                                x1, y1, x2, y2 = 100, 100, 200, 200
                        
                        # Validate bbox
                        if x2 <= x1:
                            x2 = x1 + 50
                        if y2 <= y1:
                            y2 = y1 + 50
                        
                        # Determine behavior based on aspect ratio
                        width = abs(x2 - x1)
                        height = abs(y2 - y1)
                        aspect_ratio = width / height if height > 0 else 1
                        
                        behavior = "Standing"
                        if aspect_ratio > 2.0:
                            behavior = "Lying Down"
                        elif aspect_ratio < 0.6:
                            behavior = "Sitting"
                        
                        # Update movement tracking with first detection
                        if zone_info is None and x2 > 0 and y2 > 0:
                            # Estimate frame dimensions from bbox
                            frame_width = max(frame_width, x2 + 100)
                            frame_height = max(frame_height, y2 + 100)
                            
                            zone_info = movement_tracker.update(
                                [x1, y1, x2, y2],
                                frame_width,
                                frame_height
                            )
                            should_trigger_feeding = zone_info["should_feed"]
                            logger.info(f"✅ Zone: {zone_info['zone']}, Moves: {zone_info['movement_count']}")
                        
                        # Add to detections
                        display_class = "Kambing"
                        if isinstance(class_name, str):
                            if 'sheep' in class_name.lower() or 'goat' in class_name.lower() or 'head' in class_name.lower():
                                display_class = "Kambing"
                            else:
                                display_class = class_name
                        
                        detections.append({
                            "class": display_class,
                            "confidence": round(float(confidence) if confidence else 0.95, 2),
                            "bbox": [x1, y1, x2, y2],
                            "behavior": behavior,
                            "zone": zone_info["zone"] if zone_info else "UNKNOWN"
                        })
        
        count = len(detections)
        logger.info(f"✅ Roboflow detected {count} objects")
        
        return {
            "status": "success",
            "count": count,
            "detections": detections,
            "zone_info": zone_info,
            "should_trigger_feeding": should_trigger_feeding
        }
        
    except Exception as e:
        logger.error(f"❌ Roboflow API error: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "detections": []}

