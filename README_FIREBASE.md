# Firebase Realtime Database Integration

## ✅ What's Been Done

All dummy/mock data in the EcoRover project has been replaced with Firebase Realtime Database integration. The application now uses real-time data synchronization from Firebase.

## 📦 Installation

First, install the Firebase SDK:

```bash
npm install firebase
```

## 🔧 Setup Steps

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one

2. **Enable Realtime Database**
   - Navigate to Build > Realtime Database
   - Create database in test mode (for development)

3. **Get Configuration**
   - Go to Project Settings > General
   - Copy your Firebase config values

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration values

5. **Start the App**
   ```bash
   npm run dev
   ```

## 📁 Files Created/Modified

### New Files:
- `src/lib/firebase.ts` - Firebase initialization
- `src/hooks/useFirebaseData.ts` - Custom hooks for Firebase data
- `src/services/firebaseService.ts` - Service functions for database operations
- `FIREBASE_SETUP.md` - Detailed setup guide
- `.env.example` - Environment variables template

### Modified Files:
- `src/pages/Dashboard.tsx` - Now uses Firebase data
- `src/pages/Storage.tsx` - Bin data from Firebase
- `src/pages/Energy.tsx` - Energy metrics from Firebase
- `src/pages/Navigation.tsx` - Navigation data from Firebase
- `src/pages/Vision.tsx` - Vision/AI data from Firebase
- `src/pages/Analytics.tsx` - Analytics data from Firebase
- `src/pages/CloudData.tsx` - Mission logs and error logs from Firebase
- `src/components/dashboard/AlertsFeed.tsx` - Real-time alerts from Firebase
- `src/components/dashboard/BinLevelsCompact.tsx` - Bin levels from Firebase
- `src/components/dashboard/EnergyMini.tsx` - Energy status from Firebase
- `src/components/dashboard/MiniMap.tsx` - Navigation data from Firebase
- `package.json` - Added Firebase dependency

## 🗄️ Database Structure

The Firebase Realtime Database uses this structure:

```
/
├── dashboard/          # System metrics and status
├── bins/               # Waste bin levels and data
├── energy/             # Energy management data
├── navigation/         # GPS and navigation data
├── vision/             # AI vision and detection data
├── alerts/             # Real-time alerts feed
├── analytics/          # Analytics and insights
└── cloudData/          # Mission logs and error logs
    ├── missionLogs/
    └── errorLogs/
```

## 🔄 Real-time Updates

All components use the `useRealtimeData` hook which automatically:
- Subscribes to Firebase data changes
- Updates the UI in real-time when data changes
- Handles loading states
- Provides fallback default values

## 📝 Usage Example

```typescript
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { DB_PATHS } from "@/services/firebaseService";
import type { DashboardData } from "@/services/firebaseService";

const defaultData: DashboardData = { /* defaults */ };

function MyComponent() {
  const [data, loading] = useRealtimeData<DashboardData>(
    DB_PATHS.DASHBOARD,
    defaultData
  );
  
  // data is automatically updated when Firebase changes
  return <div>{data.systemReadiness}%</div>;
}
```

## 🛠️ Service Functions

Use `firebaseService` to write/update data:

```typescript
import { firebaseService } from "@/services/firebaseService";

// Update dashboard data
await firebaseService.updateDashboardData({
  systemReadiness: 95,
  wasteItemsCollected: 1300
});

// Add a new alert
await firebaseService.addAlert({
  type: "success",
  message: "Item collected successfully",
  time: "just now"
});
```

## 🔒 Security

**Important**: Update your Firebase Realtime Database rules for production:

1. Go to Realtime Database > Rules
2. Set appropriate read/write rules
3. Consider adding authentication

For development, test mode allows full access.

## 📚 Documentation

See `FIREBASE_SETUP.md` for detailed setup instructions.

## 🐛 Troubleshooting

- **Connection errors**: Verify your `.env` file has correct Firebase config
- **Permission denied**: Check your database rules
- **Data not updating**: Ensure database paths match your Firebase structure

## 🚀 Next Steps

1. Install Firebase: `npm install firebase`
2. Set up your Firebase project (see `FIREBASE_SETUP.md`)
3. Configure `.env` with your Firebase credentials
4. Initialize your database with sample data
5. Start the app and verify real-time updates work

