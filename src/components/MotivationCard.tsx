import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Quote as QuoteIcon } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import type { Quote } from '@/constants/quotes';

const DEFAULT_CAPTION = 'Seguí entrenando, cada metro cuenta.';

interface MotivationCardProps {
  quote: Quote;
}

/**
 * Tarjeta motivacional con la frase del día.
 * Fondo celeste muy suave, tono calmo y premium. Solo muestra; qué frase
 * toca lo decide getQuoteOfDay. Si la frase tiene autor, va en lugar del
 * caption fijo.
 */
export function MotivationCard({ quote }: MotivationCardProps) {
  return (
    <View style={[styles.card, shadow.soft]}>
      <View style={styles.quoteIcon}>
        <QuoteIcon size={20} color={colors.accent} fill={colors.accent} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.quote}>{quote.text}</Text>
        <Text style={styles.caption}>{quote.author ? `— ${quote.author}` : DEFAULT_CAPTION}</Text>
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
