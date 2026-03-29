# Real-time Updates Troubleshooting Guide

## ✅ Fixed Issues

I've fixed the real-time listener implementation. The hooks now properly:
- Use the unsubscribe function returned by `onValue`
- Handle errors correctly
- Log updates to console for debugging

## 🔍 How to Verify Real-time Updates Work

### Step 1: Check Browser Console

1. Open your app: `http://localhost:8080`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. You should see:
   - `✅ Firebase initialized successfully`
   - `✅ Firebase Realtime Database connected: [your-database-url]`
   - `✅ Real-time update received for [path]: [data]`

### Step 2: Test Real-time Updates

1. **Open Firebase Console:**
   - Go to https://console.firebase.google.com/
   - Select your project → Realtime Database

2. **Make a change:**
   - Navigate to `dashboard` → `systemReadiness`
   - Change the value (e.g., from 94 to 98)
   - Click outside to save

3. **Check your app:**
   - The value should update **immediately** without refreshing
   - Check browser console for: `✅ Real-time update received for dashboard: {...}`

### Step 3: Use the Status Component

A status indicator appears in the bottom-right corner showing:
- ✅ Firebase connection status
- 🔄 Last update time
- Test button to verify real-time

## 🐛 Common Issues

### Issue 1: Updates Not Appearing

**Symptoms:** Changes in Firebase Console don't reflect in app

**Solutions:**
1. **Check Firebase is connected:**
   - Look at browser console for initialization messages
   - Check the status indicator (bottom-right)

2. **Verify database rules:**
   - Go to Firebase Console → Realtime Database → Rules
   - Should be:
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```

3. **Check browser console for errors:**
   - Look for red error messages
   - Check Network tab for failed requests

4. **Verify .env file:**
   - Make sure `.env` exists in project root
   - Restart dev server after creating/modifying `.env`

### Issue 2: "Firebase not initialized" Warning

**Solution:**
1. Create `.env` file with Firebase config
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Check console for initialization messages

### Issue 3: Listeners Not Working

**Symptoms:** No console logs for updates

**Solutions:**
1. **Check the path:**
   - Make sure you're editing the correct path in Firebase
   - Path should match what's in your code (e.g., `dashboard`, `bins`, etc.)

2. **Verify listener is active:**
   - Check browser console for listener setup messages
   - Look for `✅ Real-time update received` messages

3. **Refresh the page:**
   - Sometimes listeners need to reconnect
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## 🔧 Debugging Steps

### Enable Detailed Logging

The hooks now log to console:
- `✅ Real-time update received for [path]: [data]` - Update received
- `⚠️ Firebase not initialized` - Config missing
- `❌ Error listening to Firebase path` - Connection error

### Test Real-time Connection

1. Open browser console
2. Make a change in Firebase Console
3. Watch for console messages
4. Check if UI updates automatically

### Manual Test

You can test by writing to Firebase from your app:

```typescript
import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

// Test write
const testRef = ref(database, "testConnection");
await set(testRef, { timestamp: Date.now(), test: true });
```

Then check if other components listening to `testConnection` update.

## 📊 What Should Happen

When you change data in Firebase Console:

1. **Immediate:** Browser console shows update message
2. **Immediate:** UI component updates (no refresh needed)
3. **Immediate:** Status indicator shows last update time

## ✅ Verification Checklist

- [ ] Firebase initialized (check console)
- [ ] Database connected (check console)
- [ ] Status indicator shows "Connected" (bottom-right)
- [ ] Console shows "Real-time update received" when you change data
- [ ] UI updates without page refresh
- [ ] No errors in browser console
- [ ] Database rules allow read/write

## 🚀 Quick Test

1. Open your app dashboard
2. Open Firebase Console → Realtime Database
3. Change `dashboard/systemReadiness` from 94 to 99
4. **Watch your app** - it should update immediately!

If it doesn't update:
- Check browser console for errors
- Verify Firebase is connected (status indicator)
- Make sure you restarted the server after creating `.env`

---

**Still not working?** Check the browser console (F12) and share any error messages you see!

