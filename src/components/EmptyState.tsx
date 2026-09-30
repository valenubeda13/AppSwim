import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onPressCta?: () => void;
}

/**
 * Estado vacío genérico (ícono + texto + CTA opcional). Se usa en
 * Entrenamientos cuando todavía no hay nada cargado, y queda listo
 * para reutilizarse en Mis marcas.
 */
export function EmptyState({ icon: Icon, title, description, ctaLabel, onPressCta }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon size={28} color={colors.primary} strokeWidth={2} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {ctaLabel && (
        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={onPressCta}>
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  ctaLabel: {
    ...typography.bodyStrong,
    color: colors.surface,
  },
});
