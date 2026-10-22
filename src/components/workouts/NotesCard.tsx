import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '@/theme';
import { Card } from '@/components/ui';

interface NotesCardProps {
  notes?: string;
}

/** Notas del entreno completas. Si no hay notas (o son solo espacios), no se muestra. */
export function NotesCard({ notes }: NotesCardProps) {
  const text = notes?.trim();
  if (!text) return null;

  return (
    <Card>
      <Text style={styles.text}>{text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
