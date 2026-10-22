import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { Badge } from '@/components/ui';
import { Workout } from '@/types';
import { INTENSITY_BADGE_LEVEL, INTENSITY_LABEL } from '@/constants/intensity';
import { formatLongDate } from '@/utils/date';
import { formatMetersParts } from '@/utils/format';

interface WorkoutHeroProps {
  workout: Workout;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Cabecera del detalle: fecha larga, metros en grande, intensidad y pileta.
 * Es lo primero que se lee, por eso los metros van en el tamaño más grande
 * de la pantalla.
 */
export function WorkoutHero({ workout }: WorkoutHeroProps) {
  const meters = formatMetersParts(workout.totalMeters);

  return (
    <View>
      <Text style={styles.date}>{capitalize(formatLongDate(workout.date))}</Text>

      <Text style={styles.meters}>
        {meters.value}
        <Text style={styles.unit}> {meters.unit}</Text>
      </Text>

      <View style={styles.tags}>
        <Badge
          label={INTENSITY_LABEL[workout.intensity]}
          level={INTENSITY_BADGE_LEVEL[workout.intensity]}
        />
        <View style={styles.poolTag}>
          <Text style={styles.poolLabel}>Pileta {workout.poolLength} m</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  meters: {
    ...typography.display,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  unit: {
    ...typography.h1,
    color: colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  // Misma forma que Badge, en neutro: la pileta es un dato, no un nivel.
  poolTag: {
    borderRadius: radius.full,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  poolLabel: {
    ...typography.caption,
    fontFamily: fontFamily.bold,
    color: colors.textSecondary,
  },
});
