// src/lib/firebaseHybrid.ts
import { FirebaseApp, initializeApp, getApps } from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
// Web SDK config
export const firebaseConfig = {
  apiKey: "AIzaSyCu5NlhI9X5TyXMmDB4aHYD4ENDWlMRW3g",
  authDomain: "readu-interactive.firebaseapp.com",
  projectId: "readu-interactive",
  storageBucket: "readu-interactive.appspot.com", // ✅ fix
  messagingSenderId: "819352885553",
  appId: "1:819352885553:web:6d7d9c49ba6e7963593810",
  measurementId: "G-T4Z4L7QRTP",
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp() {
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app!;
}

export function getFirebaseAuth(persist: boolean = true) {
  const appInstance = getFirebaseApp();
  if (!auth) {
    // SecureStore-backed persistence for RN Web SDK path
    const secureStorage = {
      getItem: (k: string) => SecureStore.getItemAsync(k),
      setItem: (k: string, v: string) => SecureStore.setItemAsync(k, v),
      removeItem: (k: string) => SecureStore.deleteItemAsync(k),
    } as any;

    try {
      auth = initializeAuth(appInstance, {
        persistence: getReactNativePersistence(secureStorage),
      });
    } catch {
      // Fallback if initializeAuth throws (e.g., on web)
      auth = getAuth(appInstance);
    }
  }

  if (!persist) {
    // don't await; keep API sync and ignore errors
    void setPersistence(auth, inMemoryPersistence).catch(() => {});
  }

  return auth!;
}

export default getFirebaseAuth;
