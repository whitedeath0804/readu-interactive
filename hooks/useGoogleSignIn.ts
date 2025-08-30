import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import auth from '../lib/firebase';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_EXPO_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../constants/authConfig';

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleSignIn() {
  // Use singleton auth instance
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_EXPO_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    selectAccount: true,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const { id_token, access_token } = (response as any).authentication || {};
        if (!id_token && !access_token) return;
        const credential = GoogleAuthProvider.credential(id_token, access_token);
        await signInWithCredential(auth, credential);
      }
    })();
  }, [response]);

  return { request, promptAsync };
}
