import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';

export type BadgeLevel = 'baja' | 'media' | 'alta' | 'maxima';

interface BadgeProps {
  /** Texto a mostrar (ej: "Alta"). El color lo decide `level`, no el texto. */
  label: string;
  level: BadgeLevel;
}

/** Un color de fondo suave por nivel — la única "lógica" que tiene el Badge. */
const LEVEL_COLORS: Record<BadgeLevel, { text: string; background: string }> = {
  baja: { text: colors.success, background: colors.successLight },
  media: { text: colors.primary, background: colors.primaryLight },
  alta: { text: colors.tertiary, background: colors.tertiaryLight },
  maxima: { text: colors.error, background: colors.errorLight },
};

/**
 * Pastilla de nivel (pensada para intensidad de entrenamiento: baja/media/
 * alta/máxima). Recibe `label` y `level` por props — no decide qué nivel
 * le corresponde a un entrenamiento, eso lo resuelve quien la usa.
 */
export function Badge({ label, level }: BadgeProps) {
  const { text, background } = LEVEL_COLORS[level];

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm + 2,
  },
  label: {
    ...typography.caption,
    fontFamily: fontFamily.bold,
  },
});
