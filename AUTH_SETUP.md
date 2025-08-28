READU Interactive — Auth, Toasts, Stripe, and RNFirebase

Overview
- Auth via Firebase: Web SDK by default; optional React Native Firebase (RNFirebase) for native builds
- Zustand store for auth + subscription gating
- Custom Toast provider (success/error/info)
- Auth screens (BG): onboarding, logIn, signIN, forgot, phone-start, phone, payment
- Local Stripe test server scaffold

App dependencies (Web SDK default)
  npm i firebase zustand @stripe/stripe-react-native
  npx expo install expo-secure-store expo-firebase-recaptcha expo-auth-session

Stripe local server
  cd server
  cp .env.example .env   # fill test keys
  npm i express cors stripe dotenv
  node index.js

Server runs at http://localhost:4242

Optional: React Native Firebase (recommended for production native builds)
1) Install native modules
  npm i @react-native-firebase/app @react-native-firebase/auth

2) Add config plugins to app.json
  {
    "expo": {
      "plugins": [
        "@react-native-firebase/app",
        "@react-native-firebase/auth"
      ]
    }
  }

3) Add Firebase configuration files
  - android/app/google-services.json
  - ios/GoogleService-Info.plist

4) Prebuild and run
  npx expo prebuild
  npx expo run:android   # or run:ios (or build with EAS)

5) Switch provider
  - constants/firebaseProvider.ts: set USE_RNFIREBASE = true
  - App dynamically loads RNFirebase AuthProvider; falls back to Web if modules missing.

Routing & providers
- app/_layout.tsx mounts StripeProvider + AppProviders and hides headers
- app/providers.tsx chooses AuthProvider (RNFirebase or Web) and ToastProvider
- hooks/useAuthGate.ts redirects unauth → (auth)/onboarding; unpaid → (auth)/payment

Notes
- Do not expose Stripe secret key in the app; keep it in server/.env
- Phone auth:
  - Web SDK path uses expo-firebase-recaptcha
  - RNFirebase path uses native confirmation flow (no Recaptcha modal required)

