#!/usr/bin/env python3
"""
EcoRover Raspberry Pi - Firebase Realtime Database Sync Script
================================================================

This script reads sensor data from Raspberry Pi and syncs it to Firebase
Realtime Database in real-time with optimized latency and minimal redundant writes.

Requirements:
    - Python 3.7+
    - firebase-admin: pip install firebase-admin
    - Service account JSON file from Firebase Console

Author: Generated for EcoRover Project
"""

import json
import time
import logging
import sys
import os
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
from pathlib import Path
import threading
from collections import deque

try:
    import firebase_admin
    from firebase_admin import credentials, db
except ImportError:
    print("ERROR: firebase-admin not installed. Run: pip install firebase-admin")
    sys.exit(1)

# ============================================================================
# CONFIGURATION
# ============================================================================

# Path to Firebase service account JSON file
# Place your service account key file in the same directory as this script
SERVICE_ACCOUNT_PATH = Path(__file__).parent / "firebase-service-account.json"

# Firebase Realtime Database URL (from your .env or Firebase Console)
# Format: https://your-project-id-default-rtdb.firebaseio.com/
FIREBASE_DATABASE_URL = os.getenv(
    "FIREBASE_DATABASE_URL",
    "https://ecorover-1b4e2-default-rtdb.firebaseio.com/"  # Update with your URL
)

# Update intervals (in seconds) - optimized for real-time visibility
UPDATE_INTERVALS = {
    "dashboard": 1.0,      # High-frequency system metrics
    "bins": 2.0,           # Bin levels update less frequently
    "energy": 1.0,          # Energy data changes frequently
    "navigation": 0.5,     # GPS updates very frequently
    "vision": 0.5,         # AI detections happen in real-time
    "alerts": 0.1,         # Alerts are immediate
    "cloudData": 5.0,      # Logs are batched
}

# Change detection threshold - only update if value changes by this amount
CHANGE_THRESHOLDS = {
    "dashboard": {
        "systemReadiness": 1,
        "motors": 1,
        "ai": 1,
        "power": 1,
        "wasteItemsCollected": 1,
        "detectionRate": 0.1,
        "cpuLoad": 1,
        "temperature": 0.5,
        "uptime": 0.1,
        "distance": 1,
        "powerOutput": 1,
    },
    "energy": {
        "solarInput": 5,
        "consumption": 5,
        "netPower": 5,
        "batteryLevel": 1,
        "batteryTemp": 0.5,
    },
    "navigation": {
        "latitude": 0.0001,  # ~11 meters
        "longitude": 0.0001,
        "speed": 0.1,
        "heading": 1,
    },
}

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ecorover_sync.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# ============================================================================
# FIREBASE INITIALIZATION
# ============================================================================

class FirebaseConnection:
    """Manages Firebase connection with error handling and reconnection logic."""
    
    def __init__(self, service_account_path: Path, database_url: str):
        self.service_account_path = service_account_path
        self.database_url = database_url
        self.app = None
        self.ref = None
        self.connected = False
        self._lock = threading.Lock()
        
    def connect(self) -> bool:
        """Initialize Firebase connection."""
        try:
            if not self.service_account_path.exists():
                logger.error(f"Service account file not found: {self.service_account_path}")
                logger.error("Please download your service account key from Firebase Console:")
                logger.error("1. Go to Firebase Console > Project Settings > Service Accounts")
                logger.error("2. Click 'Generate New Private Key'")
                logger.error("3. Save as 'firebase-service-account.json' in the script directory")
                return False
            
            # Check if Firebase is already initialized
            if firebase_admin._apps:
                self.app = firebase_admin.get_app()
                logger.info("Using existing Firebase app instance")
            else:
                cred = credentials.Certificate(str(self.service_account_path))
                self.app = firebase_admin.initialize_app(
                    cred,
                    {'databaseURL': self.database_url}
                )
                logger.info(f"✅ Firebase initialized: {self.database_url}")
            
            self.ref = db.reference()
            self.connected = True
            logger.info("✅ Firebase connection established")
            return True
            
        except Exception as e:
            logger.error(f"❌ Firebase connection failed: {e}")
            self.connected = False
            return False
    
    def is_connected(self) -> bool:
        """Check if Firebase is connected."""
        return self.connected and self.app is not None
    
    def update(self, path: str, data: Dict[str, Any]) -> bool:
        """Update Firebase path with data. Returns True if successful."""
        if not self.is_connected():
            logger.warning("Firebase not connected, attempting reconnection...")
            if not self.connect():
                return False
        
        try:
            with self._lock:
                ref_path = self.ref.child(path)
                ref_path.update(data)
            return True
        except Exception as e:
            logger.error(f"❌ Firebase update failed for {path}: {e}")
            self.connected = False
            return False
    
    def push(self, path: str, data: Dict[str, Any]) -> Optional[str]:
        """Push new data to Firebase path. Returns key if successful."""
        if not self.is_connected():
            if not self.connect():
                return None
        
        try:
            with self._lock:
                ref_path = self.ref.child(path)
                new_ref = ref_path.push(data)
                return new_ref.key
        except Exception as e:
            logger.error(f"❌ Firebase push failed for {path}: {e}")
            self.connected = False
            return None

