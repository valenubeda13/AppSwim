import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Waves, Timer } from 'lucide-react-native';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import { Workout } from '@/types';
import { formatDateLabel, formatMeters } from '@/utils/formatters';

interface WorkoutListItemProps {
  workout: Workout;
  onPress?: () => void;
}

const INTENSITY_LABEL: Record<Workout['intensity'], string> = {
  suave: 'Suave',
  moderada: 'Moderada',
  alta: 'Alta',
};

const INTENSITY_COLOR: Record<Workout['intensity'], { text: string; background: string }> = {
  suave: { text: colors.success, background: colors.successLight },
  moderada: { text: colors.primary, background: colors.primaryLight },
  alta: { text: '#D14343', background: '#FBEAEA' },
};

/**
 * Fila de la lista de Entrenamientos: fecha, pileta, metros, duración
 * e intensidad. Tap navega al formulario en modo edición.
 */
export function WorkoutListItem({ workout, onPress }: WorkoutListItemProps) {
  const intensity = INTENSITY_COLOR[workout.intensity];

  return (
    <TouchableOpacity style={[styles.card, shadow.soft]} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{formatDateLabel(workout.date)}</Text>
        <View style={[styles.badge, { backgroundColor: intensity.background }]}>
          <Text style={[styles.badgeLabel, { color: intensity.text }]}>
            {INTENSITY_LABEL[workout.intensity]}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Waves size={16} color={colors.accent} strokeWidth={2.2} />
          <Text style={styles.metricValue}>{formatMeters(workout.totalMeters)} m</Text>
        </View>
        <View style={styles.metric}>
          <Timer size={16} color="#8B5CF6" strokeWidth={2.2} />
          <Text style={styles.metricValue}>{workout.totalTimeMinutes} min</Text>
        </View>
        <Text style={styles.poolLength}>Pileta {workout.poolLength} m</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeLabel: {
    ...typography.caption,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  poolLength: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: 'auto',
  },
});
