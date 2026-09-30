import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontFamily, spacing, typography } from '@/theme';

interface SectionHeaderProps {
  title: string;
  /** Ej: "Ver todo". Si no viene, no se muestra nada a la derecha. */
  actionLabel?: string;
  onPressAction?: () => void;
}

/**
 * Encabezado de sección: título a la izquierda + acción de texto opcional
 * a la derecha (ej: "Ver todo"). Para el título solo (sin acción), alcanza
 * con no pasar `actionLabel`.
 */
export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>

      {actionLabel && (
        <TouchableOpacity
          onPress={onPressAction}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  action: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
});
