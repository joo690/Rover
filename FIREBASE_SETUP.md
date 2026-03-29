# Firebase Realtime Database Setup Guide

This project uses Firebase Realtime Database to store and sync all data in real-time. Follow these steps to set up Firebase for your EcoRover project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Realtime Database

1. In your Firebase project, go to **Build** > **Realtime Database**
2. Click **Create Database**
3. Choose your database location (select the closest region)
4. Start in **test mode** for development (you can secure it later)
5. Click **Enable**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. If you don't have a web app, click **Add app** > **Web** (</> icon)
4. Register your app with a nickname (e.g., "EcoRover Web")
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Step 5: Install Firebase SDK

If not already installed, run:
```bash
npm install firebase
```

## Step 6: Database Structure

The Firebase Realtime Database uses the following structure:

```
{
  "dashboard": {
    "systemReadiness": 94,
    "motors": 98,
    "ai": 96,
    "power": 87,
    "wasteItemsCollected": 1247,
    "detectionRate": 98.7,
    "cpuLoad": 42,
    "temperature": 32,
    "uptime": 4.2,
    "distance": 847,
    "powerOutput": 155
  },
  "bins": {
    "plastic": {
      "type": "Plastic",
      "level": 67,
      "mass": 2.4,
      "color": "bg-ai-cyan",
      "bgColor": "border-ai-cyan/30 bg-ai-cyan/5",
      "icon": "♻️",
      "lastEmpty": "4h ago",
      "timestamp": 1234567890
    },
    "organic": { ... },
    "paper": { ... }
  },
  "energy": {
    "solarInput": 340,
    "consumption": 185,
    "netPower": 155,
    "batteryLevel": 87,
    "batteryTemp": 32,
    "isCharging": true,
    "solarHistory": [ ... ],
    "batteryHistory": [ ... ],
    "thermalMap": [ ... ],
    "autonomy": 8.5,
    "generatedToday": 2.4,
    "consumedToday": 1.8
  },
  "navigation": {
    "latitude": 31.2156,
    "longitude": 29.9553,
    "speed": 1.2,
    "heading": 45,
    "totalDistance": 847,
    "pathEfficiency": 94,
    "currentZone": "A-3",
    "plannedPath": [ ... ],
    "actualPath": [ ... ],
    "obstacles": [ ... ]
  },
  "vision": {
    "wasteTypeDistribution": [ ... ],
    "recentDetections": [ ... ],
    "totalDetections": 1247,
    "accuracy": 98.7
  },
  "alerts": {
    "alert-id-1": {
      "id": "alert-id-1",
      "type": "success",
      "message": "Waste item collected",
      "time": "12s ago",
      "timestamp": 1234567890
    }
  },
  "analytics": {
    "zonalData": [ ... ],
    "peakTimeData": [ ... ]
  },
  "cloudData": {
    "missionLogs": { ... },
    "errorLogs": { ... }
  }
}
```

## Step 7: Initialize Database with Sample Data

You can manually add initial data through the Firebase Console, or use the Firebase service functions in `src/services/firebaseService.ts` to programmatically set initial values.

## Step 8: Security Rules (Important for Production)

For development, test mode allows read/write access. For production, update your Realtime Database rules:

1. Go to **Realtime Database** > **Rules**
2. Update rules based on your security needs:

```json
{
  "rules": {
    ".read": "auth != null",  // Only authenticated users can read
    ".write": "auth != null"   // Only authenticated users can write
  }
}
```

Or for public read-only access (not recommended for production):
```json
{
  "rules": {
    ".read": true,
    ".write": false
  }
}
```

## Step 9: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Check the browser console for any Firebase connection errors
4. Verify data is loading from Firebase (check Network tab)

## Troubleshooting

### "Firebase: Error (auth/network-request-failed)"
- Check your internet connection
- Verify your Firebase configuration values are correct
- Ensure your database URL is correct

### "Permission denied"
- Check your Realtime Database rules
- Ensure you're using the correct database URL
- Verify your Firebase project is active

### Data not updating
- Check that you're using `useRealtimeData` hook correctly
- Verify the database path matches your Firebase structure
- Check browser console for errors

## Next Steps

- Set up Firebase Authentication if you need user authentication
- Configure Firebase Storage if you need file uploads
- Set up proper security rules for production
- Consider using Firebase Cloud Functions for server-side logic

## Support

For more information, visit:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)

