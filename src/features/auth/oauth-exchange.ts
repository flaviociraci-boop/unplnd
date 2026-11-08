import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase, supabaseAnonKey, supabaseUrl } from '@/lib/supabase';

const RETRY_DELAYS_MS = [0, 800, 2000];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Swaps the one-time OAuth code (PKCE) for a session.
 *
 * Why not just `supabase.auth.exchangeCodeForSession`: it deletes the code verifier after the
 * first try, so a failed attempt can never be repeated. Google sign-in on iOS hit
 * `flow_state_not_found` for returning accounts, although the server issued a valid code and
 * exchanging it a moment later works. So we keep the verifier and retry that error twice.
 *
 * The query string carries `try` and the code's first 8 characters. Supabase ignores both, but
 * they show up in the API logs, so a failure can be matched against `auth.flow_state`.
 */
export async function exchangeOAuthCode(code: string, callbackUrl: string): Promise<{ error?: string }> {
  const verifierKey = `${(supabase.auth as unknown as { storageKey: string }).storageKey}-code-verifier`;
  const raw = await AsyncStorage.getItem(verifierKey);
  let stored = raw ?? '';
  try {
    stored = raw ? (JSON.parse(raw) as string) : '';
  } catch {
    // Older clients stored the plain string.
  }
  const verifier = stored.split('/')[0];
  if (!verifier) return { error: 'oauth_no_verifier' };

  const codeCount = (callbackUrl.match(/[?&#]code=/g) ?? []).length;
  let lastError = 'oauth_exchange_failed';

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (RETRY_DELAYS_MS[attempt]) await sleep(RETRY_DELAYS_MS[attempt]);
    const diag = `try=${attempt + 1}&c=${encodeURIComponent(code.slice(0, 8))}&n=${codeCount}`;
    let status = 0;
    let body: { access_token?: string; refresh_token?: string; error_code?: string; msg?: string } = {};
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce&${diag}`, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey ?? '',
          Authorization: `Bearer ${supabaseAnonKey ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth_code: code, code_verifier: verifier }),
      });
      status = res.status;
      body = await res.json().catch(() => ({}));
    } catch (e) {
      lastError = (e as Error).message;
      continue; // network hiccup: worth another try
    }

    if (status === 200 && body.access_token && body.refresh_token) {
      await AsyncStorage.removeItem(verifierKey);
      const { error } = await supabase.auth.setSession({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
      });
      return { error: error?.message };
    }

    lastError = body.error_code ?? body.msg ?? `http_${status}`;
    if (body.error_code !== 'flow_state_not_found') break;
  }

  await AsyncStorage.removeItem(verifierKey);
  return { error: lastError };
}
