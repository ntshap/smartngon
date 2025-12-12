"""
Supabase Service for database operations
"""
import os
import logging
from supabase import create_client, Client
from datetime import datetime
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
        

        from supabase.lib.client_options import ClientOptions
        self.client: Client = create_client(url, key, options=ClientOptions(
            postgrest_client_timeout=10,
            storage_client_timeout=10
        ))
        logger.info("Supabase client initialized")
    
    # Sensor Logs
    async def insert_sensor_log(self, goat_id: str, sensor_type: str, value: float, unit: str = None):
        """Insert a sensor log entry"""
        try:
            data = {
                "goat_id": goat_id,
                "sensor_type": sensor_type,
                "value": value,
                "unit": unit,
                "recorded_at": datetime.utcnow().isoformat()
            }
            
            result = self.client.table("sensor_logs").insert(data).execute()
            logger.info(f"Inserted sensor log for goat {goat_id}: {sensor_type}={value}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error inserting sensor log: {e}")
            return None
    
    async def get_latest_sensor_logs(self, goat_id: str, limit: int = 10):
        """Get latest sensor logs for a goat"""
        try:
            result = self.client.table("sensor_logs")\
                .select("*")\
                .eq("goat_id", goat_id)\
                .order("recorded_at", desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error fetching sensor logs: {e}")
            return []
    
    # Goat Management
    async def update_goat_location(self, goat_id: str, latitude: float, longitude: float, location_name: str = None):
        """Update goat GPS location"""
        try:
            data = {
                "last_location_lat": latitude,
                "last_location_lng": longitude,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if location_name:
                data["last_location_name"] = location_name
            
            result = self.client.table("goats")\
                .update(data)\
                .eq("id", goat_id)\
                .execute()
            
            logger.info(f"Updated location for goat {goat_id}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error updating goat location: {e}")
            return None
    
    async def update_goat_status(self, goat_id: str, status: str, health_score: int = None):
        """Update goat health status"""
        try:
            data = {
                "status": status,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if health_score is not None:
                data["health_score"] = health_score
            
            result = self.client.table("goats")\
                .update(data)\
                .eq("id", goat_id)\
                .execute()
            
            logger.info(f"Updated status for goat {goat_id}: {status}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error updating goat status: {e}")
            return None
    
    async def get_goat(self, goat_id: str):
        """Get goat by ID"""
        try:
            result = self.client.table("goats")\
                .select("*")\
                .eq("id", goat_id)\
                .single()\
                .execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error fetching goat: {e}")
            return None
    
    # Feeding Logs
    async def insert_feeding_log(self, goat_id: str, amount_kg: float = None, triggered_by: str = "manual", notes: str = None):
        """Insert a feeding log entry"""
        try:
            data = {
                "goat_id": goat_id,
                "fed_at": datetime.utcnow().isoformat(),
                "amount_kg": amount_kg,
                "triggered_by": triggered_by,
                "notes": notes
            }
            
            result = self.client.table("feeding_logs").insert(data).execute()
            logger.info(f"Inserted feeding log for goat {goat_id}: triggered_by={triggered_by}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error inserting feeding log: {e}")
            return None
    
    async def get_feeding_logs(self, goat_id: str, limit: int = 20):
        """Get feeding logs for a goat"""
        try:
            result = self.client.table("feeding_logs")\
                .select("*")\
                .eq("goat_id", goat_id)\
                .order("fed_at", desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error fetching feeding logs: {e}")
            return []
    
    # AI Events
    async def insert_ai_event(self, goat_id: str, event_type: str, confidence: float = None, metadata: dict = None, image_url: str = None):
        """Insert an AI event"""
        try:
            data = {
                "goat_id": goat_id,
                "event_type": event_type,
                "confidence": confidence,
                "metadata": metadata,
                "image_url": image_url,
                "created_at": datetime.utcnow().isoformat()
            }
            
            result = self.client.table("ai_events").insert(data).execute()
            logger.info(f"Inserted AI event for goat {goat_id}: {event_type}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error inserting AI event: {e}")
            return None
    
    async def get_ai_events(self, goat_id: str = None, limit: int = 50):
        """Get AI events, optionally filtered by goat_id"""
        try:
            query = self.client.table("ai_events").select("*")
            
            if goat_id:
                query = query.eq("goat_id", goat_id)
            
            result = query.order("created_at", desc=True).limit(limit).execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error fetching AI events: {e}")
            return []
    
    # Weight Logs
    async def insert_weight_log(self, goat_id: str, weight_kg: float, method: str = "manual", notes: str = None):
        """Insert a weight log entry"""
        try:
            data = {
                "goat_id": goat_id,
                "weight_kg": weight_kg,
                "measured_at": datetime.utcnow().isoformat(),
                "method": method,
                "notes": notes
            }
            
            result = self.client.table("weight_logs").insert(data).execute()
            logger.info(f"Inserted weight log for goat {goat_id}: {weight_kg}kg")
            
            # Also update goat's current weight
            await self.client.table("goats")\
                .update({"weight": weight_kg, "updated_at": datetime.utcnow().isoformat()})\
                .eq("id", goat_id)\
                .execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error inserting weight log: {e}")
            return None
    
    async def get_weight_logs(self, goat_id: str, limit: int = 30):
        """Get weight logs for a goat"""
        try:
            result = self.client.table("weight_logs")\
                .select("*")\
                .eq("goat_id", goat_id)\
                .order("measured_at", desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error fetching weight logs: {e}")
            return []
    
    # Feeding Schedules
    async def get_feeding_schedules(self, farm_id: str):
        """Get active feeding schedules for a farm"""
        try:
            result = self.client.table("feeding_schedules")\
                .select("*")\
                .eq("farm_id", farm_id)\
                .eq("is_active", True)\
                .order("time")\
                .execute()
            
            return result.data
        
        except Exception as e:
            logger.error(f"Error fetching feeding schedules: {e}")
            return []
    
    async def insert_feeding_schedule(self, farm_id: str, time: str, amount_kg: float = 0.5):
        """Insert a new feeding schedule"""
        try:
            data = {
                "farm_id": farm_id,
                "time": time,
                "amount_kg": amount_kg,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            }
            
            result = self.client.table("feeding_schedules").insert(data).execute()
            logger.info(f"Inserted feeding schedule for farm {farm_id}: {time}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error inserting feeding schedule: {e}")
            return None

    async def update_feeding_schedule(self, schedule_id: str, time: str = None, amount_kg: float = None, is_active: bool = None):
        """Update a feeding schedule"""
        try:
            data = {
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if time is not None:
                data["time"] = time
            if amount_kg is not None:
                data["amount_kg"] = amount_kg
            if is_active is not None:
                data["is_active"] = is_active
            
            result = self.client.table("feeding_schedules")\
                .update(data)\
                .eq("id", schedule_id)\
                .execute()
            
            logger.info(f"Updated feeding schedule {schedule_id}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error updating feeding schedule: {e}")
            return None

    async def delete_feeding_schedule(self, schedule_id: str):
        """Delete a feeding schedule"""
        try:
            result = self.client.table("feeding_schedules")\
                .delete()\
                .eq("id", schedule_id)\
                .execute()
            
            logger.info(f"Deleted feeding schedule {schedule_id}")
            return result.data
        
        except Exception as e:
            logger.error(f"Error deleting feeding schedule: {e}")
            return None


# Global Supabase service instance
supabase_service = SupabaseService()
