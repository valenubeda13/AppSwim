import React from 'react';
import { Text, TextProps } from 'react-native';
import { colors, typography } from '@/theme';

interface AppTextProps extends TextProps {
  /** Estilo tipográfico: cualquier clave de `typography` (display, h1, body...). */
  variant?: keyof typeof typography;
  color?: string;
}

/**
 * Wrapper de <Text> con la escala tipográfica del theme. `variant` autocompleta
 * solo las claves reales de `typography`, así que un nombre inventado no compila.
 */
export function AppText({
  variant = 'body',
  color = colors.textPrimary,
  style,
  ...props
}: AppTextProps) {
  return <Text style={[typography[variant], { color }, style]} {...props} />;
}
