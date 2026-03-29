"""
Firebase Realtime Database Latency Test Script
===============================================

This script simulates Raspberry Pi sensor data input and measures the latency
between submitting data to Firebase and receiving the update confirmation.

Requirements:
    - Python 3.7+
    - firebase-admin: pip install firebase-admin
    - Service account JSON file from Firebase Console

Usage (Windows):
    python firebase_latency_test.py
    OR
    py firebase_latency_test.py

Usage (Linux/Mac):
    python3 firebase_latency_test.py
"""

# Fix Windows console encoding issues
import sys
import io
if sys.platform == 'win32':
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except:
        pass  # If it fails, continue anyway

import json
import time
import os
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from queue import Queue, Empty

try:
    import firebase_admin
    from firebase_admin import credentials, db
except ImportError:
    print("ERROR: firebase-admin not installed.")
    print("Install with: pip install firebase-admin")
    sys.exit(1)

# ============================================================================
# CONFIGURATION
# ============================================================================

# Path to Firebase service account JSON file
SERVICE_ACCOUNT_PATH = Path(__file__).parent / "firebase-service-account.json"

# Firebase Realtime Database URL
# Update this with your actual database URL from Firebase Console
FIREBASE_DATABASE_URL = os.getenv(
    "FIREBASE_DATABASE_URL",
    "https://ecorover-1b4e2-default-rtdb.firebaseio.com/"  # Update with your URL
)

# Database paths matching your project structure
# IMPORTANT: These paths must match FIREBASE_DB_PATHS in src/config/firebaseConfig.ts
# If paths change in the TypeScript config, update them here as well
DB_PATHS = {
    "dashboard": "dashboard",
    "bins": "bins",
    "energy": "energy",
    "navigation": "navigation",
    "vision": "vision",
    "alerts": "alerts",
    "cloudData": "cloudData",
}

# Polling interval for detecting updates (milliseconds)
POLL_INTERVAL_MS = 10  # Check every 10ms for high precision

# Maximum wait time for update detection (seconds)
MAX_WAIT_TIME = 5.0

# Distributed test configuration
DISTRIBUTED_DELAY_MS = 200  # Delay between subsystem updates (100-300ms recommended)

# ============================================================================
# FIREBASE INITIALIZATION
# ============================================================================

