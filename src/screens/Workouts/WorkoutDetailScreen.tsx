import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ellipsis, Flame, Gauge, Layers, Pencil, Timer } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing } from '@/theme';
import { useWorkout } from '@/hooks/useWorkout';
import { useDeleteWorkout } from '@/hooks/useDeleteWorkout';
import { NotesCard, SetsList, WorkoutHero, WorkoutMetric } from '@/components/workouts';
import { Card, SectionTitle } from '@/components/ui';
import { pacePer100Seconds } from '@/utils/stats';
import { formatDuration, formatMinSec } from '@/utils/time';
import { WorkoutsStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'WorkoutDetail'>;

const HEADER_ICON_SIZE = 22;

/**
 * Detalle completo de un entrenamiento: hero, métricas, series y notas.
 * Si el entreno deja de existir (se borró desde acá o desde el formulario)
 * vuelve atrás solo.
 */
export function WorkoutDetailScreen({ navigation, route }: Props) {
  const { workoutId } = route.params;
  const { workout, isLoading } = useWorkout(workoutId);
  const isFocused = useIsFocused();

  // Un solo camino para "ya no existe": sirve después de eliminar y si se
  // llega con un id viejo. Solo con foco: si se borró desde el formulario
  // (modal encima), el form ya hace su goBack y recién ahí volvemos nosotros;
  // dos goBack juntos sacarían al usuario del tab.
  useEffect(() => {
    if (isFocused && !isLoading && !workout && navigation.canGoBack()) navigation.goBack();
  }, [isFocused, isLoading, workout, navigation]);

  const deleteWithUndo = useDeleteWorkout();

  // Sin "¿estás segura?": borra y el toast ofrece "Deshacer". El efecto de
  // arriba vuelve al calendario al desaparecer el entreno.
  const handleDelete = useCallback(() => {
    if (workout) void deleteWithUndo(workout);
  }, [deleteWithUndo, workout]);

  const openMoreMenu = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Eliminar entrenamiento', 'Cancelar'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (index) => {
          if (index === 0) handleDelete();
        }
      );
    } else {
      // Android no tiene action sheet nativo: un diálogo con las opciones hace de menú.
      Alert.alert('Entrenamiento', undefined, [
        { text: 'Eliminar entrenamiento', style: 'destructive', onPress: handleDelete },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    }
  }, [handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => navigation.navigate('WorkoutForm', { workoutId })}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Editar entrenamiento"
          >
            <Pencil size={HEADER_ICON_SIZE} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={openMoreMenu}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Más opciones"
          >
            <Ellipsis size={HEADER_ICON_SIZE} color={colors.primary} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, workoutId, openMoreMenu]);

  if (!workout) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const pace = pacePer100Seconds(workout.durationSeconds, workout.totalMeters);
  const setsCount = workout.sets.length;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <WorkoutHero workout={workout} />

      <Card style={styles.metricsCard}>
        <View style={styles.grid}>
          <View style={styles.cell}>
            <WorkoutMetric
              icon={Timer}
              value={formatDuration(workout.durationSeconds)}
              label="Tiempo total"
              iconColor={colors.tertiary}
              iconBackground={colors.tertiaryLight}
            />
          </View>
          <View style={styles.cell}>
            <WorkoutMetric
              icon={Gauge}
              value={pace === null ? '—' : `${formatMinSec(pace)} /100 m`}
              label="Ritmo promedio"
              iconColor={colors.accent}
              iconBackground={colors.accentLight}
            />
          </View>
          <View style={styles.cell}>
            <WorkoutMetric
              icon={Flame}
              // Las calorías todavía no se cargan en el formulario.
              value={workout.calories ? `${workout.calories} kcal` : '— kcal'}
              label="Calorías"
              iconColor={colors.error}
              iconBackground={colors.errorLight}
            />
          </View>
          <View style={styles.cell}>
            <WorkoutMetric
              icon={Layers}
              value={String(setsCount)}
              label={setsCount === 1 ? 'Serie' : 'Series'}
            />
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <SectionTitle>Series</SectionTitle>
        <SetsList sets={workout.sets} />
      </View>

      {workout.notes?.trim() ? (
        <View style={styles.section}>
          <SectionTitle>Notas</SectionTitle>
          <NotesCard notes={workout.notes} />
        </View>
      ) : null}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  metricsCard: {
    marginTop: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
  },
  cell: {
    width: '50%',
    paddingRight: spacing.sm,
  },
  section: {
    marginTop: spacing.xl,
  },
});
