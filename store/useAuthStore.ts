import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';

export type SubscriptionPlan = 'free' | 'premium' | 'gold' | null;

export interface AuthState {
  uid: string | null;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAuthenticated: boolean;
  isSubscribed: boolean; // gating for paid content
  plan: SubscriptionPlan;
  rememberMe: boolean;
  setUser: (u: Partial<AuthState>) => void;
  clearUser: () => void;
  setSubscription: (opts: { isSubscribed: boolean; plan: SubscriptionPlan }) => void;
  setRememberMe: (remember: boolean) => void;
}

const storage: StateStorage = {
  getItem: async (name) => {
    const v = await SecureStore.getItemAsync(name);
    return v ?? null;
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      uid: null,
      email: null,
      phoneNumber: null,
      displayName: null,
      photoURL: null,
      isAuthenticated: false,
      isSubscribed: false,
      plan: null,
      rememberMe: true,
      setUser: (u) =>
        set((s) => ({
          ...s,
          ...u,
          isAuthenticated: Boolean(u.uid ?? s.uid),
        })),
      clearUser: () =>
        set({
          uid: null,
          email: null,
          phoneNumber: null,
          displayName: null,
          photoURL: null,
          isAuthenticated: false,
          isSubscribed: false,
          plan: null,
        }),
      setSubscription: ({ isSubscribed, plan }) => set({ isSubscribed, plan }),
      setRememberMe: (remember) => set({ rememberMe: remember }),
    }),
    {
      name: 'readu-auth',
      storage: createJSONStorage(() => storage),
      partialize: (s) => ({
        uid: s.uid,
        email: s.email,
        phoneNumber: s.phoneNumber,
        displayName: s.displayName,
        photoURL: s.photoURL,
        isAuthenticated: s.isAuthenticated,
        isSubscribed: s.isSubscribed,
        plan: s.plan,
        rememberMe: s.rememberMe,
      }),
    },
  ),
);

export default useAuthStore;