class FirebaseLatencyTester:
    """Tests Firebase Realtime Database latency."""
    
    def __init__(self):
        self.app = None
        self.ref = None
        self.initialized = False
        self.update_detected = threading.Event()
        self.detected_timestamp = None
        self.test_path = None
        self.test_value = None
        
    def initialize(self) -> bool:
        """Initialize Firebase connection."""
        try:
            if not SERVICE_ACCOUNT_PATH.exists():
                print(f"\n[ERROR] Service account file not found: {SERVICE_ACCOUNT_PATH}")
                print("\nPlease download your service account key from Firebase Console:")
                print("1. Go to Firebase Console > Project Settings > Service Accounts")
                print("2. Click 'Generate New Private Key'")
                print("3. Save as 'firebase-service-account.json' in this directory")
                return False
            
            # Check if Firebase is already initialized
            if firebase_admin._apps:
                self.app = firebase_admin.get_app()
                print("[OK] Using existing Firebase app instance")
            else:
                cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
                self.app = firebase_admin.initialize_app(
                    cred,
                    {'databaseURL': FIREBASE_DATABASE_URL}
                )
                print(f"[OK] Firebase initialized: {FIREBASE_DATABASE_URL}")
            
            self.ref = db.reference()
            self.initialized = True
            return True
            
        except Exception as e:
            print(f"[ERROR] Firebase initialization failed: {e}")
            return False
    
    def write_data(self, path: str, data: Dict[str, Any]) -> bool:
        """Write data to Firebase and return True if successful."""
        if not self.initialized:
            print("[ERROR] Firebase not initialized")
            return False
        
        try:
            ref_path = self.ref.child(path)
            ref_path.update(data)
            return True
        except Exception as e:
            print(f"[ERROR] Write failed: {e}")
            return False
    
    def detect_update(self, path: str, test_marker: float, timeout: float = MAX_WAIT_TIME) -> Optional[float]:
        """
        Detect when an update appears in Firebase by checking for a unique test marker.
        Returns the timestamp when update was detected, or None if timeout.
        """
        self.update_detected.clear()
        self.detected_timestamp = None
        
        def poll_loop():
            """Poll the database to detect the update."""
            start_time = time.time()
            ref_path = self.ref.child(path)
            
            while not self.update_detected.is_set() and (time.time() - start_time) < timeout:
                try:
                    snapshot = ref_path.get()
                    if snapshot is not None:
                        # Check if the test marker is present
                        # The test marker is stored in a special _testMarker field
                        if isinstance(snapshot, dict) and "_testMarker" in snapshot:
                            if abs(snapshot["_testMarker"] - test_marker) < 0.0001:
                                self.detected_timestamp = time.perf_counter()
                                self.update_detected.set()
                                return
                        # Also check if the value itself matches (for single values)
                        elif isinstance(snapshot, (int, float)) and abs(snapshot - test_marker) < 0.0001:
                            self.detected_timestamp = time.perf_counter()
                            self.update_detected.set()
                            return
                    
                    time.sleep(POLL_INTERVAL_MS / 1000.0)  # Convert ms to seconds
                except Exception as e:
                    print(f"[WARNING] Polling error: {e}")
                    time.sleep(0.01)
        
        # Start polling in a separate thread
        poll_thread = threading.Thread(target=poll_loop, daemon=True)
        poll_thread.start()
        
        # Wait for update or timeout
        if self.update_detected.wait(timeout=timeout):
            return self.detected_timestamp
        else:
            return None
    
    def test_latency(self, path: str, data: Dict[str, Any]) -> Optional[float]:
        """
        Test latency: write data and measure time until update is detected.
        Returns latency in milliseconds, or None if failed.
        """
        if not self.initialized:
            print("[ERROR] Firebase not initialized")
            return None
        
        # Create a unique test marker (high-precision timestamp)
        test_marker = time.perf_counter()
        
        # Add test marker to data for detection
        test_data = data.copy() if isinstance(data, dict) else data
        if isinstance(test_data, dict):
            test_data["_testMarker"] = test_marker
        
        # Record submit timestamp (high precision) - AFTER preparing data
        submit_time = time.perf_counter()
        
        # Write data to Firebase
        if not self.write_data(path, test_data):
            return None
        
        # Detect when update appears in database
        # Check the main path for the test marker
        detected_time = self.detect_update(path, test_marker)
        
        if detected_time is None:
            print("[WARNING] Update detection timeout")
            # Clean up test marker
            try:
                cleanup_data = {"_testMarker": None}
                self.ref.child(path).update(cleanup_data)
            except:
                pass
            return None
        
        # Calculate latency in milliseconds
        latency_ms = (detected_time - submit_time) * 1000.0
        
        # Clean up test marker after detection
        try:
            cleanup_data = {"_testMarker": None}
            self.ref.child(path).update(cleanup_data)
        except:
            pass
        
        return latency_ms
    
    def test_batch_latency(self, updates: Dict[str, Dict[str, Any]]) -> Optional[Dict[str, float]]:
        """
        Test batch latency: write multiple data updates and measure time until all are detected.
        Returns dict with latencies for each path, or None if failed.
        
        Args:
            updates: Dict mapping paths to data dictionaries
                    Example: {"dashboard": {...}, "navigation": {...}}
        
        Returns:
            Dict with path -> latency_ms, or None if failed
        """
        if not self.initialized:
            print("[ERROR] Firebase not initialized")
            return None
        
        if not updates:
            print("[ERROR] No updates provided")
            return None
        
        # Create unique test markers for each update
        test_markers = {}
        test_data_updates = {}
        
        for path, data in updates.items():
            test_marker = time.perf_counter()
            test_markers[path] = test_marker
            
            # Add test marker to data
            test_data = data.copy() if isinstance(data, dict) else data
            if isinstance(test_data, dict):
                test_data["_testMarker"] = test_marker
            test_data_updates[path] = test_data
        
        # Record submit timestamp (high precision) - AFTER preparing all data
        submit_time = time.perf_counter()
        
        # Write all data to Firebase
        print(f"   Writing {len(updates)} updates to Firebase...")
        for path, test_data in test_data_updates.items():
            if not self.write_data(path, test_data):
                print(f"[ERROR] Failed to write to {path}")
                return None
        
        # Detect when all updates appear in database
        print(f"   Detecting updates for {len(updates)} paths...")
        latencies = {}
        all_detected = True
        
        for path, test_marker in test_markers.items():
            detected_time = self.detect_update(path, test_marker)
            if detected_time is not None:
                latency_ms = (detected_time - submit_time) * 1000.0
                latencies[path] = latency_ms
            else:
                print(f"[WARNING] Update detection timeout for {path}")
                latencies[path] = None
                all_detected = False
        
        # Clean up test markers
        print("   Cleaning up test markers...")
        for path in test_markers.keys():
            try:
                cleanup_data = {"_testMarker": None}
                self.ref.child(path).update(cleanup_data)
            except:
                pass
        
        if not all_detected and not any(latencies.values()):
            return None
        
        return latencies
    
    def test_distributed_latency(self, updates: Dict[str, Dict[str, Any]], delay_ms: float = DISTRIBUTED_DELAY_MS) -> Optional[Dict[str, float]]:
        """
        Test distributed/staggered latency: send updates one at a time with delays.
        This simulates real IoT behavior where sensors update independently.
        
        Args:
            updates: Dict mapping paths to data dictionaries
            delay_ms: Delay in milliseconds between each update (default: 200ms)
        
        Returns:
            Dict with path -> latency_ms, or None if failed
        """
        if not self.initialized:
            print("[ERROR] Firebase not initialized")
            return None
        
        if not updates:
            print("[ERROR] No updates provided")
            return None
        
        print(f"\n[DISTRIBUTED TEST] Sending {len(updates)} updates with {delay_ms}ms delay between each...")
        print("   This simulates real IoT sensor behavior where subsystems update independently.\n")
        
        latencies = {}
        submit_times = {}
        test_markers = {}
        
        # Send each update separately with delay
        for idx, (path, data) in enumerate(updates.items(), 1):
            # Create unique test marker
            test_marker = time.perf_counter()
            test_markers[path] = test_marker
            
            # Add test marker to data
            test_data = data.copy() if isinstance(data, dict) else data
            if isinstance(test_data, dict):
                test_data["_testMarker"] = test_marker
            
            # Record submit timestamp (high precision)
            submit_time = time.perf_counter()
            submit_times[path] = submit_time
            
            # Write data to Firebase
            print(f"   [{idx}/{len(updates)}] Sending to {path}...", end=" ", flush=True)
            if not self.write_data(path, test_data):
                print("[ERROR]")
                latencies[path] = None
                continue
            
            # Immediately start detecting this update (non-blocking)
            # We'll check all detections after sending all updates
            print("[SENT]")
            
            # Wait before next update (except for the last one)
            if idx < len(updates):
                time.sleep(delay_ms / 1000.0)
        
        # Now detect all updates
        print(f"\n   Detecting updates for {len(updates)} paths...")
        all_detected = True
        
        for path, test_marker in test_markers.items():
            submit_time = submit_times[path]
            detected_time = self.detect_update(path, test_marker)
            
            if detected_time is not None:
                latency_ms = (detected_time - submit_time) * 1000.0
                latencies[path] = latency_ms
                print(f"   [OK] {path}: {latency_ms:.2f} ms")
            else:
                print(f"   [TIMEOUT] {path}: Update not detected")
                latencies[path] = None
                all_detected = False
        
        # Clean up test markers
        print("\n   Cleaning up test markers...")
        for path in test_markers.keys():
            try:
                cleanup_data = {"_testMarker": None}
                self.ref.child(path).update(cleanup_data)
            except:
                pass
        
        if not all_detected and not any(latencies.values()):
            return None
        
        return latencies

