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
 * label), con su propia superficie/sombra. Sirve para grillas sueltas
 * (ej: el resumen de la Home, Perfil, Marcas).
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

      {/* Una sola línea: si no entra (columna angosta), achica en vez de partirse */}
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>

      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
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
    // Los dígitos con el mismo ancho evitan que el número "baile" al animarse.
    fontVariant: ['tabular-nums'],
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
