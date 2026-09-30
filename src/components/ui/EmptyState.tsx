import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onPressCta?: () => void;
}

/**
 * Estado vacío genérico: icono + título + texto + CTA opcional (usa
 * `Button` variant="primary"). Puramente presentacional — el texto y el
 * ícono los decide quien la usa según el contexto (sin entrenos, sin
 * marcas, sin recordatorios, etc.).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onPressCta,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon size={28} color={colors.primary} strokeWidth={2} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {ctaLabel && <Button label={ctaLabel} onPress={onPressCta} style={styles.cta} />}
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
    marginTop: spacing.lg,
  },
});