# ============================================================================
# DATA INPUT FUNCTIONS
# ============================================================================

def get_dashboard_input() -> Dict[str, Any]:
    """Get dashboard data input from user."""
    print("\n[DASHBOARD] Dashboard Data Input")
    print("-" * 50)
    
    data = {}
    
    try:
        system_readiness = input("System Readiness (0-100): ").strip()
        if system_readiness:
            data["systemReadiness"] = int(system_readiness)
        
        motors = input("Motors Status (0-100): ").strip()
        if motors:
            data["motors"] = int(motors)
        
        ai = input("AI Status (0-100): ").strip()
        if ai:
            data["ai"] = int(ai)
        
        temperature = input("Temperature (°C): ").strip()
        if temperature:
            data["temperature"] = float(temperature)
        
        cpu_load = input("CPU Load (0-100): ").strip()
        if cpu_load:
            data["cpuLoad"] = int(cpu_load)
        
        waste_items = input("Waste Items Collected: ").strip()
        if waste_items:
            data["wasteItemsCollected"] = int(waste_items)
        
    except ValueError as e:
        print(f"[WARNING] Invalid input: {e}")
        return {}
    
    return data if data else None

def get_navigation_input() -> Dict[str, Any]:
    """Get navigation data input from user."""
    print("\n[NAVIGATION] Navigation Data Input")
    print("-" * 50)
    
    data = {}
    
    try:
        latitude = input("Latitude: ").strip()
        if latitude:
            data["latitude"] = float(latitude)
        
        longitude = input("Longitude: ").strip()
        if longitude:
            data["longitude"] = float(longitude)
        
        speed = input("Speed (km/h): ").strip()
        if speed:
            data["speed"] = float(speed)
        
        heading = input("Heading (0-360): ").strip()
        if heading:
            data["heading"] = int(heading)
        
    except ValueError as e:
        print(f"[WARNING] Invalid input: {e}")
        return {}
    
    return data if data else None

