import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Waves } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing, typography } from '@/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { EmptyState, WorkoutListItem } from '@/components';
import { Workout } from '@/types';
import { formatMonthTitle } from '@/utils/formatters';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutsList'>;

interface WorkoutSection {
  title: string;
  data: Workout[];
}

function groupByMonth(workouts: Workout[]): WorkoutSection[] {
  const sections: WorkoutSection[] = [];
  const indexByKey = new Map<string, number>();

  for (const workout of workouts) {
    const key = workout.date.slice(0, 7);
    let index = indexByKey.get(key);
    if (index === undefined) {
      index = sections.length;
      indexByKey.set(key, index);
      sections.push({ title: formatMonthTitle(workout.date), data: [] });
    }
    sections[index].data.push(workout);
  }

  return sections;
}

export function WorkoutsListScreen({ navigation }: Props) {
  const { workouts, isLoading, error, reload } = useWorkouts();
  const sections = useMemo(() => groupByMonth(workouts), [workouts]);

  // El formulario (alta/edición/borrado) vive en otra instancia de
  // useWorkouts; se refresca acá al volver para reflejar los cambios.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

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

  if (workouts.length === 0) {
    return (
      <View style={styles.centered}>
        <EmptyState
          icon={Waves}
          title="Todavía no cargaste entrenamientos"
          description="Registrá tu primera sesión para empezar a ver tu progreso."
          ctaLabel="Agregar entrenamiento"
          onPressCta={() => navigation.navigate('WorkoutForm', {})}
        />
      </View>
    );
  }

  return (
    <SectionList
      style={styles.root}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
      renderItem={({ item }) => (
        <WorkoutListItem
          workout={item}
          onPress={() => navigation.navigate('WorkoutForm', { workoutId: item.id })}
        />
      )}
      onRefresh={reload}
      refreshing={false}
    />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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
