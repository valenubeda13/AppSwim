import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { WorkoutSet } from '@/types';
import { STROKE_LABEL } from '@/constants/strokes';
import { formatMeters } from '@/utils/format';
import { formatRest } from '@/utils/time';

interface SetRowProps {
  set: WorkoutSet;
}

/** "4 × 100 m crol · desc. 20 s" */
function setSummary(set: WorkoutSet): string {
  const base = `${set.repetitions} × ${set.distance} m ${STROKE_LABEL[set.stroke]}`;
  return set.restSeconds ? `${base} · desc. ${formatRest(set.restSeconds)}` : base;
}

/**
 * Una serie: resumen a la izquierda (puede ocupar dos líneas en pantallas
 * chicas) y el total parcial a la derecha, que nunca se corta.
 */
export function SetRow({ set }: SetRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrapper}>
        <Text style={styles.summary}>{setSummary(set)}</Text>
        {set.description ? <Text style={styles.description}>{set.description}</Text> : null}
      </View>
      <Text style={styles.total}>{formatMeters(set.repetitions * set.distance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  textWrapper: {
    flex: 1,
  },
  summary: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  total: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});
