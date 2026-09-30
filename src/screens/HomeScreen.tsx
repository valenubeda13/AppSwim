import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar, Trophy } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing } from '@/theme';
import { getGreeting } from '@/utils/formatters';
import { useHomeStats } from '@/hooks/useHomeStats';
import { useProfile } from '@/hooks/useProfile';
import {
  HomeHeader,
  QuickAccessCard,
  SummaryCard,
  TipCard,
  SectionTitle,
} from '@/components';
import { RootTabParamList } from '@/navigation/types';

const DAILY_TIP = {
  quote: 'La disciplina de hoy es el éxito de mañana.',
  caption: 'Seguí entrenando, cada metro cuenta.',
};

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { stats, isLoading } = useHomeStats();
  const { profile } = useProfile();

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader
          userName={profile?.name ?? 'Nadador/a'}
          greeting={getGreeting()}
          streakDays={stats?.currentStreakDays ?? 0}
        />

        <View style={styles.content}>
          {/* Accesos rápidos */}
          <View style={styles.section}>
            <SectionTitle>Accesos rápidos</SectionTitle>
            <View style={styles.quickAccessRow}>
              <QuickAccessCard
                icon={Calendar}
                title="Entrenos"
                subtitle="Ver y registrar"
                backgroundColor={colors.primaryLight}
                accentColor={colors.primary}
                onPress={() => navigation.navigate('Entrenamientos')}
              />
              <View style={{ width: spacing.md }} />
              <QuickAccessCard
                icon={Trophy}
                title="Mis marcas"
                subtitle="Ver y mejorar"
                backgroundColor={colors.successLight}
                accentColor={colors.success}
                onPress={() => navigation.navigate('MisMarcas')}
              />
            </View>
          </View>

          {/* Resumen */}
          <View style={styles.section}>
            <SectionTitle>Resumen</SectionTitle>
            {isLoading || !stats ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
            ) : (
              <SummaryCard stats={stats} />
            )}
          </View>

          {/* Consejo del día */}
          <View style={styles.section}>
            <SectionTitle>Consejo del día</SectionTitle>
            <TipCard quote={DAILY_TIP.quote} caption={DAILY_TIP.caption} />
          </View>
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
  quickAccessRow: {
    flexDirection: 'row',
  },
});
