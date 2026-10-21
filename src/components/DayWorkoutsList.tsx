import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Waves } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { EmptyState } from './ui';
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
        <EmptyState
          icon={Waves}
          title="Sin entrenamientos este día"
          description="Elegí otro día en el calendario o registrá uno nuevo."
          ctaLabel="Registrar entrenamiento"
          onPressCta={() => onAddWorkout(date)}
        />
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
});
