import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Waves, Activity, Timer } from 'lucide-react-native';
import { colors, radius, shadow, spacing } from '@/theme';
import { StatItem } from './StatItem';
import type { WorkoutTotals } from '@/hooks/useWorkoutStats';
import { formatNumber } from '@/utils/format';
import { formatDuration } from '@/utils/time';

interface SummaryCardProps {
  /** Totales del mes actual. */
  totals: WorkoutTotals;
}

/**
 * Card blanca con las 3 estadísticas principales del mes,
 * separadas por líneas divisorias verticales (estilo Strava).
 */
export function SummaryCard({ totals }: SummaryCardProps) {
  return (
    <View style={[styles.card, shadow.card]}>
      <StatItem
        icon={Activity}
        iconColor={colors.primary}
        iconBackground={colors.primaryLight}
        value={String(totals.workouts)}
        label={'Entrenamientos\neste mes'}
      />

      <View style={styles.divider} />

      <StatItem
        icon={Waves}
        iconColor={colors.accent}
        iconBackground={colors.accentLight}
        value={formatNumber(totals.meters)}
        unit="m"
        label={'Metros totales\neste mes'}
      />

      <View style={styles.divider} />

      <StatItem
        icon={Timer}
        iconColor={colors.tertiary}
        iconBackground={colors.tertiaryLight}
        value={formatDuration(totals.seconds)}
        label={'Tiempo total\neste mes'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
