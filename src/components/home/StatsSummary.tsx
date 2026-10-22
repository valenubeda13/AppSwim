import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Activity, LucideIcon, Timer, Waves } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { SectionTitle, SegmentedControl, StatCard } from '@/components/ui';
import { useCountUp } from '@/hooks/useCountUp';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { formatMetersParts, formatNumber, ValueWithUnit } from '@/utils/format';
import { formatDurationParts } from '@/utils/time';

type Period = 'month' | 'total';

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'month', label: 'Este mes' },
  { value: 'total', label: 'Total' },
];

const EMPTY_MESSAGE: Record<Period, string> = {
  month: 'Todavía no nadaste este mes. ¡El primer entreno es el que más cuesta! 🏊',
  total: 'Cuando registres tu primer entreno, acá vas a ver todo tu progreso.',
};

interface AnimatedStatCardProps {
  icon: LucideIcon;
  /** Número crudo (cantidad, metros o segundos): es lo que se anima. */
  target: number;
  format: (value: number) => ValueWithUnit;
  label: string;
  iconColor: string;
  iconBackground: string;
}

/** StatCard cuyo número cuenta desde 0 (o desde el valor anterior). */
function AnimatedStatCard({ target, format, ...card }: AnimatedStatCardProps) {
  const { value, unit } = format(useCountUp(target));
  return <StatCard {...card} value={value} unit={unit || undefined} style={styles.card} />;
}

const formatCount = (value: number): ValueWithUnit => ({ value: formatNumber(value), unit: '' });

/**
 * Resumen de la Home: entrenamientos, metros y tiempo, del mes o de siempre.
 * Solo muestra: los totales los calcula useWorkoutStats, así que si mañana
 * vienen de otro lado (ej. Supabase) este componente no cambia.
 */
export function StatsSummary() {
  const { stats, isLoading } = useWorkoutStats();
  const [period, setPeriod] = useState<Period>('month');

  const totals = period === 'month' ? stats.thisMonth : stats.total;

  return (
    <View>
      <View style={styles.header}>
        <SectionTitle style={styles.title}>Resumen</SectionTitle>
        <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} size="sm" />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <>
          <View style={styles.row}>
            <AnimatedStatCard
              icon={Activity}
              target={totals.workouts}
              format={formatCount}
              label="Entrenos"
              iconColor={colors.primary}
              iconBackground={colors.primaryLight}
            />
            <AnimatedStatCard
              icon={Waves}
              target={totals.meters}
              format={formatMetersParts}
              label="Metros"
              iconColor={colors.accent}
              iconBackground={colors.accentLight}
            />
            <AnimatedStatCard
              icon={Timer}
              target={totals.seconds}
              format={formatDurationParts}
              label="Tiempo"
              iconColor={colors.tertiary}
              iconBackground={colors.tertiaryLight}
            />
          </View>

          {totals.workouts === 0 && <Text style={styles.emptyText}>{EMPTY_MESSAGE[period]}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    padding: spacing.sm + 4,
  },
  loader: {
    marginTop: spacing.lg,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
