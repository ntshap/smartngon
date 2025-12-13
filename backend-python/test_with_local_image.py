# test_with_local_image.py
# Test Roboflow API with a local image that we know should work

import os
import sys
from dotenv import load_dotenv

load_dotenv()

def test_with_image(image_path):
    """Test Roboflow workflow with a specific image file"""
    
    from inference_sdk import InferenceHTTPClient
    import base64
    
    api_key = os.getenv("ROBOFLOW_API_KEY")
    
    client = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key=api_key,
    )
    
    print(f"\n📷 Testing with image: {image_path}")
    
    # Read image
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    
    print(f"Image size: {len(image_bytes)} bytes")
    
    # Convert to base64
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    # Test with data URI format (how we send from service)
    print("\n⏳ Calling Roboflow Workflow with data URI format...")
    
    try:
        result = client.run_workflow(
            workspace_name="smartngon",
            workflow_id="find-sheep-heads",
            images={
                "image": f"data:image/jpeg;base64,{image_base64}"
            }
        )
        
        print("\n✅ API call successful!")
        print(f"Result: {result}")
        
        if result and len(result) > 0:
            output = result[0]
            print(f"\nOutput keys: {list(output.keys())}")
            
            if 'predictions' in output:
                preds = output['predictions']
                print(f"'predictions' type: {type(preds)}")
                if isinstance(preds, dict):
                    print(f"  keys: {list(preds.keys())}")
                    if 'predictions' in preds:
                        inner = preds['predictions']
                        print(f"  'predictions' inner: {type(inner)}, len={len(inner) if isinstance(inner, list) else 'N/A'}")
                        if isinstance(inner, list) and len(inner) > 0:
                            print(f"  First detection: {inner[0]}")
                elif isinstance(preds, list):
                    print(f"  count: {len(preds)}")
                    if len(preds) > 0:
                        print(f"  First detection: {preds[0]}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Try debug image first
    if os.path.exists("/tmp/debug_roboflow_input.jpg"):
        test_with_image("/tmp/debug_roboflow_input.jpg")
    
    # Also try local test image
    test_images = [
        "../SMARTNGON_CV/SMARTNGON/SmartNgon-2/test/images/25-domba_jpg.rf.8f5af7454a05d3cd97652bbff5e87f57.jpg",
    ]
    
    for path in test_images:
        if os.path.exists(path):
            test_with_image(path)
            break
