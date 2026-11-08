import '@/global.css';

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NetworkBanner, Toast } from '@/components/ui';
import { UpsellOnAppOpen } from '@/features/premium/upsell';
import { useAlbumsStore } from '@/features/albums/albums-store';
import { usePhotoQueue } from '@/features/albums/photo-queue';
import { CelebrationOverlay } from '@/features/celebrate/CelebrationOverlay';
import { initAnalytics } from '@/lib/analytics';
import { initMonitoring, wrapWithMonitoring } from '@/lib/monitoring';
import { useRatingsQueue } from '@/lib/ratings-queue';
import { useCelebrateStore } from '@/features/celebrate/celebrate-store';
import { recordActivity } from '@/lib/activity';
import { useAuthStore } from '@/features/auth/auth-store';
import { useRevenueCatStore } from '@/store/revenuecat-store';
import { publishLiveLocation } from '@/features/map/live';
import { useAppStore } from '@/store/app-store';
import { useConnectivityStore } from '@/store/connectivity-store';
import { ThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

// Start crash/error reporting + analytics as early as possible (both no-op until configured).
initMonitoring();
initAnalytics();

// Gate: onboarding → auth → app.
function RootNavigator() {
  const t = useTheme();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const session = useAuthStore((s) => s.session);
  const router = useRouter();
  const hadSession = useRef(!!session);

  // Stack.Protected only guards the screens declared below. Pushed screens such as Settings,
  // a chat or a plan sit outside it, so signing out (or deleting the account) from there left the
  // user on that screen. Whenever the session ends, clear the whole stack and go to sign-in.
  useEffect(() => {
    const signedOut = hadSession.current && !session;
    hadSession.current = !!session;
    if (!signedOut || !hasOnboarded) return;
    if (router.canDismiss()) router.dismissAll();
    router.replace('/auth');
  }, [session, hasOnboarded, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        // Match the theme so screen transitions never flash a white default background.
        contentStyle: { backgroundColor: t.colors.background },
      }}
    >
      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={hasOnboarded && !session}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
      <Stack.Protected guard={hasOnboarded && !!session}>
        <Stack.Screen name="(tabs)" />
        {/* Paywall pops up as an iOS sheet — feels like a moment, not a page. */}
        <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack.Protected>
    </Stack>
  );
}

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const authInitialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    const unsubscribe = useAuthStore.getState().init();
    return unsubscribe;
  }, []);

  // RevenueCat: configure for the signed-in user (no-op until a key is set + a dev build is made).
  const rcUserId = useAuthStore((s) => s.user?.id);
  useEffect(() => {
    if (rcUserId) void useRevenueCatStore.getState().start(rcUserId);
    else void useRevenueCatStore.getState().reset();
  }, [rcUserId]);

  useEffect(() => {
    const unsubscribe = useConnectivityStore.getState().init();
    return unsubscribe;
  }, []);

  // Drain everything queued offline — now, and whenever connectivity returns. Order matters:
  // albums first (temp → real ids), then photos (need the real album row), then ratings.
  useEffect(() => {
    const flushAll = async () => {
      await useAlbumsStore.getState().flushOutbox();
      await usePhotoQueue.getState().flush();
      await useRatingsQueue.getState().flush();
    };
    void flushAll();
    return useConnectivityStore.subscribe((s, prev) => {
      if (s.isOnline && !prev.isOnline) void flushAll();
    });
  }, []);

  // Live location updates only while the app is actually USED (foreground) — deliberately no
  // background tracking. Coming back to the app refreshes the shared position; closing it lets the
  // row go stale (<60 min) and quietly drops you off connections' maps.
  useEffect(() => {
    const push = () => {
      if (useAppStore.getState().shareLiveLocation) void publishLiveLocation();
    };
    push();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') push();
    });
    return () => sub.remove();
  }, []);

  const ready = (fontsLoaded || !!fontError) && hasHydrated && authInitialized;

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    // Count today's visit toward the daily-use streak, then celebrate it once per day.
    void (async () => {
      const streak = await recordActivity();
      if (streak <= 0) return;
      const now = new Date();
      const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      const { lastStreakCelebrationDate, setLastStreakCelebrationDate } = useAppStore.getState();
      if (lastStreakCelebrationDate !== today) {
        setLastStreakCelebrationDate(today);
        useCelebrateStore.getState().showStreak(streak);
      }
    })();
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** A themed background wraps everything, so screen transitions never flash the window color. */
function AppShell() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <RootNavigator />
      <UpsellOnAppOpen />
      <NetworkBanner />
      <Toast />
      <CelebrationOverlay />
      <StatusBar style="auto" />
    </View>
  );
}

// Wrapping the root adds Sentry's error boundary + context (pass-through until a DSN is set).
export default wrapWithMonitoring(RootLayout);
