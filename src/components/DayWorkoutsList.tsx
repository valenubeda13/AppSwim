import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '@/theme';
import { Button } from './ui';
import { WorkoutCard } from './WorkoutCard';
import { Workout } from '@/types';
import { formatLongDate } from '@/utils/date';

interface DayWorkoutsListProps {
  /** Día mostrado ("YYYY-MM-DD"). */
  date: string;
  /** Entrenamientos de ese día (ya filtrados). */
  workouts: Workout[];
  onPressWorkout: (workoutId: string) => void;
  onAddWorkout: (date: string) => void;
}

const STAGGER_MS = 60;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Entrenamientos del día seleccionado en el calendario. Al cambiar de día
 * el bloque se vuelve a montar (key = fecha) y entra con fade; las cards
 * entran escalonadas.
 */
export function DayWorkoutsList({
  date,
  workouts,
  onPressWorkout,
  onAddWorkout,
}: DayWorkoutsListProps) {
  return (
    <Animated.View key={date} entering={FadeIn.duration(250)} layout={LinearTransition}>
      <Text style={styles.title}>{capitalize(formatLongDate(date))}</Text>

      {workouts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay entrenamientos este día.</Text>
          <Button
            label="Agregar entrenamiento"
            variant="secondary"
            onPress={() => onAddWorkout(date)}
          />
        </View>
      ) : (
        <View style={styles.list}>
          {workouts.map((workout, index) => (
            <Animated.View
              key={workout.id}
              entering={FadeInDown.delay(index * STAGGER_MS).duration(300)}
            >
              <WorkoutCard workout={workout} onPress={() => onPressWorkout(workout.id)} />
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