# ============================================================================
# SENSOR DATA READERS
# ============================================================================

class SensorReader:
    """Reads sensor data from Raspberry Pi hardware or simulates data for testing."""
    
    def __init__(self):
        self.start_time = time.time()
        self.distance_traveled = 0.0
        self.waste_count = 0
        self.last_gps = (31.2156, 29.9553)  # Default location (Cairo, Egypt)
        
    def read_dashboard_data(self) -> Dict[str, Any]:
        """
        Read dashboard system metrics.
        Replace with actual sensor readings in production.
        """
        # Simulated data - replace with actual sensor readings
        uptime = (time.time() - self.start_time) / 3600.0  # hours
        
        return {
            "systemReadiness": min(100, 85 + int(time.time()) % 15),
            "motors": min(100, 90 + int(time.time()) % 10),
            "ai": min(100, 92 + int(time.time()) % 8),
            "power": min(100, 80 + int(time.time()) % 20),
            "wasteItemsCollected": self.waste_count,
            "detectionRate": 95.0 + (time.time() % 10) * 0.4,
            "cpuLoad": 30 + int(time.time()) % 40,
            "temperature": 28 + int(time.time()) % 8,
            "uptime": round(uptime, 1),
            "distance": int(self.distance_traveled),
            "powerOutput": 140 + int(time.time()) % 30,
        }
    
    def read_bin_data(self) -> Dict[str, Dict[str, Any]]:
        """
        Read waste bin levels and mass.
        Replace with actual load cell/ultrasonic sensor readings.
        """
        t = time.time()
        return {
            "plastic": {
                "type": "Plastic",
                "level": min(100, 60 + int(t) % 30),
                "mass": round(2.0 + (t % 100) * 0.02, 1),
                "color": "bg-ai-cyan",
                "bgColor": "border-ai-cyan/30 bg-ai-cyan/5",
                "icon": "♻️",
                "lastEmpty": f"{int(t) % 6}h ago",
                "timestamp": int(time.time() * 1000),
            },
            "organic": {
                "type": "Organic",
                "level": min(100, 70 + int(t) % 25),
                "mass": round(2.5 + (t % 100) * 0.025, 1),
                "color": "bg-eco-green",
                "bgColor": "border-eco-green/30 bg-eco-green/5",
                "icon": "🌱",
                "lastEmpty": f"{int(t) % 5}h ago",
                "timestamp": int(time.time() * 1000),
            },
            "paper": {
                "type": "Paper/Glass",
                "level": min(100, 40 + int(t) % 35),
                "mass": round(1.5 + (t % 100) * 0.015, 1),
                "color": "bg-solar-amber",
                "bgColor": "border-solar-amber/30 bg-solar-amber/5",
                "icon": "📄",
                "lastEmpty": f"{int(t) % 7}h ago",
                "timestamp": int(time.time() * 1000),
            },
        }
    
    def read_energy_data(self) -> Dict[str, Any]:
        """
        Read energy system data (solar, battery, consumption).
        Replace with actual ADC readings from solar panels and battery monitor.
        """
        t = time.time()
        hour = datetime.now().hour
        solar_input = max(0, 300 + 100 * (1 - abs(hour - 12) / 6))  # Peak at noon
        consumption = 150 + int(t) % 50
        net_power = solar_input - consumption
        battery_level = min(100, max(20, 70 + int(t) % 30))
        
        return {
            "solarInput": round(solar_input, 1),
            "consumption": round(consumption, 1),
            "netPower": round(net_power, 1),
            "batteryLevel": int(battery_level),
            "batteryTemp": 30 + int(t) % 5,
            "isCharging": net_power > 0,
            "autonomy": round(battery_level / consumption * 24, 1),
            "generatedToday": round(solar_input * 0.007, 2),  # kWh estimate
            "consumedToday": round(consumption * 0.007, 2),
        }
    
    def read_navigation_data(self) -> Dict[str, Any]:
        """
        Read GPS and navigation data.
        Replace with actual GPS module readings (e.g., NEO-6M, NEO-8M).
        """
        t = time.time()
        # Simulate movement
        lat_offset = (t % 100) * 0.0001
        lng_offset = (t % 100) * 0.0001
        self.distance_traveled += 0.1  # Simulated distance increment
        
        return {
            "latitude": round(self.last_gps[0] + lat_offset, 6),
            "longitude": round(self.last_gps[1] + lng_offset, 6),
            "speed": round(0.8 + (t % 10) * 0.1, 1),
            "heading": int(t) % 360,
            "totalDistance": int(self.distance_traveled),
            "pathEfficiency": 90 + int(t) % 10,
            "currentZone": f"{chr(65 + int(t) % 6)}-{int(t) % 10 + 1}",
        }
    
    def read_vision_data(self) -> Optional[Dict[str, Any]]:
        """
        Read AI vision detection data.
        Replace with actual object detection model output (YOLO, TensorFlow Lite, etc.).
        """
        # Only return data when a detection occurs (simulated)
        if int(time.time()) % 10 == 0:  # Simulate detection every 10 seconds
            detection_types = ["Plastic Bottle", "Paper Cup", "Banana Peel", "Cardboard", "Aluminum Can"]
            return {
                "type": detection_types[int(time.time()) % len(detection_types)],
                "confidence": round(90 + (time.time() % 10), 1),
            }
        return None
    
    def read_cpu_temperature(self) -> float:
        """Read Raspberry Pi CPU temperature."""
        try:
            with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
                temp = int(f.read()) / 1000.0
            return temp
        except:
            return 35.0  # Default if file not accessible