def get_energy_input() -> Dict[str, Any]:
    """Get energy data input from user."""
    print("\n[ENERGY] Energy Data Input")
    print("-" * 50)
    
    data = {}
    
    try:
        solar_input = input("Solar Input (W): ").strip()
        if solar_input:
            data["solarInput"] = float(solar_input)
        
        battery_level = input("Battery Level (0-100): ").strip()
        if battery_level:
            data["batteryLevel"] = int(battery_level)
        
        consumption = input("Consumption (W): ").strip()
        if consumption:
            data["consumption"] = float(consumption)
        
        is_charging = input("Is Charging (true/false): ").strip().lower()
        if is_charging:
            data["isCharging"] = is_charging == "true"
        
    except ValueError as e:
        print(f"[WARNING] Invalid input: {e}")
        return {}
    
    return data if data else None

def get_bin_input() -> Dict[str, Any]:
    """Get bin data input from user."""
    print("\n[BINS] Bin Data Input")
    print("-" * 50)
    
    bin_type = input("Bin Type (plastic/organic/paper): ").strip().lower()
    if bin_type not in ["plastic", "organic", "paper"]:
        print("[WARNING] Invalid bin type. Use: plastic, organic, or paper")
        return None
    
    data = {}
    
    try:
        level = input("Bin Level (0-100): ").strip()
        if level:
            data["level"] = int(level)
        
        mass = input("Mass (kg): ").strip()
        if mass:
            data["mass"] = float(mass)
        
    except ValueError as e:
        print(f"[WARNING] Invalid input: {e}")
        return {}
    
    return {"bin_type": bin_type, "data": data} if data else None

