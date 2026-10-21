import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Card } from './ui';
import { SetRow } from './SetRow';
import { WorkoutSet } from '@/types';

interface SetsListProps {
  sets: WorkoutSet[];
}

/** Las series del entreno en una card, separadas por líneas finas. */
export function SetsList({ sets }: SetsListProps) {
  if (sets.length === 0) {
    return (
      <Card>
        <Text style={styles.empty}>Este entrenamiento no tiene series cargadas.</Text>
      </Card>
    );
  }

  return (
    <Card padding={0} style={styles.card}>
      {sets.map((set, index) => (
        <View key={set.id} style={index > 0 && styles.divider}>
          <SetRow set={set} />
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
