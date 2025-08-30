// lib/firebase.ts
import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
export const firebaseConfig = {
  apiKey: 'AIzaSyCu5NlhI9X5TyXMmDB4aHYD4ENDWlMRW3g',
  authDomain: 'readu-interactive.firebaseapp.com',
  projectId: 'readu-interactive',
  storageBucket: 'readu-interactive.appspot.com',
  messagingSenderId: '819352885553',
  appId: '1:819352885553:web:6d7d9c49ba6e7963593810',
  measurementId: 'G-T4Z4L7QRTP',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let _auth: Auth;

if (Platform.OS === 'web') {
  // On web, use the default Auth instance
  _auth = getAuth(app);
} else {
  // On React Native, initializeAuth must be called exactly once before getAuth
  try {
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage as any),
    });
  } catch (e) {
    // During Fast Refresh, initializeAuth may have already been called
    _auth = getAuth(app);
  }
}

export const auth = _auth;
export default auth;

