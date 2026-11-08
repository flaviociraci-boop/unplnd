import type { Session, User } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { create } from 'zustand';

import { identifyUser, resetAnalytics } from '@/lib/analytics';
import { requestAppleCredential } from '@/lib/apple-auth';
import { supabase } from '@/lib/supabase';

import { exchangeOAuthCode } from './oauth-exchange';

// Finish any pending auth session (web popups). No-op on native.
WebBrowser.maybeCompleteAuthSession();

interface AuthResult {
  error?: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  /** Subscribe to auth changes. Returns an unsubscribe function. */
  init: () => () => void;
  /** Re-pull the current user (e.g. after editing the profile) so metadata reflects at once. */
  refreshUser: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  /** Google OAuth via the system browser (works in Expo Go; 15_AUTH). */
  signInWithGoogle: () => Promise<AuthResult>;
  /** Native Sign in with Apple (iOS) → Supabase id-token login. Cancelling is not an error. */
  signInWithApple: () => Promise<AuthResult>;
  /** GDPR Art. 17: erase the account + all owned data server-side, then sign out. */
  deleteAccount: () => Promise<AuthResult>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  init: () => {
    void supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, initialized: true });
      if (data.session?.user) identifyUser(data.session.user.id);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, initialized: true });
      if (session?.user) identifyUser(session.user.id);
      else resetAnalytics();
    });
    return () => data.subscription.unsubscribe();
  },
  refreshUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) set({ user: data.user });
  },
  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  },
  signUpWithEmail: async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    return { error: error?.message };
  },
  signOut: async () => {
    await supabase.auth.signOut();
  },
  signInWithGoogle: async () => {
    try {
      // Dev builds/TestFlight: unplnd://… (scheme in app.json). It must be listed under
      // Supabase → Auth → URL Configuration → Redirect URLs, or the login bounces back.
      const redirectTo = makeRedirectUri();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error || !data?.url) return { error: error?.message ?? 'oauth_failed' };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') return {}; // user dismissed — not an error to surface

      const url = result.url;
      const code = /[?&]code=([^&#]+)/.exec(url)?.[1];
      if (code) {
        return await exchangeOAuthCode(decodeURIComponent(code), url);
      }
      // Fallback: tokens returned in the URL fragment (implicit flow).
      const access = /[#&]access_token=([^&]+)/.exec(url)?.[1];
      const refresh = /[#&]refresh_token=([^&]+)/.exec(url)?.[1];
      if (access && refresh) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: decodeURIComponent(access),
          refresh_token: decodeURIComponent(refresh),
        });
        return { error: sessionError?.message };
      }
      return { error: 'oauth_no_code' };
    } catch (e) {
      return { error: (e as Error).message };
    }
  },
  signInWithApple: async () => {
    const credential = await requestAppleCredential();
    if (credential.kind === 'cancelled') return {};
    if (credential.kind === 'error') return { error: credential.error };

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
      nonce: credential.rawNonce,
    });
    if (error) return { error: error.message };

    // Apple shares the name only on the very first sign-in. Without it the profile would show the
    // local part of an anonymous relay address (…@privaterelay.appleid.com) — so keep it once.
    const userId = data.user?.id;
    if (userId && credential.fullName && !data.user?.user_metadata?.display_name) {
      const { data: updated } = await supabase.auth.updateUser({ data: { display_name: credential.fullName } });
      await supabase.from('profiles').update({ display_name: credential.fullName }).eq('id', userId);
      if (updated.user) set({ user: updated.user });
    }
    return {};
  },
  deleteAccount: async () => {
    const { error } = await supabase.functions.invoke('delete-account');
    if (error) return { error: error.message };
    // Account is gone server-side — clear the local session so the app returns to auth.
    await supabase.auth.signOut();
    return {};
  },
}));

/** Password rule from 15_AUTH: 8+ chars with upper, lower, number & symbol. */
export function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}
