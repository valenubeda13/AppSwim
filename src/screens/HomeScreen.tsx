import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Calendar, Trophy } from 'lucide-react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { colors, spacing } from '@/theme';
import { getGreeting } from '@/utils/format';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { useProfile } from '@/hooks/useProfile';
import { useRecordCount } from '@/hooks/useRecordCount';
import { useToday } from '@/hooks/useToday';
import { getQuoteOfDay } from '@/constants/quotes';
import {
  HomeHeader,
  QuickAccessItem,
  QuickAccessRow,
  MotivationCard,
  StatsSummary,
  SectionTitle,
} from '@/components';

/** Separación entre la entrada de cada sección (efecto escalonado). */
const STAGGER_MS = 80;
const ENTER_DURATION_MS = 400;

/** Entrada de la sección n-ésima: aparece subiendo, un poco después que la anterior. */
const enterAt = (index: number) =>
  FadeInDown.delay(index * STAGGER_MS).duration(ENTER_DURATION_MS);

export function HomeScreen() {
  const navigation = useNavigation();
  const { stats, isLoading } = useWorkoutStats();
  const { profile } = useProfile();
  const isFocused = useIsFocused();
  const recordCount = useRecordCount();
  // useToday: si la app queda abierta de un día para otro, la frase cambia sola.
  const quote = getQuoteOfDay(useToday());

  const quickAccess: QuickAccessItem[] = [
    {
      key: 'workouts',
      icon: Calendar,
      title: 'Entrenamientos',
      subtitle: isLoading ? '…' : `${stats.thisMonth.workouts} este mes`,
      onPress: () => navigation.navigate('Entrenamientos', { screen: 'WorkoutsList' }),
    },
    {
      key: 'records',
      icon: Trophy,
      title: 'Mis marcas',
      subtitle:
        recordCount === null ? '…' : `${recordCount} ${recordCount === 1 ? 'marca' : 'marcas'}`,
      onPress: () => navigation.navigate('MisMarcas', { screen: 'RecordsList' }),
    },
  ];

  return (
    <View style={styles.root}>
      {/* Texto claro en el status bar mientras se ve la foto del header */}
      {isFocused && <StatusBar style="light" />}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* El header solo hace fade: si bajara, dejaría un hueco bajo el status bar */}
        <Animated.View entering={FadeIn.duration(ENTER_DURATION_MS)}>
          <HomeHeader
            userName={profile?.name}
            greeting={getGreeting()}
            streakDays={stats.streakDays}
          />
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={enterAt(1)} style={styles.section}>
            <SectionTitle>Accesos rápidos</SectionTitle>
            <QuickAccessRow items={quickAccess} />
          </Animated.View>

          <Animated.View entering={enterAt(2)} style={styles.section}>
            <StatsSummary />
          </Animated.View>

          <Animated.View entering={enterAt(3)} style={styles.section}>
            <SectionTitle>Frase del día</SectionTitle>
            <MotivationCard quote={quote} />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
});
