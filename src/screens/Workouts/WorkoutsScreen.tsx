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
import { useToday } from '@/hooks/useToday';
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
export function WorkoutsScreen({ navigation, route }: Props) {
  const { workouts, isLoading, isRefreshing, error, reload, refresh } = useWorkouts();
  const markedDates = useMarkedDates();
  const { stats } = useWorkoutStats();
  // null = "hoy": así la selección sigue a useToday() al pasar la medianoche,
  // pero si el usuario eligió otro día no se le pisa.
  const today = useToday();
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const selectDate = (date: string) => setPickedDate(date === today ? null : date);
  const selectedDate = pickedDate ?? today;

  // El form pasa `date` al guardar: el calendario salta a ese día. Se ajusta
  // durante el render (no en un efecto) y después se limpia el param, para
  // que guardar otra vez en la misma fecha vuelva a saltar.
  const paramDate = route.params?.date;
  const [handledParamDate, setHandledParamDate] = useState<string | undefined>(undefined);
  if (paramDate !== handledParamDate) {
    setHandledParamDate(paramDate);
    if (paramDate) selectDate(paramDate);
  }
  useEffect(() => {
    if (paramDate) navigation.setParams({ date: undefined });
  }, [paramDate, navigation]);
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

  // Spinner de pantalla completa solo en la primera carga (o "Reintentar"):
  // el pull-to-refresh usa isRefreshing y el calendario se queda donde estaba.
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
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <WorkoutCalendar
          markedDates={markedDates}
          selectedDate={selectedDate}
          onDayPress={selectDate}
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
