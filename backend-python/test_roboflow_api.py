# test_roboflow_api.py
# Run this to test Roboflow Workflow API connection
# Usage: python test_roboflow_api.py

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_connection():
    """Test Roboflow API connection with a sample image"""
    
    print("=" * 50)
    print("Roboflow Workflow API Test")
    print("=" * 50)
    
    # Check API key
    api_key = os.getenv("ROBOFLOW_API_KEY")
    if not api_key:
        print("❌ ERROR: ROBOFLOW_API_KEY not found in .env file!")
        print("Please add: ROBOFLOW_API_KEY=your_key_here")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...")
    
    # Try to import inference_sdk
    try:
        from inference_sdk import InferenceHTTPClient
        print("✅ inference-sdk imported successfully")
    except ImportError:
        print("❌ ERROR: inference-sdk not installed!")
        print("Run: pip install inference-sdk")
        return False
    
    # Initialize client
    client = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key=api_key,
    )
    print("✅ Roboflow client initialized")
    
    # Test with a sheep image from URL
    test_image_url = "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=640"
    
    print(f"\n📷 Testing with image: {test_image_url[:50]}...")
    print("\n⏳ Calling Roboflow Workflow 'find-sheep-heads'...")
    
    try:
        result = client.run_workflow(
            workspace_name="smartngon",
            workflow_id="find-sheep-heads",
            images={
                "image": test_image_url
            }
        )
        
        print("\n✅ API call successful!")
        print("\n" + "=" * 50)
        print("RAW RESPONSE:")
        print("=" * 50)
        print(result)
        
        print("\n" + "=" * 50)
        print("PARSED RESPONSE:")
        print("=" * 50)
        
        if result and len(result) > 0:
            output = result[0]
            print(f"Output keys: {list(output.keys())}")
            
            # Look for predictions in various common keys
            prediction_keys = ['predictions', 'model_predictions', 'detections', 'output']
            
            for key in prediction_keys:
                if key in output:
                    preds = output[key]
                    print(f"\n📦 Found '{key}' with {len(preds) if isinstance(preds, list) else 'N/A'} items:")
                    
                    if isinstance(preds, list):
                        for i, pred in enumerate(preds[:5]):  # Show first 5
                            if isinstance(pred, dict):
                                print(f"  [{i}] Keys: {list(pred.keys())}")
                                if 'class' in pred:
                                    print(f"      Class: {pred.get('class')}, Confidence: {pred.get('confidence', 'N/A')}")
                                if 'x' in pred and 'y' in pred:
                                    print(f"      Position: x={pred.get('x')}, y={pred.get('y')}, w={pred.get('width')}, h={pred.get('height')}")
                            else:
                                print(f"  [{i}] {pred}")
                    else:
                        print(f"  Value: {preds}")
            
            print("\n✅ Test completed successfully!")
            return True
        else:
            print("❌ Empty response from API")
            return False
            
    except Exception as e:
        print(f"\n❌ API Error: {e}")
        print("\nPossible causes:")
        print("  1. Wrong API key")
        print("  2. Workflow 'find-sheep-heads' doesn't exist")
        print("  3. Workflow not deployed to Serverless API")
        print("  4. Network issues")
        return False

def test_with_local_image():
    """Test with a local image file"""
    import base64
    from inference_sdk import InferenceHTTPClient
    
    api_key = os.getenv("ROBOFLOW_API_KEY")
    client = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key=api_key,
    )
    
    # Try to find a local test image
    test_paths = [
        "../SMARTNGON_CV/SmartNgon-2/test/images/25-domba_jpg.rf.8f5af7454a05d3cd97652bbff5e87f57.jpg",
        "../SMARTNGON_CV/SMARTNGON/SmartNgon-2/test/images/25-domba_jpg.rf.8f5af7454a05d3cd97652bbff5e87f57.jpg",
    ]
    
    local_image = None
    for path in test_paths:
        if os.path.exists(path):
            local_image = path
            break
    
    if not local_image:
        print("\n⚠️ No local test image found, skipping local test")
        return
    
    print(f"\n📷 Testing with local image: {local_image}")
    
    # Read and encode image
    with open(local_image, "rb") as f:
        image_bytes = f.read()
    
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    try:
        result = client.run_workflow(
            workspace_name="smartngon",
            workflow_id="find-sheep-heads",
            images={
                "image": {"type": "base64", "value": image_base64}
            }
        )
        
        print("✅ Local image test successful!")
        print(f"Result: {result}")
        
    except Exception as e:
        print(f"❌ Local image test failed: {e}")


if __name__ == "__main__":
    print("\n")
    success = test_api_connection()
    
    if success:
        test_with_local_image()
    
    print("\n")
