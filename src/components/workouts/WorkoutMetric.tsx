import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface WorkoutMetricProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconColor?: string;
  iconBackground?: string;
}

/**
 * Una métrica de la grilla de WorkoutCard: icono en círculo + valor + label.
 * Evita repetir el mismo bloque para tiempo, calorías, series y pileta.
 */
export function WorkoutMetric({
  icon: Icon,
  value,
  label,
  iconColor = colors.primary,
  iconBackground = colors.primaryLight,
}: WorkoutMetricProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
        <Icon size={16} color={iconColor} strokeWidth={2.2} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flexShrink: 1,
  },
  value: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  label: {
    ...typography.statLabel,
    color: colors.textSecondary,
  },
});
