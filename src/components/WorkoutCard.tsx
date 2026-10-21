import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame, Layers, Timer, Waves } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { Badge, Card } from './ui';
import { WorkoutMetric } from './WorkoutMetric';
import { Workout } from '@/types';
import { INTENSITY_BADGE_LEVEL, INTENSITY_LABEL } from '@/constants/intensity';
import { formatDateLabel } from '@/utils/date';
import { formatMetersParts } from '@/utils/format';
import { formatDuration } from '@/utils/time';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

const setsLabel = (count: number) =>
  count === 0 ? 'Sin series' : `${count} ${count === 1 ? 'serie' : 'series'}`;

/**
 * Card de un entrenamiento, estilo Strava: metros grandes arriba y una
 * grilla 2×2 de métricas. Debajo, la primera línea de las notas.
 */
export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const meters = formatMetersParts(workout.totalMeters);
  const firstNoteLine = workout.notes?.split('\n')[0].trim();

  return (
    <Card onPress={onPress} padding="md">
      <View style={styles.topRow}>
        <Text style={styles.date}>{formatDateLabel(workout.date)}</Text>
        <Badge
          label={INTENSITY_LABEL[workout.intensity]}
          level={INTENSITY_BADGE_LEVEL[workout.intensity]}
        />
      </View>

      <Text style={styles.meters}>
        {meters.value}
        <Text style={styles.metersUnit}> {meters.unit}</Text>
      </Text>

      <View style={styles.grid}>
        <View style={styles.cell}>
          <WorkoutMetric
            icon={Timer}
            value={formatDuration(workout.durationSeconds)}
            label="Tiempo"
            iconColor={colors.tertiary}
            iconBackground={colors.tertiaryLight}
          />
        </View>
        <View style={styles.cell}>
          <WorkoutMetric
            icon={Flame}
            // Las calorías todavía no se cargan en el formulario.
            value={workout.calories ? `${workout.calories} kcal` : '— kcal'}
            label="Calorías"
            iconColor={colors.error}
            iconBackground={colors.errorLight}
          />
        </View>
        <View style={styles.cell}>
          <WorkoutMetric icon={Layers} value={setsLabel(workout.sets.length)} label="Series" />
        </View>
        <View style={styles.cell}>
          <WorkoutMetric
            icon={Waves}
            value={`${workout.poolLength} m`}
            label="Pileta"
            iconColor={colors.accent}
            iconBackground={colors.accentLight}
          />
        </View>
      </View>

      {firstNoteLine ? (
        <Text style={styles.notes} numberOfLines={1}>
          {firstNoteLine}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  meters: {
    ...typography.display,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  metersUnit: {
    ...typography.h2,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
    marginTop: spacing.md,
  },
  cell: {
    width: '50%',
    paddingRight: spacing.sm,
  },
  notes: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
