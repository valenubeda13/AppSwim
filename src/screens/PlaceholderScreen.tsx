import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

interface PlaceholderScreenProps {
  title: string;
}

/**
 * Pantalla temporal. Se reemplaza por la pantalla real en el
 * siguiente paso del desarrollo (Entrenamientos, Mis marcas, Perfil).
 */
export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Próximamente 🚧</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
