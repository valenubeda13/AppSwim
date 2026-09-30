import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface StreakBadgeProps {
  days: number;
}

/**
 * Pastilla oscura semitransparente que muestra la racha de días
 * consecutivos entrenando. Se ubica sobre la foto del header.
 */
export function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Flame size={22} color={colors.accent} fill={colors.accent} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.label}>Racha actual</Text>
        <Text style={styles.value}>{days} días</Text>
        <Text style={styles.subtitle}>¡Seguís imparables!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.overlayDark,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassOverlay,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.glassOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  textWrapper: {
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
  value: {
    ...typography.h2,
    color: colors.textOnDark,
    marginTop: 1,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    marginTop: 1,
  },
});
