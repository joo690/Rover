# Firebase Realtime Database Latency Test

This script simulates Raspberry Pi sensor data input and measures the latency between submitting data to Firebase Realtime Database and receiving the update confirmation.

## 🎯 Purpose

This tool tests the real-time performance of your Firebase Realtime Database by:
1. Accepting manual sensor data input (simulating Raspberry Pi)
2. Recording high-precision timestamp when data is submitted
3. Sending data to Firebase using firebase-admin SDK
4. Listening for the database update in real-time
5. Measuring and displaying latency in milliseconds

## 📋 Prerequisites

- Python 3.7 or higher
- Firebase project with Realtime Database enabled
- Firebase service account credentials (JSON file)

## 🚀 Quick Start

### Step 1: Install Dependencies

**On Windows:**
```powershell
python -m pip install firebase-admin
```

Or using the requirements file:
```powershell
python -m pip install -r requirements.txt
```

**On Linux/Mac:**
```bash
pip install firebase-admin
# OR
pip3 install firebase-admin
```

### Step 2: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Rename it to `firebase-service-account.json`
7. Place it in the same directory as `firebase_latency_test.py`

**⚠️ Security**: Never commit the service account JSON file to version control!

### Step 3: Configure Database URL (Optional)

The script uses the database URL from the environment variable or defaults to:
```
https://ecorover-1b4e2-default-rtdb.firebaseio.com/
```

To use a different database URL, either:
- Edit line 40 in `firebase_latency_test.py`
- Or set environment variable: `set FIREBASE_DATABASE_URL=your-url-here` (Windows)

### Step 4: Run the Script

**On Windows (PowerShell or Command Prompt):**
```bash
python firebase_latency_test.py
```

Or if that doesn't work:
```bash
py firebase_latency_test.py
```

**On Linux/Mac:**
```bash
python3 firebase_latency_test.py
```

## 📊 How It Works

### 1. Data Input Simulation

The script prompts you to enter sensor data manually, simulating what a Raspberry Pi would send:

- **Dashboard**: System metrics (readiness, motors, AI status, temperature, CPU load)
- **Navigation**: GPS data (latitude, longitude, speed, heading)
- **Energy**: Power data (solar input, battery level, consumption)
- **Bins**: Waste bin levels (plastic, organic, paper)
- **Alerts**: Real-time notifications

### 2. Latency Measurement

1. **Submit Timestamp**: Records high-precision timestamp (`time.perf_counter()`) when you press Enter
2. **Firebase Write**: Sends data to Firebase using `firebase-admin` SDK
3. **Real-time Detection**: Polls the database every 10ms to detect when the update appears
4. **Latency Calculation**: Measures time difference between submit and detection
5. **Result Display**: Shows latency in milliseconds

### 3. Real-Time Behavior

The script uses a polling mechanism with 10ms intervals to detect updates, simulating real-time listener behavior. This accurately measures the round-trip latency:
- **Submit** → Firebase write operation
- **Firebase processing** → Database update
- **Detection** → Polling detects the update

## 📈 Expected Results

Typical latency measurements:
- **Local network**: 50-150ms
- **Same region**: 100-300ms
- **Cross-region**: 200-500ms
- **Poor connection**: 500ms+

## 🔧 Technical Details

### Database Paths

The script uses the exact database paths from your project:
- `dashboard/` - System metrics
- `navigation/` - GPS and navigation data
- `energy/` - Energy management data
- `bins/{type}/` - Waste bin data (plastic, organic, paper)
- `alerts/` - Real-time alerts

### Precision

- Uses `time.perf_counter()` for high-precision timestamps
- Polls every 10ms for fast detection
- Measures latency in milliseconds with 2 decimal places

### Error Handling

- Validates Firebase connection before testing
- Handles network errors gracefully
- Provides clear error messages
- Timeout protection (5 seconds max wait)

## 🎓 How This Simulates Raspberry Pi Behavior

This script accurately simulates the Raspberry Pi → Firebase data flow:

1. **Sensor Reading**: Manual input simulates sensor data collection
2. **Data Preparation**: Data is formatted according to your Firebase schema
3. **Network Transmission**: Uses the same firebase-admin SDK as production
4. **Real-time Sync**: Detects updates just like your website would
5. **Latency Measurement**: Measures the actual round-trip time

The only difference is the input method (manual vs. actual sensors), but the Firebase communication and latency measurement are identical to production.

## 🐛 Troubleshooting

### "Service account file not found"

- Ensure `firebase-service-account.json` is in the same directory as the script
- Check file name spelling (case-sensitive)
- Verify file permissions

### "Firebase initialization failed"

- Check service account JSON is valid
- Verify database URL is correct
- Ensure internet connection is active
- Check Firebase project is active

### "Update detection timeout"

- Check Firebase database rules allow writes
- Verify service account has proper permissions
- Check network connectivity
- Try a different data path

### High latency (>1000ms)

- Check internet connection speed
- Verify database region is close to your location
- Check for network congestion
- Consider Firebase database location optimization

## 📝 Example Usage

```
Select data type (0-5): 1

📊 Dashboard Data Input
--------------------------------------------------
System Readiness (0-100): 95
Motors Status (0-100): 98
Temperature (°C): 32
CPU Load (0-100): 45

📤 Ready to submit data to: dashboard
   Data: {
     "systemReadiness": 95,
     "motors": 98,
     "temperature": 32.0,
     "cpuLoad": 45
   }

Press Enter to submit (or 'q' to cancel): 

⏱️  Testing latency...
   Submitting data to Firebase...

======================================================================
✅ LATENCY TEST RESULT
======================================================================
   Path: dashboard
   Data: {
     "systemReadiness": 95,
     "motors": 98,
     "temperature": 32.0,
     "cpuLoad": 45
   }

   ⏱️  LATENCY: 142.35 ms
======================================================================
```

## 🔒 Security Notes

- Service account JSON contains sensitive credentials
- Never commit `firebase-service-account.json` to version control
- Use environment variables for database URL in production
- Restrict Firebase database rules for production use

## 📚 Related Files

- `firebase_latency_test.py` - Main test script
- `requirements.txt` - Python dependencies
- `README.md` - This file

## 🎯 Competition Use

This script is designed for technical competition evaluation:
- **Accurate**: Uses real Firebase SDK and database paths
- **Precise**: High-precision timing measurements
- **Realistic**: Simulates actual Raspberry Pi behavior
- **Production-ready**: Error handling and validation included

Use this to demonstrate and measure your Firebase real-time performance!

