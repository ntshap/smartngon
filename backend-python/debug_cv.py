import sys
import os

# Add current directory to path so we can import services
sys.path.append(os.getcwd())

from services.yolo_service import analyze_image

def test_local():
    image_path = "../SMARTNGON_CV/SmartNgon-2/test/images/25-domba_jpg.rf.8f5af7454a05d3cd97652bbff5e87f57.jpg"
    
    if not os.path.exists(image_path):
        print(f"Image not found: {image_path}")
        return

    print(f"Testing with image: {image_path}")
    
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    
    try:
        result = analyze_image(image_bytes)
        print("Result:", result)
    except Exception as e:
        print("CRASHED:")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_local()
