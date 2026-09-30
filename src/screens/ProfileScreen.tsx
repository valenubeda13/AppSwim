import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronRight, Target, Trophy, User as UserIcon } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, spacing, typography } from '@/theme';
import { useProfile } from '@/hooks/useProfile';
import { useProfileStats } from '@/hooks/useProfileStats';
import { CircularProgress, EmptyState, ProfileHeader, SectionCard } from '@/components';
import { formatMeters, parseLocalDate } from '@/utils/formatters';
import { ProfileStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

/**
 * Pantalla Perfil: header (nombre/bio/"nadador desde"), progreso de la
 * meta semanal, y datos/preferencias (nombre, meta, pileta) en filas de
 * solo lectura que abren Editar perfil (lápiz del header) para modificarse.
 * El lápiz también lleva a la bio/username/año. "Mis logros" queda en
 * "Próximamente" hasta que exista Mis Marcas.
 */
export function ProfileScreen({ navigation }: Props) {
  const { profile, isLoading, error, reload } = useProfile();
  const { stats } = useProfileStats();

  // Editar perfil (lápiz) vive en otra instancia de useProfile; se
  // refresca acá al volver para reflejar los cambios.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (isLoading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const swimmingSinceYear = profile?.swimmingSince
    ? parseLocalDate(profile.swimmingSince).getFullYear()
    : undefined;
  const weeklyGoal = profile?.goalMetersPerWeek;
  const weeklyProgress = weeklyGoal ? Math.round((stats.currentWeekMeters / weeklyGoal) * 100) : 0;
  const poolLengthLabel = profile?.preferredPoolLength
    ? `${profile.preferredPoolLength} m`
    : 'Sin definir';

  const goToEditProfile = () => navigation.navigate('EditProfile');

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProfileHeader
          name={profile?.name ?? 'Nadador/a'}
          username={profile?.username}
          bio={profile?.bio}
          avatarUrl={profile?.avatarUrl}
          gender={profile?.gender}
          swimmingSinceYear={swimmingSinceYear}
          onPressEdit={goToEditProfile}
        />

        <View style={styles.content}>
          {error && <Text style={styles.serverError}>{error}</Text>}

          <SectionCard icon={Target} title="Mis objetivos">
            {weeklyGoal ? (
              <View style={styles.goalRow}>
                <CircularProgress progress={weeklyProgress} size={84} strokeWidth={8}>
                  <Text style={styles.goalPercent}>{weeklyProgress}%</Text>
                </CircularProgress>
                <View style={styles.goalTextWrapper}>
                  <Text style={styles.goalTitle}>Meta semanal</Text>
                  <Text style={styles.goalSubtitle}>
                    {formatMeters(stats.currentWeekMeters)} m de {formatMeters(weeklyGoal)} m
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.goalEmpty}>
                Definí tu meta semanal desde el lápiz de arriba para ver acá tu progreso de la
                semana.
              </Text>
            )}
          </SectionCard>

          <SectionCard icon={UserIcon} title="Preferencias y datos">
            <TouchableOpacity style={styles.dataRow} activeOpacity={0.7} onPress={goToEditProfile}>
              <Text style={styles.dataLabel}>Meta semanal</Text>
              <View style={styles.dataValueRow}>
                <Text style={styles.dataValue} numberOfLines={1}>
                  {weeklyGoal ? `${formatMeters(weeklyGoal)} m` : 'Sin definir'}
                </Text>
                <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2.2} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dataRow, styles.dataRowBorder]}
              activeOpacity={0.7}
              onPress={goToEditProfile}
            >
              <Text style={styles.dataLabel}>Pileta preferida</Text>
              <View style={styles.dataValueRow}>
                <Text style={styles.dataValue} numberOfLines={1}>
                  {poolLengthLabel}
                </Text>
                <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2.2} />
              </View>
            </TouchableOpacity>
          </SectionCard>

          <SectionCard icon={Trophy} title="Mis logros">
            <EmptyState
              icon={Trophy}
              title="Próximamente"
              description="Cuando cargues tus marcas en Mis Marcas, tus logros van a aparecer acá."
            />
          </SectionCard>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.lg,
  },
  serverError: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalPercent: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  goalTextWrapper: {
    flex: 1,
    marginLeft: spacing.md,
  },
  goalTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  goalSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalEmpty: {
    ...typography.body,
    color: colors.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
  },
  dataRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  dataLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  dataValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: '70%',
  },
  dataValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
