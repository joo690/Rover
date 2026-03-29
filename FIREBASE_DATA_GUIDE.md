# Firebase Data Management Guide

## 📊 Viewing Your Firebase Data

### Option 1: Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account
   - Select your project: **ecorover-1b4e2**

2. **Navigate to Realtime Database**
   - Click **Build** in the left sidebar
   - Click **Realtime Database**
   - You'll see your database structure as a tree

3. **View Data**
   - Click any node to expand and see its data
   - Data appears in JSON format
   - Use the search bar to find specific keys

4. **Edit Data**
   - Click the **+** button to add a new child node
   - Click any field to edit its value
   - Click the **trash icon** to delete
   - Click **Save** when done

### Option 2: Built-in Admin Page

1. **Start your app**
   ```bash
   npm run dev
   ```

2. **Open Admin Page**
   - Go to: `http://localhost:8080/firebase-admin`
   - Select a database path from the buttons
   - View data in JSON format
   - Click "Edit Data" to modify

3. **Edit Data**
   - Click "Edit Data" button
   - Modify the JSON in the text area
   - Click "Save Changes"
   - ⚠️ Make sure JSON is valid!

## 🔧 Modifying Data

### Method 1: Firebase Console (Easiest)

1. Open Firebase Console → Realtime Database
2. Navigate to the node you want to modify
3. Click the field to edit
4. Enter new value
5. Click outside or press Enter to save

**Example: Update Dashboard System Readiness**
- Navigate to: `dashboard` → `systemReadiness`
- Change value from `94` to `98`
- Save automatically

### Method 2: Using Code (Programmatic)

You can use the `firebaseService` in your code:

```typescript
import { firebaseService } from "@/services/firebaseService";

// Update dashboard data
await firebaseService.updateDashboardData({
  systemReadiness: 98,
  wasteItemsCollected: 1500
});

// Update bin level
await firebaseService.updateBin("plastic", {
  level: 75,
  mass: 3.2
});

// Add a new alert
await firebaseService.addAlert({
  type: "success",
  message: "New item collected",
  time: "just now"
});
```

### Method 3: Direct Firebase SDK

```typescript
import { ref, set, update } from "firebase/database";
import { database } from "@/lib/firebase";

// Set entire node
await set(ref(database, "dashboard/systemReadiness"), 98);

// Update specific fields
await update(ref(database, "dashboard"), {
  systemReadiness: 98,
  wasteItemsCollected: 1500
});
```

## 📁 Database Structure

Your Firebase database has this structure:

```
/
├── dashboard/
│   ├── systemReadiness: 94
│   ├── motors: 98
│   ├── ai: 96
│   ├── wasteItemsCollected: 1247
│   └── ...
│
├── bins/
│   ├── plastic/
│   │   ├── type: "Plastic"
│   │   ├── level: 67
│   │   ├── mass: 2.4
│   │   └── ...
│   ├── organic/
│   └── paper/
│
├── energy/
│   ├── solarInput: 340
│   ├── batteryLevel: 87
│   ├── solarHistory: [...]
│   └── ...
│
├── navigation/
│   ├── latitude: 31.2156
│   ├── longitude: 29.9553
│   ├── speed: 1.2
│   └── ...
│
├── vision/
│   ├── totalDetections: 1247
│   ├── accuracy: 98.7
│   └── ...
│
├── alerts/
│   ├── alert1: {...}
│   ├── alert2: {...}
│   └── ...
│
├── analytics/
│   ├── zonalData: [...]
│   └── peakTimeData: [...]
│
└── cloudData/
    ├── missionLogs/
    └── errorLogs/
```

## 🎯 Common Operations

### Add New Data

**In Firebase Console:**
1. Navigate to parent node
2. Click **+** button
3. Enter key name
4. Enter value
5. Save

**In Code:**
```typescript
await firebaseService.addAlert({
  type: "info",
  message: "System update",
  time: "just now"
});
```

### Update Existing Data

**In Firebase Console:**
- Click the field → Edit → Save

**In Code:**
```typescript
await firebaseService.updateDashboardData({
  systemReadiness: 95
});
```

### Delete Data

**In Firebase Console:**
- Click the **trash icon** next to the node
- Confirm deletion

**In Code:**
```typescript
import { ref, remove } from "firebase/database";
await remove(ref(database, "alerts/alert1"));
```

## 🔒 Security Rules

**Current (Development):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**For Production:**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## 💡 Tips

1. **Backup Before Major Changes**
   - Export data from Firebase Console
   - Go to Database → Export JSON

2. **Use Firebase Console for Bulk Edits**
   - Easier to see structure
   - Better for complex nested data

3. **Use Code for Automated Updates**
   - Real-time updates
   - Scheduled changes
   - Integration with other systems

4. **Validate JSON**
   - Always check JSON syntax before saving
   - Use JSON validators online if needed

5. **Monitor Changes**
   - Firebase Console shows real-time updates
   - Watch for unexpected changes

## 🐛 Troubleshooting

### "Permission denied"
- Check your database rules
- Ensure you're authenticated (if using auth rules)

### Changes not appearing
- Refresh the page
- Check browser console for errors
- Verify database path is correct

### Data not saving
- Check JSON validity
- Verify Firebase connection
- Check browser console for errors

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Admin Page in App](/firebase-admin)