# ============================================================================
# DATA CHANGE DETECTION
# ============================================================================

class ChangeDetector:
    """Detects meaningful changes in data to avoid redundant Firebase writes."""
    
    def __init__(self):
        self.last_values: Dict[str, Dict[str, Any]] = {}
        self.thresholds = CHANGE_THRESHOLDS
    
    def has_changed(self, path: str, new_data: Dict[str, Any]) -> Tuple[bool, Dict[str, Any]]:
        """
        Check if data has changed significantly.
        Returns (has_changed, filtered_data).
        """
        if path not in self.last_values:
            self.last_values[path] = {}
            return True, new_data
        
        last = self.last_values[path]
        changed_data = {}
        has_change = False
        
        if path in self.thresholds:
            # Use specific thresholds for this path
            thresholds = self.thresholds[path]
            for key, new_value in new_data.items():
                if key in thresholds:
                    last_value = last.get(key)
                    threshold = thresholds[key]
                    
                    if last_value is None or abs(new_value - last_value) >= threshold:
                        changed_data[key] = new_value
                        has_change = True
                else:
                    # No threshold defined, always include
                    if last.get(key) != new_value:
                        changed_data[key] = new_value
                        has_change = True
        else:
            # No thresholds, check for any change
            for key, new_value in new_data.items():
                if last.get(key) != new_value:
                    changed_data[key] = new_value
                    has_change = True
        
        if has_change:
            self.last_values[path].update(changed_data)
        
        return has_change, changed_data

# ============================================================================
# MAIN SYNC ENGINE
# ============================================================================

