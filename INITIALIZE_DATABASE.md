# How to Initialize Firebase Database

## 🚀 Quick Steps to Add Data to Firebase

Your Firebase database is empty, so you need to initialize it with data. Here's how:

### Method 1: Using the Web Interface (Easiest) ⭐

1. **Make sure your dev server is running:**
   ```bash
   npm run dev
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:8080/initialize-db
   ```

3. **Click the "Initialize Database" button**

4. **Wait for the success message**

5. **Refresh your Firebase Console** to see the data appear!

### Method 2: Using Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ecorover-1b4e2**
3. Go to **Build** → **Realtime Database**
4. Click the **+** button at the root
5. Add nodes manually (not recommended - use Method 1 instead)

## ✅ Verify Data Was Added

After initializing:

1. **Check Firebase Console:**
   - Go to Firebase Console → Realtime Database
   - You should see nodes like: `dashboard`, `bins`, `energy`, etc.

2. **Check Your App:**
   - Go to `http://localhost:8080/`
   - Dashboard should show real data instead of defaults

3. **Check Admin Page:**
   - Go to `http://localhost:8080/firebase-admin`
   - Select different paths to see the data

## 🐛 Troubleshooting

### "Firebase database is not initialized" Error

**Problem:** Firebase config is missing or incorrect

**Solution:**
1. Check your `.env` file exists in the project root
2. Verify all Firebase variables are set:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_DATABASE_URL=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. **Restart your dev server** after creating/modifying `.env`
4. Check browser console for specific errors

### "Permission denied" Error

**Problem:** Database rules don't allow write access

**Solution:**
1. Go to Firebase Console → Realtime Database → Rules
2. For development, use:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
3. Click **Publish**

### Data Not Appearing After Initialization

**Problem:** Data was written but not visible

**Solution:**
1. Refresh Firebase Console page
2. Check browser console for errors
3. Verify database URL in `.env` matches Firebase Console
4. Try initializing again

## 📊 What Data Gets Created

The initialization script creates:

- ✅ **Dashboard** - System metrics (readiness, counters, etc.)
- ✅ **Bins** - Waste bin data (plastic, organic, paper)
- ✅ **Energy** - Solar, battery, consumption data
- ✅ **Navigation** - GPS coordinates, speed, heading
- ✅ **Vision** - AI detection data and waste distribution
- ✅ **Analytics** - Zonal pollution and peak time data
- ✅ **Alerts** - Initial alert messages
- ✅ **Cloud Data** - Mission logs and error logs

## 🔄 Re-initializing

If you want to reset all data:

1. Go to `/initialize-db` page
2. Click "Initialize Database" again
3. This will overwrite existing data with defaults

## 💡 Next Steps

After initialization:

1. ✅ Your app will show real Firebase data
2. ✅ Changes in Firebase Console will reflect in your app
3. ✅ You can edit data from Firebase Console or Admin page
4. ✅ All components will update in real-time

---

**Need Help?** Check the browser console (F12) for specific error messages!

