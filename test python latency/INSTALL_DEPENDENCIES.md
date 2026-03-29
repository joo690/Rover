# Installing Dependencies - Troubleshooting Guide

## 🔍 Problem: `pip` command not recognized

If you see `pip : The term 'pip' is not recognized`, here are solutions:

## ✅ Solution 1: Use `python -m pip` (Recommended)

This always works if Python is installed:

```powershell
python -m pip install firebase-admin
```

## ✅ Solution 2: Use `py` launcher

If you have Python Launcher installed:

```powershell
py -m pip install firebase-admin
```

## ✅ Solution 3: Install pip first

If `python -m pip` doesn't work, pip might not be installed:

### For Python 3.4+:
```powershell
python -m ensurepip --upgrade
```

Then try:
```powershell
python -m pip install firebase-admin
```

### Manual pip installation:
1. Download `get-pip.py` from: https://bootstrap.pypa.io/get-pip.py
2. Run: `python get-pip.py`
3. Then: `python -m pip install firebase-admin`

## ✅ Solution 4: Use full Python path

If Python is installed but not in PATH:

```powershell
# Find Python location first
where python

# Then use full path (example):
C:\Python311\python.exe -m pip install firebase-admin
```

## ✅ Solution 5: Install via Python installer

1. Download Python from [python.org](https://www.python.org/downloads/)
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Check "Install pip" option
4. After installation, restart PowerShell
5. Try: `python -m pip install firebase-admin`

## 🔧 Verify Installation

After installing, verify:

```powershell
python -m pip list
```

You should see `firebase-admin` in the list.

## 📝 Common Issues

### Issue: "No module named pip"
**Solution**: Install pip using `python -m ensurepip --upgrade`

### Issue: "Python is not recognized"
**Solution**: 
- Reinstall Python with "Add to PATH" checked
- Or use full path to python.exe

### Issue: "Permission denied"
**Solution**: 
- Run PowerShell as Administrator
- Or use: `python -m pip install --user firebase-admin`

## 🎯 Quick Test

After installation, test with:

```powershell
python -c "import firebase_admin; print('✅ firebase-admin installed successfully!')"
```

If you see the success message, you're ready to run the latency test!

