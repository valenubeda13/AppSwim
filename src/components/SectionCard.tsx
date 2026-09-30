import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  rightLabel?: string;
  onPressRight?: () => void;
  children: React.ReactNode;
}

/**
 * Card blanca con header (ícono + título + link opcional a la derecha)
 * usada en Perfil para agrupar "Mis objetivos" / "Mis datos" / "Mis logros".
 */
export function SectionCard({
  icon: Icon,
  title,
  rightLabel,
  onPressRight,
  children,
}: SectionCardProps) {
  return (
    <View style={[styles.card, shadow.soft]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Icon size={18} color={colors.primary} strokeWidth={2.2} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightLabel && (
          <TouchableOpacity onPress={onPressRight} activeOpacity={0.7}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  rightLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
});
