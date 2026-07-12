import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Quote } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface TipCardProps {
  quote: string;
  caption: string;
}

/**
 * Tarjeta motivacional con una frase inspiradora del día.
 * Fondo celeste muy suave, tono calmo y premium.
 */
export function TipCard({ quote, caption }: TipCardProps) {
  return (
    <View style={[styles.card, shadow.soft]}>
      <View style={styles.quoteIcon}>
        <Quote size={20} color={colors.accent} fill={colors.accent} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.quote}>{quote}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.accentLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  quoteIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  quote: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
