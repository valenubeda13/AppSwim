import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface StatItemProps {
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
  value: string;
  unit?: string;
  label: string;
}

/**
 * Un valor estadístico individual (ej: "32 Entrenamientos este mes").
 * Se usa 3 veces dentro de <SummaryCard /> separado por divisores.
 */
export function StatItem({
  icon: Icon,
  iconColor,
  iconBackground,
  value,
  unit,
  label,
}: StatItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
        <Icon size={18} color={iconColor} strokeWidth={2.2} />
      </View>

      <Text style={styles.value}>
        {value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    ...typography.statValue,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.body,
    color: colors.textSecondary,
  },
  label: {
    ...typography.statLabel,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
