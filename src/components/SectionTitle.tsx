import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface SectionTitleProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Título usado para encabezar cada sección de la Home
 * ("Accesos rápidos", "Resumen", "Consejo del día"...).
 */
export function SectionTitle({ children, style }: SectionTitleProps) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
