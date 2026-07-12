import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowRight, LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  backgroundColor: string;
  accentColor: string;
  onPress?: () => void;
}

/**
 * Card de acceso rápido usada en la grilla 2x1 de la pantalla Inicio.
 * Reutilizable para cualquier combinación de icono + colores.
 */
export function QuickAccessCard({
  icon: Icon,
  title,
  subtitle,
  backgroundColor,
  accentColor,
  onPress,
}: QuickAccessCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Icon size={26} color={accentColor} strokeWidth={2.2} />

      <View style={styles.bottomRow}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.arrowButton, { backgroundColor: accentColor }]}>
          <ArrowRight size={18} color={colors.surface} strokeWidth={2.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 148,
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textWrapper: {
    flexShrink: 1,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
