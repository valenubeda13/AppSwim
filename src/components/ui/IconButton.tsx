import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius } from '@/theme';

export type IconButtonVariant = 'filled' | 'ghost';

interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  /** Diámetro del círculo tocable. Default 40. */
  size?: number;
  /** 'filled' = círculo de color de fondo (ej: header de cards). 'ghost' = sin fondo (ej: íconos sueltos de un header). */
  variant?: IconButtonVariant;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón circular para un solo ícono (lucide-react-native). Reemplaza los
 * `TouchableOpacity` + círculo sueltos que se repetían en varias pantallas.
 */
export function IconButton({
  icon: Icon,
  onPress,
  size = 40,
  variant = 'filled',
  color = colors.primary,
  backgroundColor = colors.primaryLight,
  disabled = false,
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor: variant === 'filled' ? backgroundColor : 'transparent',
        },
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Icon size={Math.round(size * 0.5)} color={color} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
