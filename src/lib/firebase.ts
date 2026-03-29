import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

// Firebase configuration
// These should be set in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase config
const isConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let database: Database | null = null;

try {
  if (isConfigValid()) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("✅ Firebase initialized successfully");
    } else {
      app = getApps()[0];
    }
    // Initialize Realtime Database
    database = getDatabase(app);
    console.log("✅ Firebase Realtime Database connected:", firebaseConfig.databaseURL);
  } else {
    console.warn("⚠️ Firebase configuration is missing. Please check your .env file.");
    console.warn("Config values:", {
      apiKey: firebaseConfig.apiKey ? "✅" : "❌",
      authDomain: firebaseConfig.authDomain ? "✅" : "❌",
      databaseURL: firebaseConfig.databaseURL ? "✅" : "❌",
      projectId: firebaseConfig.projectId ? "✅" : "❌",
    });
    console.warn("The app will work with default data, but Firebase features will be disabled.");
  }
} catch (error) {
  console.error("❌ Error initializing Firebase:", error);
  console.warn("The app will work with default data, but Firebase features will be disabled.");
}

export { database };
export default app;

