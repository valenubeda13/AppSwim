import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  unit?: string;
  label: string;
  iconColor?: string;
  iconBackground?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card individual para una estadística (icono + valor grande + unidad +
 * label), con su propia superficie/sombra — a diferencia de `StatItem`
 * (que vive *dentro* de otra card, separado por divisores en `SummaryCard`),
 * `StatCard` es autónoma: sirve para grillas sueltas (ej: Perfil, Marcas).
 * Solo presenta los datos que recibe, no decide qué mostrar.
 */
export function StatCard({
  icon: Icon,
  value,
  unit,
  label,
  iconColor = colors.primary,
  iconBackground = colors.primaryLight,
  style,
}: StatCardProps) {
  return (
    <View style={[styles.card, shadow.soft, style]}>
      <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
        <Icon size={20} color={iconColor} strokeWidth={2.2} />
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
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
    marginTop: 2,
  },
});
