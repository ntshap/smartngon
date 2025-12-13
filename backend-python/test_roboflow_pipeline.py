# test_roboflow_pipeline.py
# Run this to test if Roboflow workflow can detect sheep/goat heads
# NOTE: Run this on Windows (not WSL) to access webcam

from inference import InferencePipeline
import cv2
import os
from dotenv import load_dotenv

load_dotenv()

def my_sink(result, video_frame):
    # Display detection results
    if result.get("output_image"):
        cv2.imshow("Workflow Image", result["output_image"].numpy_image)
        cv2.waitKey(1)
    
    # Print detection results
    print("\n=== Detection Result ===")
    print(f"Keys in result: {result.keys()}")
    
    # Look for predictions
    for key, value in result.items():
        if 'prediction' in key.lower() or 'detection' in key.lower() or 'output' in key.lower():
            print(f"{key}: {value}")
    print("=" * 30)

# Initialize pipeline
pipeline = InferencePipeline.init_with_workflow(
    api_key=os.getenv("ROBOFLOW_API_KEY"),
    workspace_name="smartngon",
    workflow_id="find-sheep-heads",
    video_reference=0,  # Webcam
    max_fps=5,  # Slower for debugging
    on_prediction=my_sink
)

print("Starting pipeline... Press Ctrl+C to stop")
print("Point camera at sheep/goat images to test detection")
pipeline.start()
pipeline.join()
