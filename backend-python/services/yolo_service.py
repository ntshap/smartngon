import cv2
import numpy as np
import logging
import os
from pathlib import Path
import warnings
from datetime import datetime
from collections import deque

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress PyTorch warnings for weights_only
warnings.filterwarnings('ignore', category=FutureWarning)

# Monkey-patch torch.load before importing ultralytics
import torch
original_load = torch.load
def patched_load(*args, **kwargs):
    # Force weights_only=False for backward compatibility with trained models
    kwargs['weights_only'] = False
    return original_load(*args, **kwargs)
torch.load = patched_load

# Import YOLO after patching
from ultralytics import YOLO

# Load the YOLOv8 model - use pretrained COCO model as fallback
# Custom trained model has memory issues in WSL, so we use COCO model with sheep/cow detection
MODEL_CANDIDATES = [
    'yolov8n.pt',  # Pretrained COCO model (includes sheep class 19, cow class 18)
    Path('best.pt'),
    Path('backend-python') / 'best.pt',
    Path('SMARTNGON_CV') / 'runs' / 'detect' / 'train_improved' / 'weights' / 'best.pt',
]

model = None
loaded_path = None
for p in MODEL_CANDIDATES:
    try_path = Path(p) if not str(p).endswith('.pt') or '/' in str(p) else p
    if isinstance(try_path, Path) and not try_path.is_absolute():
        try_path = Path(os.getcwd()) / try_path
    
    # Check if path exists (skip string paths like 'yolov8n.pt' - ultralytics will download)
    if isinstance(try_path, str) or try_path.exists():
        try:
            model = YOLO(str(try_path) if isinstance(try_path, Path) else try_path)
            loaded_path = try_path
            logger.info(f"Loaded YOLOv8 model from: {try_path}")
            break
        except Exception as e:
            logger.error(f"Attempted to load model at {try_path} but failed: {e}")

if model is None:
    logger.error("Failed to load YOLOv8 model from candidate paths: %s", MODEL_CANDIDATES)

# Movement tracking state
class MovementTracker:
    def __init__(self, max_history=30):
        self.head_positions = deque(maxlen=max_history)  # Store last 30 positions
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
                # Calculate movement distance
                distance = ((x_center - last_x)**2 + (y_center - last_y)**2)**0.5
                
                # Count as movement if distance > 30 pixels (significant head movement)
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

def analyze_image(image_bytes):
    """
    Analyzes an image byte stream using YOLOv8 to detect objects (goats).
    """
    if model is None:
        return {"error": "Model not loaded", "detections": []}

    try:
        # Convert image bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        
        # Decode image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"error": "Failed to decode image", "detections": []}
        
        # Get frame dimensions for zone calculation
        frame_height, frame_width = img.shape[:2]
        
        # Debug: Log image info
        logger.info(f"Image decoded: shape={img.shape}, dtype={img.dtype}")

        # Run inference with lower confidence threshold for better detection
        # Lowered from 0.4 to 0.2 to catch more detections
        results = model(img, conf=0.2, verbose=False) 

        detections = []
        zone_info = None
        should_trigger_feeding = False
        
        for result in results:
            boxes = result.boxes
            logger.info(f"Raw detections before filtering: {len(boxes)} boxes")
            for box in boxes:
                # Get class info
                cls = int(box.cls[0])
                class_name = model.names[cls]
                conf = float(box.conf[0])
                
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # LOG what we detected
                logger.info(f"YOLO detected: class_id={cls}, class_name='{class_name}', conf={conf:.2f}, bbox=[{x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}]")
                
                # Update movement tracking FIRST (before filter) for first detection only
                # This ensures zone tracking works even if class is not sheep/cow
                if zone_info is None:
                    zone_info = movement_tracker.update(
                        [x1, y1, x2, y2], 
                        frame_width, 
                        frame_height
                    )
                    should_trigger_feeding = zone_info["should_feed"]
                    logger.info(f"✅ Zone tracking updated: zone={zone_info['zone']}, moves={zone_info['movement_count']}, trigger={should_trigger_feeding}")
                
                # Filter: only keep sheep/cow/goat-like animals  
                # COCO classes: 16=bird, 17=cat, 18=dog, 19=horse, 20=sheep, 21=cow
                # NOTE: Removed person (0) - only accept actual animals
                relevant_class_ids = [17, 18, 19, 20, 21]  # cat, dog, horse, sheep, cow
                relevant_class_names = ['sheep', 'cow', 'horse', 'dog', 'goat', 'cattle', 'cat']
                
                if cls not in relevant_class_ids and class_name.lower() not in relevant_class_names:
                    logger.warning(f"❌ FILTERED OUT: {class_name} (ID: {cls}) - not a goat-like animal")
                    continue
                
                logger.info(f"✅ ACCEPTED: {class_name} (ID: {cls})")
                
                # Rename to "Kambing" for user-friendly Indonesian display
                display_name = "Kambing" if cls in [19, 20, 21] or class_name.lower() in ['sheep', 'cow', 'cattle', 'goat', 'horse'] else class_name
                
                # Simple behavior heuristic based on aspect ratio or position (Placeholder)
                # In a real scenario, you'd train a custom model for behaviors like 'eating', 'sleeping'
                width = x2 - x1
                height = y2 - y1
                aspect_ratio = width / height
                
                # More accurate behavior detection - only mark as lying down if very wide
                behavior = "Standing"
                if aspect_ratio > 2.0:  # Changed from 1.2 to 2.0 - much wider bbox = lying
                    behavior = "Lying Down"
                elif aspect_ratio < 0.6:  # Very tall and narrow
                    behavior = "Sitting"
                
                detections.append({
                    "class": display_name,
                    "confidence": round(conf, 2),
                    "bbox": [round(x1), round(y1), round(x2), round(y2)],
                    "behavior": behavior,
                    "zone": zone_info["zone"] if zone_info else "UNKNOWN"
                })

        count = len(detections)
        logger.info(f"Detected {count} objects.")

        return {
            "status": "success",
            "count": count,
            "detections": detections,
            "zone_info": zone_info,
            "should_trigger_feeding": should_trigger_feeding
        }

    except Exception as e:
        logger.error(f"Error during analysis: {e}")
        return {"error": str(e), "detections": []}

