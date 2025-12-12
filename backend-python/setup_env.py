import os

def setup_env():
    frontend_env_path = "../front end/.env.local"
    backend_env_path = ".env"
    
    print(f"Reading from {frontend_env_path}...")
    
    supabase_url = ""
    supabase_key = ""
    
    try:
        with open(frontend_env_path, "r") as f:
            for line in f:
                if "NEXT_PUBLIC_SUPABASE_URL" in line:
                    supabase_url = line.split("=")[1].strip().strip('"').strip("'")
                if "NEXT_PUBLIC_SUPABASE_ANON_KEY" in line:
                    supabase_key = line.split("=")[1].strip().strip('"').strip("'")
                # Also check for non-public versions just in case
                if line.startswith("SUPABASE_URL"):
                    supabase_url = line.split("=")[1].strip().strip('"').strip("'")
                if line.startswith("SUPABASE_KEY") or line.startswith("SUPABASE_SERVICE_ROLE_KEY"):
                    supabase_key = line.split("=")[1].strip().strip('"').strip("'")
                    
        if not supabase_url or not supabase_key:
            print("Could not find Supabase credentials in frontend .env.local")
            return
            
        print(f"Found URL: {supabase_url[:10]}...")
        print(f"Found Key: {supabase_key[:10]}...")
        
        with open(backend_env_path, "w") as f:
            f.write(f"SUPABASE_URL={supabase_url}\n")
            f.write(f"SUPABASE_KEY={supabase_key}\n")
            f.write("\n# MQTT Configuration\n")
            f.write("MQTT_BROKER=broker.emqx.io\n")
            f.write("MQTT_PORT=1883\n")
            f.write("MQTT_CLIENT_ID=smartngangon-backend\n")
            
        print(f"Successfully created {backend_env_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_env()