def get_alert_input() -> Dict[str, Any]:
    """Get alert data input from user."""
    print("\n[ALERTS] Alert Data Input")
    print("-" * 50)
    
    alert_type = input("Alert Type (success/info/warning/error): ").strip().lower()
    if alert_type not in ["success", "info", "warning", "error"]:
        print("[WARNING] Invalid alert type. Use: success, info, warning, or error")
        return None
    
    message = input("Alert Message: ").strip()
    if not message:
        print("[WARNING] Message is required")
        return None
    
    return {
        "type": alert_type,
        "message": message,
        "time": datetime.now().strftime("%H:%M:%S"),
        "timestamp": int(time.time() * 1000)
    }

def get_all_data_input() -> Dict[str, Dict[str, Any]]:
    """Get all data types input from user at once."""
    print("\n" + "=" * 70)
    print("MULTI-SUBSYSTEM DATA INPUT - Enter all sensor data")
    print("=" * 70)
    print("\nYou can skip any section by pressing Enter without entering data.")
    print("At least one data type must be provided.\n")
    
    all_updates = {}
    
    # Dashboard data
    print("\n" + "-" * 70)
    print("[DASHBOARD] Dashboard Data (Press Enter to skip)")
    print("-" * 70)
    dashboard_data = get_dashboard_input()
    if dashboard_data:
        all_updates[DB_PATHS["dashboard"]] = dashboard_data
    
    # Navigation data
    print("\n" + "-" * 70)
    print("[NAVIGATION] Navigation Data (Press Enter to skip)")
    print("-" * 70)
    nav_data = get_navigation_input()
    if nav_data:
        all_updates[DB_PATHS["navigation"]] = nav_data
    
    # Energy data
    print("\n" + "-" * 70)
    print("[ENERGY] Energy Data (Press Enter to skip)")
    print("-" * 70)
    energy_data = get_energy_input()
    if energy_data:
        all_updates[DB_PATHS["energy"]] = energy_data
    
    # Bin data (all three bins)
    print("\n" + "-" * 70)
    print("[BINS] Bin Data (Press Enter to skip each bin)")
    print("-" * 70)
    
    for bin_type in ["plastic", "organic", "paper"]:
        print(f"\n  {bin_type.upper()} Bin:")
        try:
            level = input("  Bin Level (0-100, Enter to skip): ").strip()
            if not level:
                continue
            
            mass = input("  Mass (kg, Enter to skip): ").strip()
            if not mass:
                continue
            
            bin_data = {
                "level": int(level),
                "mass": float(mass),
                "timestamp": int(time.time() * 1000)
            }
            all_updates[f"{DB_PATHS['bins']}/{bin_type}"] = bin_data
        except ValueError as e:
            print(f"  [WARNING] Invalid input for {bin_type}: {e}")
            continue
        except:
            continue
    
    # Alert data
    print("\n" + "-" * 70)
    print("[ALERTS] Alert Data (Press Enter to skip)")
    print("-" * 70)
    alert_data = get_alert_input()
    if alert_data:
        # For alerts, we'll use a timestamp-based path
        alert_path = f"{DB_PATHS['alerts']}/batch_test_{int(time.time() * 1000)}"
        all_updates[alert_path] = alert_data
    
    return all_updates

# ============================================================================
# MAIN TEST FUNCTION
# ============================================================================

