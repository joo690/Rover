# Fixing MSYS2 Python - pip Installation

## 🔍 Problem

You're using MSYS2 Python (`C:\msys64\mingw64\bin\python.exe`) which doesn't include pip by default.

## ✅ Solution 1: Install pip for MSYS2 Python (Recommended)

### Step 1: Install pip using MSYS2 package manager

Open **MSYS2 terminal** (not PowerShell) and run:

```bash
pacman -S mingw-w64-x86_64-python-pip
```

Or for 32-bit:
```bash
pacman -S mingw-w64-i686-python-pip
```

### Step 2: Install firebase-admin

In MSYS2 terminal:
```bash
pip install firebase-admin
```

Or in PowerShell (after pip is installed):
```powershell
C:\msys64\mingw64\bin\python.exe -m pip install firebase-admin
```

## ✅ Solution 2: Use Standard Windows Python (Easier)

Install the standard Windows Python which includes pip:

1. Download from [python.org](https://www.python.org/downloads/)
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. After installation, restart PowerShell
4. Verify: `python --version` (should show the new Python)
5. Install: `python -m pip install firebase-admin`

## ✅ Solution 3: Use py launcher (If available)

If you have Python Launcher installed:

```powershell
py -3 -m pip install firebase-admin
```

This will use the standard Windows Python installation.

## ✅ Solution 4: Install pip manually for MSYS2

If you can't use pacman, download get-pip.py:

```powershell
# Download get-pip.py
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

# Install pip
C:\msys64\mingw64\bin\python.exe get-pip.py

# Then install firebase-admin
C:\msys64\mingw64\bin\python.exe -m pip install firebase-admin
```

## 🎯 Quick Check: Which Python are you using?

```powershell
where python
python --version
```

If it shows `C:\msys64\mingw64\bin\python.exe`, you're using MSYS2 Python.

## 💡 Recommendation

**For this project, I recommend Solution 2** (standard Windows Python) because:
- ✅ Includes pip by default
- ✅ Better compatibility with Windows
- ✅ Easier to manage packages
- ✅ Works seamlessly with PowerShell

After installing standard Windows Python, you can run:
```powershell
python firebase_latency_test.py
```

And it will use the standard Python instead of MSYS2 Python.

