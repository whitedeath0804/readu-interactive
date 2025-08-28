import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, setPersistence, getAuth, Auth, inMemoryPersistence } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { USE_RNFIREBASE } from '../constants/firebaseProvider';

// Web SDK config (used if RNFirebase is not active)
export const firebaseConfig = {
  apiKey: 'AIzaSyCu5NlhI9X5TyXMmDB4aHYD4ENDWlMRW3g',
  authDomain: 'readu-interactive.firebaseapp.com',
  projectId: 'readu-interactive',
  storageBucket: 'readu-interactive.firebasestorage.app',
  messagingSenderId: '819352885553',
  appId: '1:819352885553:web:6d7d9c49ba6e7963593810',
  measurementId: 'G-T4Z4L7QRTP',
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let nativeApp: any;
let nativeAuth: any;
let usingRNFirebase = false;

// Attempt to initialize React Native Firebase if flag is on and modules exist
if (USE_RNFIREBASE) {
  try {
    // Lazy require to avoid bundling errors when not installed
    const rnfbApp = require('@react-native-firebase/app');
    const rnfbAuth = require('@react-native-firebase/auth');
    nativeApp = rnfbApp.default?.() || rnfbApp();
    nativeAuth = rnfbAuth.default?.() || rnfbAuth();
    usingRNFirebase = Boolean(nativeApp && nativeAuth);
  } catch {
    usingRNFirebase = false;
  }
}

export function getFirebaseApp() {
  if (usingRNFirebase) return nativeApp;
  if (!app) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0]!;
    }
  }
  return app!;
}

export function getFirebaseAuth(persist: boolean = true) {
  if (usingRNFirebase) return nativeAuth;
  const appInstance = getFirebaseApp();

  if (!auth) {
    try {
      const secureStorageLike = {
        getItem: (key: string) => SecureStore.getItemAsync(key),
        setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
        removeItem: (key: string) => SecureStore.deleteItemAsync(key),
      } as any;

      auth = initializeAuth(appInstance, {
        persistence: getReactNativePersistence(secureStorageLike),
      });
    } catch (e) {
      auth = getAuth(appInstance);
    }
  }

  if (!persist) {
    try {
      setPersistence(auth, inMemoryPersistence);
    } catch {}
  }

  return auth;
}

// Helper accessors/flags
export function isRNFirebase() {
  return usingRNFirebase;
}

export function getRNFirebaseAuth() {
  return nativeAuth;
}

export function getRNFirebaseApp() {
  return nativeApp;
}

export function getWebFirebaseAuth() {
  return auth;
}

export function getWebFirebaseApp() {
  return app;
}

export default getFirebaseAuth;