def run_latency_test():
    """Main function to run latency tests."""
    print("=" * 70)
    print("Firebase Realtime Database Latency Test")
    print("=" * 70)
    print("\nThis script simulates Raspberry Pi sensor data input and measures")
    print("the latency between submitting data and receiving Firebase updates.\n")
    
    # Initialize Firebase
    tester = FirebaseLatencyTester()
    if not tester.initialize():
        return
    
    print("\n" + "=" * 70)
    print("Test Mode Selection")
    print("=" * 70)
    print("1. Single Data Type Test (one at a time)")
    print("2. BATCH Test (all data types at once - stress test)")
    print("3. DISTRIBUTED Test (staggered updates - real IoT simulation)")
    print("0. Exit")
    
    while True:
        try:
            mode = input("\nSelect test mode (0-2): ").strip()
            
            if mode == "0":
                print("\n[EXIT] Exiting...")
                break
            
            elif mode == "3":
                # DISTRIBUTED TEST MODE
                print("\n" + "=" * 70)
                print("DISTRIBUTED LATENCY TEST")
                print("=" * 70)
                print("\nThis simulates real IoT behavior where subsystems update")
                print("independently with small delays between updates.")
                print("\nBenefits:")
                print("  - Reduces network congestion")
                print("  - Allows Firebase to process updates sequentially")
                print("  - More realistic to actual Raspberry Pi sensor timing")
                print("  - Typically results in lower latency per update\n")
                
                # Get delay configuration
                delay_input = input(f"Delay between updates in ms (default {DISTRIBUTED_DELAY_MS}ms, 100-300 recommended): ").strip()
                try:
                    delay_ms = float(delay_input) if delay_input else DISTRIBUTED_DELAY_MS
                    if delay_ms < 0:
                        delay_ms = DISTRIBUTED_DELAY_MS
                except ValueError:
                    delay_ms = DISTRIBUTED_DELAY_MS
                    print(f"[INFO] Using default delay: {delay_ms}ms")
                
                # Get all data at once
                all_updates = get_all_data_input()
                
                if not all_updates:
                    print("\n[WARNING] No data provided. Skipping test.")
                    continue
                
                # Show summary
                print("\n" + "=" * 70)
                print("[DISTRIBUTED SUMMARY] Data to be sent:")
                print("=" * 70)
                for path, data in all_updates.items():
                    print(f"\n  Path: {path}")
                    print(f"  Data: {json.dumps(data, indent=4)}")
                print(f"\n  Delay between updates: {delay_ms}ms")
                print("=" * 70)
                
                # Confirm submission
                confirm = input("\nPress Enter to start distributed test (or 'q' to cancel): ").strip()
                if confirm.lower() == 'q':
                    continue
                
                # Run distributed latency test
                print("\n[TESTING] Starting DISTRIBUTED latency test...")
                
                latencies = tester.test_distributed_latency(all_updates, delay_ms)
                
                if latencies:
                    print("\n" + "=" * 70)
                    print("[SUCCESS] DISTRIBUTED LATENCY TEST RESULTS")
                    print("=" * 70)
                    
                    # Calculate statistics
                    valid_latencies = [v for v in latencies.values() if v is not None]
                    
                    if valid_latencies:
                        avg_latency = sum(valid_latencies) / len(valid_latencies)
                        min_latency = min(valid_latencies)
                        max_latency = max(valid_latencies)
                        total_time = max_latency + (len(all_updates) - 1) * delay_ms  # Total time including delays
                        
                        print(f"\n  Total Subsystems: {len(all_updates)}")
                        print(f"  Successful: {len(valid_latencies)}")
                        print(f"  Failed: {len(all_updates) - len(valid_latencies)}")
                        print(f"  Delay Between Updates: {delay_ms}ms")
                        print(f"\n  LATENCY STATISTICS:")
                        print(f"    Average: {avg_latency:.2f} ms")
                        print(f"    Minimum: {min_latency:.2f} ms")
                        print(f"    Maximum: {max_latency:.2f} ms")
                        print(f"    Total Time (with delays): {total_time:.2f} ms")
                        
                        print(f"\n  PER-SUBSYSTEM LATENCIES:")
                        for path, latency in latencies.items():
                            # Extract subsystem name for cleaner display
                            subsystem = path.split('/')[-1] if '/' in path else path
                            status = f"{latency:.2f} ms" if latency is not None else "TIMEOUT"
                            print(f"    {subsystem:20s}: {status}")
                        
                        # Assessment
                        print(f"\n  ASSESSMENT:")
                        if avg_latency < 150:
                            print(f"    [EXCELLENT] Average latency ({avg_latency:.2f} ms) is EXCELLENT")
                            print(f"    Distributed approach is working optimally!")
                        elif avg_latency < 300:
                            print(f"    [GOOD] Average latency ({avg_latency:.2f} ms) is ACCEPTABLE")
                            print(f"    Distributed approach is performing well.")
                        elif avg_latency < 500:
                            print(f"    [OK] Average latency ({avg_latency:.2f} ms) is MODERATE")
                            print(f"    Distributed approach is acceptable but could be optimized.")
                        else:
                            print(f"    [WARNING] Average latency ({avg_latency:.2f} ms) is HIGH")
                            print(f"    Check network connection and Firebase performance.")
                        
                        # Comparison note
                        print(f"\n  COMPARISON:")
                        print(f"    Distributed updates typically show 30-50% lower latency")
                        print(f"    compared to batch writes due to reduced network congestion")
                        print(f"    and sequential Firebase processing.")
                        
                        print("=" * 70)
                    else:
                        print("\n[ERROR] All updates failed to be detected.")
                        print("=" * 70)
                else:
                    print("\n[ERROR] Distributed latency test failed. Check Firebase connection and permissions.")
                
                # Ask to continue
                continue_test = input("\nRun another test? (y/n): ").strip().lower()
                if continue_test != 'y':
                    break
            
            elif mode == "2":
                # BATCH TEST MODE
                print("\n" + "=" * 70)
                print("BATCH LATENCY TEST")
                print("=" * 70)
                print("\nThis will test sending ALL data types simultaneously")
                print("to measure if batch operations cause latency issues.\n")
                
                # Get all data at once
                all_updates = get_all_data_input()
                
                if not all_updates:
                    print("\n[WARNING] No data provided. Skipping test.")
                    continue
                
                # Show summary
                print("\n" + "=" * 70)
                print("[BATCH SUMMARY] Data to be sent:")
                print("=" * 70)
                for path, data in all_updates.items():
                    print(f"\n  Path: {path}")
                    print(f"  Data: {json.dumps(data, indent=4)}")
                print("\n" + "=" * 70)
                
                # Confirm submission
                confirm = input("\nPress Enter to submit batch (or 'q' to cancel): ").strip()
                if confirm.lower() == 'q':
                    continue
                
                # Run batch latency test
                print("\n[TESTING] Testing BATCH latency...")
                print(f"   Sending {len(all_updates)} updates simultaneously...")
                
                latencies = tester.test_batch_latency(all_updates)
                
                if latencies:
                    print("\n" + "=" * 70)
                    print("[SUCCESS] BATCH LATENCY TEST RESULTS")
                    print("=" * 70)
                    
                    # Calculate statistics
                    valid_latencies = [v for v in latencies.values() if v is not None]
                    
                    if valid_latencies:
                        avg_latency = sum(valid_latencies) / len(valid_latencies)
                        min_latency = min(valid_latencies)
                        max_latency = max(valid_latencies)
                        total_latency = max_latency  # Time until last update detected
                        
                        print(f"\n  Total Updates: {len(all_updates)}")
                        print(f"  Successful: {len(valid_latencies)}")
                        print(f"  Failed: {len(all_updates) - len(valid_latencies)}")
                        print(f"\n  LATENCY STATISTICS:")
                        print(f"    Average: {avg_latency:.2f} ms")
                        print(f"    Minimum: {min_latency:.2f} ms")
                        print(f"    Maximum: {max_latency:.2f} ms")
                        print(f"    Total (last update): {total_latency:.2f} ms")
                        
                        print(f"\n  INDIVIDUAL LATENCIES:")
                        for path, latency in latencies.items():
                            status = f"{latency:.2f} ms" if latency is not None else "TIMEOUT"
                            print(f"    {path}: {status}")
                        
                        # Assessment
                        print(f"\n  ASSESSMENT:")
                        if total_latency < 200:
                            print(f"    [OK] Total latency ({total_latency:.2f} ms) is EXCELLENT")
                        elif total_latency < 500:
                            print(f"    [OK] Total latency ({total_latency:.2f} ms) is ACCEPTABLE")
                        elif total_latency < 1000:
                            print(f"    [WARNING] Total latency ({total_latency:.2f} ms) is HIGH but manageable")
                        else:
                            print(f"    [ERROR] Total latency ({total_latency:.2f} ms) is CATASTROPHIC")
                        
                        print("=" * 70)
                    else:
                        print("\n[ERROR] All updates failed to be detected.")
                        print("=" * 70)
                else:
                    print("\n[ERROR] Batch latency test failed. Check Firebase connection and permissions.")
                
                # Ask to continue
                continue_test = input("\nRun another test? (y/n): ").strip().lower()
                if continue_test != 'y':
                    break
            
            elif mode == "1":
                # SINGLE TEST MODE (original functionality)
                print("\n" + "=" * 70)
                print("Single Data Type Selection")
                print("=" * 70)
                print("1. Dashboard (system metrics)")
                print("2. Navigation (GPS data)")
                print("3. Energy (solar/battery data)")
                print("4. Bins (waste bin levels)")
                print("5. Alerts (notifications)")
                print("0. Back to main menu")
                
                choice = input("\nSelect data type (0-5): ").strip()
                
                if choice == "0":
                    continue
                
                data = None
                path = None
                
                if choice == "1":
                    data = get_dashboard_input()
                    path = DB_PATHS["dashboard"]
                elif choice == "2":
                    data = get_navigation_input()
                    path = DB_PATHS["navigation"]
                elif choice == "3":
                    data = get_energy_input()
                    path = DB_PATHS["energy"]
                elif choice == "4":
                    bin_input = get_bin_input()
                    if bin_input:
                        data = bin_input["data"]
                        path = f"{DB_PATHS['bins']}/{bin_input['bin_type']}"
                elif choice == "5":
                    data = get_alert_input()
                    if data:
                        path = f"{DB_PATHS['alerts']}/test_{int(time.time() * 1000)}"
                else:
                    print("[WARNING] Invalid choice. Please select 0-5.")
                    continue
                
                if not data:
                    print("[WARNING] No data provided. Skipping test.")
                    continue
                
                # Confirm submission
                print(f"\n[SUBMIT] Ready to submit data to: {path}")
                print(f"   Data: {json.dumps(data, indent=2)}")
                confirm = input("\nPress Enter to submit (or 'q' to cancel): ").strip()
                
                if confirm.lower() == 'q':
                    continue
                
                # Run latency test
                print("\n[TESTING] Testing latency...")
                print("   Submitting data to Firebase...")
                
                latency_ms = tester.test_latency(path, data)
                
                if latency_ms is not None:
                    print("\n" + "=" * 70)
                    print("[SUCCESS] LATENCY TEST RESULT")
                    print("=" * 70)
                    print(f"   Path: {path}")
                    print(f"   Data: {json.dumps(data, indent=2)}")
                    print(f"\n   LATENCY: {latency_ms:.2f} ms")
                    print("=" * 70)
                else:
                    print("\n[ERROR] Latency test failed. Check Firebase connection and permissions.")
                
                # Ask to continue
                continue_test = input("\nRun another test? (y/n): ").strip().lower()
                if continue_test != 'y':
                    break
            else:
                print("[WARNING] Invalid choice. Please select 0-2.")
                continue
                
        except KeyboardInterrupt:
            print("\n\n[EXIT] Interrupted by user. Exiting...")
            break
        except Exception as e:
            print(f"\n[ERROR] Error: {e}")
            import traceback
            traceback.print_exc()

# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    try:
        run_latency_test()
    except KeyboardInterrupt:
        print("\n\n👋 Exiting...")
    except Exception as e:
        print(f"\n[ERROR] Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

