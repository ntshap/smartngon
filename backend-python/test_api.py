import requests
import os

def test_cv_endpoint():
    url = "http://localhost:8000/cv/analyze"
    
    # Use a sample image from the dataset
    image_path = "../SMARTNGON_CV/SmartNgon-2/test/images/25-domba_jpg.rf.8f5af7454a05d3cd97652bbff5e87f57.jpg"
    
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    print(f"Sending image: {image_path}")
    try:
        with open(image_path, "rb") as f:
            files = {"file": f}
            response = requests.post(url, files=files)
        
        if response.status_code == 200:
            print("Success!")
            print(response.json())
        else:
            print(f"Failed with status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error connecting to API: {e}")
        print("Make sure the backend is running: uvicorn main:app --reload")

if __name__ == "__main__":
    test_cv_endpoint()
