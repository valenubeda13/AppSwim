import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing, typography } from '@/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useMarkedDates } from '@/hooks/useMarkedDates';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { useWorkoutsByDate } from '@/hooks/useWorkoutsByDate';
import { DayWorkoutsList, WorkoutCalendar } from '@/components';
import { toISODate } from '@/utils/date';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutsList'>;

/**
 * Tab Entrenamientos: calendario del mes + entrenamientos del día elegido.
 * Solo conecta hooks con componentes; el armado visual vive en
 * WorkoutCalendar y DayWorkoutsList.
 */
export function WorkoutsListScreen({ navigation }: Props) {
  const { isLoading, error, reload } = useWorkouts();
  const markedDates = useMarkedDates();
  const { stats } = useWorkoutStats();
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const dayWorkouts = useWorkoutsByDate(selectedDate);

  if (isLoading) {
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
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      // Necesario para que el título grande (headerLargeTitle) colapse al scrollear.
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
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
          onAddWorkout={(date) => navigation.navigate('WorkoutForm', { date })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
