import { useState, useEffect, useRef } from "react";
import { ref, onValue, DataSnapshot, Unsubscribe } from "firebase/database";
import { database } from "@/lib/firebase";

/**
 * Generic hook to listen to Firebase Realtime Database data
 */
export function useFirebaseData<T>(path: string, defaultValue: T): T {
  const [data, setData] = useState<T>(defaultValue);
  const defaultValueRef = useRef(defaultValue);

  // Update ref when defaultValue changes
  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    if (!database) {
      // Firebase not initialized, use default value
      console.warn(`⚠️ Firebase not initialized. Using default value for path: ${path}`);
      return;
    }

    try {
      const dataRef = ref(database, path);
      console.log(`🔌 Setting up listener for path: ${path}`);
      
      const listener = (snapshot: DataSnapshot) => {
        const value = snapshot.val();
        console.log(`📡 Firebase listener triggered for ${path}`, {
          hasValue: value !== null && value !== undefined,
          value: value,
          snapshotExists: snapshot.exists(),
        });
        
        if (value !== null && value !== undefined) {
          console.log(`✅ Setting new data for ${path}:`, value);
          setData(value);
        } else {
          console.log(`⚠️ No data at ${path}, using default`);
          setData(defaultValueRef.current);
        }
      };

      // onValue returns an unsubscribe function
      const unsubscribe: Unsubscribe = onValue(
        dataRef, 
        listener, 
        (error) => {
          console.error(`❌ Error listening to Firebase path ${path}:`, error);
        }
      );

      console.log(`✅ Listener active for ${path}`);

      return () => {
        console.log(`🔌 Unsubscribing from ${path}`);
        unsubscribe();
      };
    } catch (error) {
      console.error(`Error setting up listener for Firebase path ${path}:`, error);
    }
  }, [path]);

  return data;
}

/**
 * Hook to get real-time updates from a Firebase path
 */
export function useRealtimeData<T>(path: string, defaultValue: T): [T, boolean] {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const defaultValueRef = useRef(defaultValue);

  // Update ref when defaultValue changes
  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    if (!database) {
      // Firebase not initialized, use default value
      console.warn(`⚠️ Firebase not initialized. Using default value for path: ${path}`);
      setLoading(false);
      return;
    }

    try {
      const dataRef = ref(database, path);
      console.log(`🔌 Setting up listener for path: ${path}`);
      
      const listener = (snapshot: DataSnapshot) => {
        const value = snapshot.val();
        console.log(`📡 Firebase listener triggered for ${path}`, {
          hasValue: value !== null && value !== undefined,
          value: value,
          snapshotExists: snapshot.exists(),
        });
        
        if (value !== null && value !== undefined) {
          console.log(`✅ Setting new data for ${path}:`, value);
          setData(value);
        } else {
          console.log(`⚠️ No data at ${path}, using default`);
          setData(defaultValueRef.current);
        }
        setLoading(false);
      };

      // onValue returns an unsubscribe function
      const unsubscribe: Unsubscribe = onValue(
        dataRef, 
        listener, 
        (error) => {
          console.error(`❌ Error listening to Firebase path ${path}:`, error);
          setLoading(false);
        }
      );

      console.log(`✅ Listener active for ${path}`);

      return () => {
        console.log(`🔌 Unsubscribing from ${path}`);
        unsubscribe();
      };
    } catch (error) {
      console.error(`Error setting up listener for Firebase path ${path}:`, error);
      setLoading(false);
    }
  }, [path]);

  return [data, loading];
}

