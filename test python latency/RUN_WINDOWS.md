# Running on Windows - Quick Guide

## ✅ Correct Way to Run on Windows

### Option 1: Using `py` launcher (Recommended - You have this!)
```powershell
cd "test python latency"
py firebase_latency_test.py
```

### Option 2: Using `python` command
```powershell
cd "test python latency"
python firebase_latency_test.py
```

**Note**: If `python` points to MSYS2 Python (which doesn't have pip), use `py` instead.

### Option 3: Direct path (if Python is in PATH)
```powershell
python "test python latency\firebase_latency_test.py"
```

## ❌ What NOT to Do

**Don't use Unix-style commands in PowerShell:**
```powershell
# ❌ This won't work on Windows:
/usr/bin/env python3 firebase_latency_test.py
```

## 🔧 If `python` Command Not Found

1. **Check Python is installed:**
   ```powershell
   python --version
   ```
   Should show: `Python 3.x.x`

2. **If not found, try:**
   ```powershell
   py --version
   ```

3. **If still not found:**
   - Install Python from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation

## 📝 Example Session

```powershell
PS C:\Users\ayman\OneDrive\Documents\EcoRover> cd "test python latency"
PS C:\Users\ayman\OneDrive\Documents\EcoRover\test python latency> python firebase_latency_test.py

======================================================================
Firebase Realtime Database Latency Test
======================================================================
...
```

## 📦 Installing Dependencies

If `pip` command is not recognized, use:
```powershell
python -m pip install firebase-admin
```

This uses Python's built-in pip module, which always works.

## 🎯 Quick Test

To verify everything works:
```powershell
python firebase_latency_test.py
```

You should see the Firebase initialization message and menu.