class EcoRoverSync:
    """Main synchronization engine for Raspberry Pi to Firebase."""
    
    def __init__(self):
        self.firebase = FirebaseConnection(SERVICE_ACCOUNT_PATH, FIREBASE_DATABASE_URL)
        self.sensors = SensorReader()
        self.change_detector = ChangeDetector()
        self.running = False
        self.last_updates: Dict[str, float] = {}
        self.alert_queue = deque(maxlen=50)  # Keep last 50 alerts
        
    def start(self):
        """Start the synchronization loop."""
        logger.info("🚀 Starting EcoRover Firebase Sync...")
        
        if not self.firebase.connect():
            logger.error("Failed to connect to Firebase. Exiting.")
            return False
        
        self.running = True
        
        # Start update threads for each data category
        threads = []
        for category in ["dashboard", "bins", "energy", "navigation", "vision", "cloudData"]:
            thread = threading.Thread(
                target=self._update_loop,
                args=(category,),
                daemon=True,
                name=f"sync-{category}"
            )
            thread.start()
            threads.append(thread)
        
        # Alert handler runs separately for immediate updates
        alert_thread = threading.Thread(
            target=self._alert_loop,
            daemon=True,
            name="sync-alerts"
        )
        alert_thread.start()
        
        logger.info("✅ All sync threads started")
        
        try:
            # Keep main thread alive
            while self.running:
                time.sleep(1)
                # Periodic health check
                if not self.firebase.is_connected():
                    logger.warning("Connection lost, attempting reconnect...")
                    self.firebase.connect()
        except KeyboardInterrupt:
            logger.info("🛑 Shutdown requested...")
            self.stop()
        
        return True
    
    def stop(self):
        """Stop the synchronization."""
        self.running = False
        logger.info("🛑 Stopping sync...")
    
    def _update_loop(self, category: str):
        """Update loop for a specific data category."""
        interval = UPDATE_INTERVALS.get(category, 1.0)
        
        while self.running:
            try:
                now = time.time()
                last_update = self.last_updates.get(category, 0)
                
                if now - last_update >= interval:
                    self._update_category(category)
                    self.last_updates[category] = now
                
                time.sleep(0.1)  # Small sleep to prevent CPU spinning
                
            except Exception as e:
                logger.error(f"Error in {category} update loop: {e}")
                time.sleep(interval)
    
    def _update_category(self, category: str):
        """Update a specific data category in Firebase."""
        try:
            if category == "dashboard":
                data = self.sensors.read_dashboard_data()
                # Add CPU temperature from actual sensor
                data["temperature"] = self.sensors.read_cpu_temperature()
                
            elif category == "bins":
                data = self.sensors.read_bin_data()
                # Update each bin separately for efficiency
                for bin_id, bin_data in data.items():
                    has_changed, changed_data = self.change_detector.has_changed(
                        f"bins/{bin_id}", bin_data
                    )
                    if has_changed:
                        self.firebase.update(f"bins/{bin_id}", changed_data)
                return
                
            elif category == "energy":
                data = self.sensors.read_energy_data()
                
            elif category == "navigation":
                data = self.sensors.read_navigation_data()
                # Add path point to actualPath
                path_point = {
                    "lat": data["latitude"],
                    "lng": data["longitude"],
                    "timestamp": int(time.time() * 1000)
                }
                self.firebase.push("navigation/actualPath", path_point)
                
            elif category == "vision":
                detection = self.sensors.read_vision_data()
                if detection:
                    detection_data = {
                        "id": int(time.time()),
                        "type": detection["type"],
                        "confidence": detection["confidence"],
                        "time": datetime.now().strftime("%H:%M:%S")
                    }
                    self.firebase.push("vision/recentDetections", detection_data)
                    # Update total detections
                    # Note: In production, maintain a counter
                    self.firebase.update("vision", {"totalDetections": self.sensors.waste_count})
                return
                
            elif category == "cloudData":
                # Batch log updates (less frequent)
                if int(time.time()) % 30 == 0:  # Every 30 seconds
                    self._update_logs()
                return
                
            else:
                return
            
            # Check for changes before updating
            has_changed, changed_data = self.change_detector.has_changed(category, data)
            
            if has_changed:
                success = self.firebase.update(category, changed_data)
                if success:
                    logger.debug(f"✅ Updated {category}: {len(changed_data)} fields")
                else:
                    logger.warning(f"⚠️ Failed to update {category}")
            else:
                logger.debug(f"⏭️ Skipped {category} (no significant changes)")
                
        except Exception as e:
            logger.error(f"❌ Error updating {category}: {e}")
    
    def _alert_loop(self):
        """Handle alerts with immediate updates."""
        while self.running:
            try:
                # Process queued alerts
                if self.alert_queue:
                    alert = self.alert_queue.popleft()
                    key = self.firebase.push("alerts", alert)
                    if key:
                        logger.info(f"📢 Alert sent: {alert['message']}")
                
                time.sleep(UPDATE_INTERVALS["alerts"])
                
            except Exception as e:
                logger.error(f"Error in alert loop: {e}")
                time.sleep(1)
    
    def _update_logs(self):
        """Update mission and error logs."""
        try:
            # Mission log example
            mission_log = {
                "id": f"M-{datetime.now().strftime('%Y-%m%d-%H%M%S')}",
                "time": datetime.now().strftime("%H:%M:%S"),
                "type": "Collection",
                "status": "Complete",
                "items": self.sensors.waste_count % 20,
                "timestamp": int(time.time() * 1000)
            }
            self.firebase.push("cloudData/missionLogs", mission_log)
            
            # Error log example (only if there are actual errors)
            # In production, capture actual system errors here
            
        except Exception as e:
            logger.error(f"Error updating logs: {e}")
    
    def add_alert(self, alert_type: str, message: str):
        """Add an alert to the queue."""
        alert = {
            "type": alert_type,  # "success", "info", "warning", "error"
            "message": message,
            "time": datetime.now().strftime("%H:%M:%S"),
            "timestamp": int(time.time() * 1000)
        }
        self.alert_queue.append(alert)

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

def main():
    """Main entry point."""
    logger.info("=" * 60)
    logger.info("EcoRover Raspberry Pi - Firebase Sync")
    logger.info("=" * 60)
    
    sync = EcoRoverSync()
    
    # Test alert
    sync.add_alert("info", "EcoRover sync started")
    
    # Start synchronization
    sync.start()
    
    logger.info("Sync stopped.")

if __name__ == "__main__":
    main()

