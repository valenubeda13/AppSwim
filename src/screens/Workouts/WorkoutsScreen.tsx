import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, spacing, typography } from '@/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useMarkedDates } from '@/hooks/useMarkedDates';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { useWorkoutsByDate } from '@/hooks/useWorkoutsByDate';
import { useDeleteWorkout } from '@/hooks/useDeleteWorkout';
import { useToast } from '@/hooks/useToast';
import { DayWorkoutsList, WorkoutCalendar } from '@/components/workouts';
import { FloatingActionButton } from '@/components/ui';
import { toISODate } from '@/utils/date';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutsList'>;

const FAB_SIZE = 56;
/** Cuántos px hay que mover el scroll en una dirección para esconder/mostrar el FAB. */
const SCROLL_THRESHOLD = 8;
/** Cuánto sube el FAB para dejar lugar al toast (alto del toast + margen). */
const TOAST_CLEARANCE = 64;

/**
 * Tab Entrenamientos: calendario del mes + entrenamientos del día elegido.
 * Solo conecta hooks con componentes; el armado visual vive en
 * WorkoutCalendar y DayWorkoutsList.
 */
export function WorkoutsScreen({ navigation }: Props) {
  const { workouts, isLoading, error, reload } = useWorkouts();
  const markedDates = useMarkedDates();
  const { stats } = useWorkoutStats();
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const dayWorkouts = useWorkoutsByDate(selectedDate);
  const deleteWithUndo = useDeleteWorkout();
  // El toast de "Deshacer" ocupa el mismo lugar que el FAB: mientras se ve, el FAB se corre.
  const { isToastVisible } = useToast();
  const fabLifted = useSharedValue(false);
  useEffect(() => {
    fabLifted.value = isToastVisible;
  }, [isToastVisible, fabLifted]);

  // FAB: se esconde al scrollear hacia abajo y vuelve al scrollear hacia arriba.
  const fabHidden = useSharedValue(false);
  const lastScrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    const y = event.contentOffset.y;
    const delta = y - lastScrollY.value;
    if (Math.abs(delta) < SCROLL_THRESHOLD) return;
    // Arriba de todo (o en el rebote de iOS) siempre visible.
    fabHidden.value = y > 0 && delta > 0;
    lastScrollY.value = y;
  });
  const fabStyle = useAnimatedStyle(() => ({
    opacity: withTiming(fabHidden.value ? 0 : 1, { duration: 180 }),
    transform: [
      {
        translateY: withTiming(
          fabHidden.value ? FAB_SIZE : fabLifted.value ? -TOAST_CLEARANCE : 0,
          { duration: 220 }
        ),
      },
      { scale: withTiming(fabHidden.value ? 0.6 : 1, { duration: 220 }) },
    ],
  }));

  // Escondido no tiene que recibir toques (si no, un tap "invisible" abre el form).
  const fabProps = useAnimatedProps(() => ({
    pointerEvents: fabHidden.value ? ('none' as const) : ('auto' as const),
  }));

  const openNewWorkout = (date: string) => navigation.navigate('WorkoutForm', { date });

  // Spinner de pantalla completa solo en la primera carga: al recargar
  // (pull-to-refresh) el calendario y la lista se quedan donde estaban.
  if (isLoading && workouts.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={reload} activeOpacity={0.85}>
          <Text style={styles.retryLabel}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        // Necesario para que el título grande (headerLargeTitle) colapse al scrollear.
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={reload} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <WorkoutCalendar
          markedDates={markedDates}
          selectedDate={selectedDate}
          onDayPress={setSelectedDate}
          monthTotals={stats.byMonth}
        />

        <View style={styles.day}>
          <DayWorkoutsList
            date={selectedDate}
            workouts={dayWorkouts}
            onPressWorkout={(workoutId) => navigation.navigate('WorkoutDetail', { workoutId })}
            onAddWorkout={openNewWorkout}
            onDeleteWorkout={deleteWithUndo}
          />
        </View>
      </Animated.ScrollView>

      {/* La tab bar no es flotante: la pantalla ya termina arriba de ella (y de
          insets.bottom), así que alcanza con un margen fijo. */}
      <Animated.View style={[styles.fab, fabStyle]} animatedProps={fabProps}>
        <FloatingActionButton
          size={FAB_SIZE}
          onPress={() => openNewWorkout(selectedDate)}
          accessibilityLabel="Registrar entrenamiento"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    // Espacio extra para que el FAB no tape la última card.
    paddingBottom: spacing.xxl + FAB_SIZE,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
  day: {
    marginTop: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  retryLabel: {
    ...typography.bodyStrong,
    color: colors.surface,
  },
});
