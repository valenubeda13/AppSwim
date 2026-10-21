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
  /** 'sm' es la versión compacta, para ir al lado de un título. Default 'md'. */
  size?: 'md' | 'sm';
}

/**
 * Selector de una opción entre pocas (2-3), estilo "pill" segmentado
 * (iOS). Se usa para pileta (25/50 m), intensidad y el período del resumen.
 */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  const isSmall = size === 'sm';
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.segment,
              isSmall && styles.segmentSmall,
              isSelected && styles.segmentSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.label,
                isSmall && styles.labelSmall,
                isSelected && styles.labelSelected,
              ]}
            >
              {option.label}
            </Text>
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
  segmentSmall: {
    // Sin flex: cada opción mide lo que su texto (el control no ocupa todo el ancho).
    flex: 0,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 4,
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  labelSmall: {
    ...typography.caption,
  },
  labelSelected: {
    color: colors.surface,
  },
});
