import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Waves } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing, typography } from '@/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutListItem } from '@/components';
import { EmptyState } from '@/components/ui';
import { Workout } from '@/types';
import { formatMonthTitle } from '@/utils/date';
import { groupByMonth } from '@/utils/stats';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutsList'>;

interface WorkoutSection {
  title: string;
  data: Workout[];
}

function toSections(workouts: Workout[]): WorkoutSection[] {
  return groupByMonth(workouts).map(({ month, workouts: data }) => ({
    title: formatMonthTitle(`${month}-01`),
    data,
  }));
}

export function WorkoutsListScreen({ navigation }: Props) {
  const { workouts, isLoading, error, reload } = useWorkouts();
  const sections = useMemo(() => toSections(workouts), [workouts]);

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
      // Necesario para que el título grande (headerLargeTitle) colapse al scrollear.
      contentInsetAdjustmentBehavior="automatic"
      sections={sections}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
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
