import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Selector de una opción entre pocas (2-3), estilo "pill" segmentado
 * (iOS). Se usa para pileta (25/50 m) e intensidad.
 */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, isSelected && styles.segmentSelected]}
            activeOpacity={0.8}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.xs / 2,
    gap: spacing.xs / 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.surface,
  },
});
