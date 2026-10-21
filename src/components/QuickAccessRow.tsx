import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { QuickAccessCard, QuickAccessCardProps } from './QuickAccessCard';

export type QuickAccessItem = QuickAccessCardProps & { key: string };

interface QuickAccessRowProps {
  items: QuickAccessItem[];
}

/**
 * Fila de accesos rápidos con el mismo ancho para cada card.
 * Sumar un acceso nuevo es agregar un item al array.
 */
export function QuickAccessRow({ items }: QuickAccessRowProps) {
  return (
    <View style={styles.row}>
      {items.map(({ key, ...item }) => (
        <QuickAccessCard key={key} {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
