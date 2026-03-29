# Raspberry Pi Firebase Sync Setup Guide

This guide explains how to set up and run the Raspberry Pi Firebase synchronization script on your EcoRover Raspberry Pi.

## Prerequisites

- Raspberry Pi with Raspberry Pi OS (or compatible Linux distribution)
- Python 3.7 or higher
- Internet connection
- Firebase project with Realtime Database enabled
- Firebase service account credentials

## Step 1: Install Python Dependencies

```bash
# Install required Python packages
pip3 install -r raspberry_pi_requirements.txt

# Or install directly:
pip3 install firebase-admin
```

## Step 2: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g., `ecorover-1b4e2`)
3. Navigate to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Rename it to `firebase-service-account.json`
7. Place it in the same directory as `raspberry_pi_firebase_sync.py`

**⚠️ Security Warning**: Never commit the service account JSON file to version control. Add it to `.gitignore`.

## Step 3: Configure Database URL

Edit `raspberry_pi_firebase_sync.py` and update the `FIREBASE_DATABASE_URL`:

```python
FIREBASE_DATABASE_URL = "https://your-project-id-default-rtdb.firebaseio.com/"
```

Or set it as an environment variable:

```bash
export FIREBASE_DATABASE_URL="https://your-project-id-default-rtdb.firebaseio.com/"
```

## Step 4: Test the Script

Run the script to test the connection:

```bash
python3 raspberry_pi_firebase_sync.py
```

You should see:
- ✅ Firebase initialized
- ✅ Firebase connection established
- ✅ All sync threads started

Check your Firebase Console to verify data is being written.

## Step 5: Run as a Service (Production)

To run the script automatically on boot, create a systemd service:

### Create Service File

```bash
sudo nano /etc/systemd/system/ecorover-sync.service
```

Add the following content (adjust paths as needed):

```ini
[Unit]
Description=EcoRover Firebase Sync Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/EcoRover
ExecStart=/usr/bin/python3 /home/pi/EcoRover/raspberry_pi_firebase_sync.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable ecorover-sync.service

# Start the service
sudo systemctl start ecorover-sync.service

# Check status
sudo systemctl status ecorover-sync.service

# View logs
sudo journalctl -u ecorover-sync.service -f
```

## Step 6: Integrate Real Sensors

The script currently uses simulated data. To integrate real sensors:

### GPS Module (NEO-6M, NEO-8M)

```python
import serial
import pynmea2

def read_gps():
    ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)
    line = ser.readline().decode('ascii', errors='ignore')
    if line.startswith('$GPRMC'):
        msg = pynmea2.parse(line)
        return {
            "latitude": msg.latitude,
            "longitude": msg.longitude,
            "speed": msg.spd_over_grnd * 1.852,  # knots to km/h
            "heading": msg.true_course
        }
```

### Temperature Sensors (DS18B20)

```python
def read_temperature(sensor_id):
    sensor_path = f'/sys/bus/w1/devices/{sensor_id}/w1_slave'
    with open(sensor_path, 'r') as f:
        lines = f.readlines()
        temp_line = lines[1]
        temp_data = temp_line.split('=')[1]
        return float(temp_data) / 1000.0
```

### Load Cells / Ultrasonic Sensors (Bin Levels)

```python
import RPi.GPIO as GPIO
import time

def read_bin_level(trigger_pin, echo_pin):
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(trigger_pin, GPIO.OUT)
    GPIO.setup(echo_pin, GPIO.IN)
    
    GPIO.output(trigger_pin, False)
    time.sleep(0.00001)
    GPIO.output(trigger_pin, True)
    time.sleep(0.00001)
    GPIO.output(trigger_pin, False)
    
    while GPIO.input(echo_pin) == 0:
        pulse_start = time.time()
    
    while GPIO.input(echo_pin) == 1:
        pulse_end = time.time()
    
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # cm
    level = max(0, min(100, 100 - (distance / max_distance * 100)))
    
    return level
```

### Object Detection (Camera + AI)

```python
import cv2
import numpy as np

def detect_waste_items():
    # Load your trained model (YOLO, TensorFlow Lite, etc.)
    # Capture image from camera
    # Run inference
    # Return detections
    pass
```

## Performance Optimization

The script is optimized for low latency:

1. **Change Detection**: Only sends data when values change significantly
2. **Batched Updates**: Groups related updates together
3. **Threading**: Parallel updates for different data categories
4. **Efficient Firebase Calls**: Uses `update()` instead of `set()` to minimize writes
5. **Connection Pooling**: Reuses Firebase connections

## Monitoring

### View Logs

```bash
# Real-time logs
tail -f ecorover_sync.log

# Systemd service logs
sudo journalctl -u ecorover-sync.service -f
```

### Check Firebase Data

1. Open Firebase Console
2. Navigate to Realtime Database
3. Watch data update in real-time

### Health Check

The script logs connection status and update success. Monitor for:
- Connection failures
- Update errors
- Sensor read errors

## Troubleshooting

### "Service account file not found"

- Ensure `firebase-service-account.json` is in the same directory as the script
- Check file permissions: `chmod 600 firebase-service-account.json`

### "Permission denied" errors

- Check Firebase Realtime Database rules allow writes
- Verify service account has proper permissions

### Connection timeouts

- Check internet connection
- Verify database URL is correct
- Check firewall settings

### High CPU usage

- Adjust `UPDATE_INTERVALS` to reduce update frequency
- Increase `CHANGE_THRESHOLDS` to reduce unnecessary updates

## Security Best Practices

1. **Never commit service account JSON** to version control
2. **Use environment variables** for sensitive configuration
3. **Restrict file permissions**: `chmod 600 firebase-service-account.json`
4. **Use Firebase Security Rules** to restrict access
5. **Rotate service account keys** periodically

## Next Steps

- Integrate real sensor hardware
- Add error recovery mechanisms
- Implement data validation
- Set up monitoring and alerting
- Configure backup and recovery

## Support

For issues or questions:
- Check Firebase Console for database errors
- Review logs: `ecorover_sync.log`
- Verify service account permissions
- Test Firebase connection manually

