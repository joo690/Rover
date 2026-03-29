# Quick Start Guide - Firebase Latency Test

## 🚀 3-Step Setup

### Step 1: Install Dependencies

**Windows:**
```powershell
python -m pip install firebase-admin
```

**Linux/Mac:**
```bash
pip install firebase-admin
```

### Step 2: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings > Service Accounts > Generate New Private Key
3. Save as `firebase-service-account.json` in this folder

### Step 3: Run

**Windows:**
```bash
python firebase_latency_test.py
```

**Linux/Mac:**
```bash
python3 firebase_latency_test.py
```

## 📊 How It Works

1. **Select Data Type**: Choose dashboard, navigation, energy, bins, or alerts
2. **Enter Data**: Type sensor values (simulating Raspberry Pi input)
3. **Press Enter**: Submit data and measure latency
4. **View Result**: See latency in milliseconds

## ⏱️ What Gets Measured

The script measures the **round-trip latency**:
- **Submit Time**: When you press Enter (high-precision timestamp)
- **Firebase Write**: Data sent to Firebase Realtime Database
- **Update Detection**: When the update appears in the database
- **Latency**: Time difference in milliseconds

## 🎯 Expected Latency

- **Good connection**: 50-200ms
- **Average connection**: 100-300ms
- **Slow connection**: 300-500ms+

## 🔧 Troubleshooting

**"Service account file not found"**
- Place `firebase-service-account.json` in the same folder as the script

**"Firebase initialization failed"**
- Check your internet connection
- Verify service account JSON is valid
- Update database URL in the script (line 40)

**High latency (>1000ms)**
- Check internet speed
- Verify Firebase database region
- Check for network issues

## 📝 Example

```
Select data type (0-5): 1

📊 Dashboard Data Input
System Readiness (0-100): 95
Temperature (°C): 32

Press Enter to submit: 

⏱️  Testing latency...

======================================================================
✅ LATENCY TEST RESULT
======================================================================
   ⏱️  LATENCY: 142.35 ms
======================================================================
```

That's it! You're ready to test Firebase latency. 🎉

