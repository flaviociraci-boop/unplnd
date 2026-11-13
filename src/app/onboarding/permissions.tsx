import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Button, Card, Screen, StatementTitle, Text } from '@/components/ui';
import { useT } from '@/lib/i18n';
import { requestLocationPermission } from '@/lib/location';
import { requestNotificationPermission } from '@/lib/notifications';
import { useAppStore } from '@/store/app-store';
import { useTheme } from '@/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const PERMISSIONS: { icon: IoniconName; key: 'location' | 'notifications' }[] = [
  { icon: 'location-outline', key: 'location' },
  { icon: 'notifications-outline', key: 'notifications' },
];

/** Permissions — explain the value first; the actual OS prompt is asked in context later. */
export default function OnboardingPermissions() {
  const t = useTheme();
  const { t: tr } = useT();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  return (
    <Screen contentStyle={{ flex: 1 }}>
      <StatementTitle text={tr('onboarding.permissions.title')} />
      <Text variant="bodyLarge" color="textSecondary" style={{ marginTop: t.spacing.sm }}>
        {tr('onboarding.permissions.body')}
      </Text>

      <View style={{ gap: t.spacing.base, marginTop: t.spacing.xl }}>
        {PERMISSIONS.map((p, i) => (
          <Animated.View key={p.key} entering={FadeInUp.duration(380).delay(120 + i * 80)}>
            <Card>
              <View style={{ flexDirection: 'row', gap: t.spacing.base, alignItems: 'center' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: t.radius.pill,
                    backgroundColor: t.colors.surfaceSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={p.icon} size={22} color={t.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h3">{tr(`onboarding.permissions.${p.key}`)}</Text>
                  <Text variant="small" color="textSecondary" style={{ marginTop: 2 }}>
                    {tr(`onboarding.permissions.${p.key}Body`)}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>

      <View style={{ flex: 1 }} />
      {/* App Review 5.1.1(iv): the button before a permission prompt must be neutral ("Continue"),
          never an encouragement like "Get started". */}
      <Button
        title={tr('common.continue')}
        onPress={async () => {
          // Explain-then-ask (16_ONBOARDING): the OS prompts come only after this screen explained why.
          await requestLocationPermission().catch(() => false);
          await requestNotificationPermission().catch(() => false);
          completeOnboarding();
        }}
      />
    </Screen>
  );
}
