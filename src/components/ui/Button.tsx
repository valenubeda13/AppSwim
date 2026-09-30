import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón base de la app. `primary` = fondo sólido, `secondary` = borde,
 * `ghost` = sin fondo ni borde (para acciones secundarias/destructivas
 * en listas). `loading` reemplaza el label por un spinner y bloquea el tap.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, VARIANT_STYLES[variant], isDisabled && styles.disabled, style]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.primary} />
      ) : (
        <Text style={[styles.label, LABEL_VARIANT_STYLES[variant]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.bodyStrong,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryLabel: {
    color: colors.surface,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryLabel: {
    color: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostLabel: {
    color: colors.primary,
    fontFamily: fontFamily.semiBold,
  },
});

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

const LABEL_VARIANT_STYLES = {
  primary: styles.primaryLabel,
  secondary: styles.secondaryLabel,
  ghost: styles.ghostLabel,
};
