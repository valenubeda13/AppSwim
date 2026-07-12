import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface SectionTitleProps {
  children: string;
}

/**
 * Título usado para encabezar cada sección de la Home
 * ("Accesos rápidos", "Resumen", "Consejo del día"...).
 */
export function SectionTitle({ children }: SectionTitleProps) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
