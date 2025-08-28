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
import { USE_RNFIREBASE } from "../constants/firebaseProvider";

// Web SDK config (used when RNFirebase isn't active)
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

// RNFirebase (native) singletons
let nativeApp: any;
let nativeAuth: any;
let usingRNFirebase = false;

// Try React Native Firebase first
if (USE_RNFIREBASE) {
  try {
    const appMod = require("@react-native-firebase/app");
    const authMod = require("@react-native-firebase/auth");

    const appModule = appMod.default ?? appMod;
    nativeApp = appModule.app ? appModule.app() : appModule();

    const authModule = authMod.default ?? authMod;
    nativeAuth = authModule();

    usingRNFirebase = !!nativeAuth;
  } catch {
    usingRNFirebase = false;
  }
}

export function getFirebaseApp() {
  if (usingRNFirebase) return nativeApp;
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app!;
}

export function getFirebaseAuth(persist: boolean = true) {
  if (usingRNFirebase) return nativeAuth;

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

// Helpers
export const isRNFirebase = () => usingRNFirebase;
export const getRNFirebaseAuth = () => nativeAuth;
export const getRNFirebaseApp = () => nativeApp;
export const getWebFirebaseAuth = () => auth;
export const getWebFirebaseApp = () => app;
export default getFirebaseAuth;
