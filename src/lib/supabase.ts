import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase credentials are present. The app still runs without them (data stays local). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[UNPLND] Supabase is not configured yet — add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env',
  );
}

/**
 * Supabase client. The anon key is safe to ship in the app — access is enforced by
 * Postgres Row Level Security (31_SECURITY). Never put the service_role key here.
 */
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // PKCE is the secure OAuth flow for mobile — the code exchange happens on-device.
      flowType: 'pkce',
    },
  },
);

/**
 * React Native token refresh (official Supabase RN pattern): the auto-refresh timer must be
 * driven by the app's foreground state. Without this the access token silently expires after
 * ~1h and the FIRST request afterwards fails (messages that only send on the second try,
 * profile queries returning nothing) before the client recovers.
 */
if (isSupabaseConfigured) {
  supabase.auth.startAutoRefresh();
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
