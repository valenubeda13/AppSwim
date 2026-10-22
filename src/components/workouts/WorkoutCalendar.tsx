import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import type { MarkedDates as CalendarMarkedDates } from 'react-native-calendars/src/types';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { Card } from '@/components/ui';
import { calendarTheme } from './calendarTheme';
import type { MarkedDates } from '@/hooks/useMarkedDates';
import type { WorkoutTotals } from '@/hooks/useWorkoutStats';
import { formatMeters } from '@/utils/format';
import { MONTH_NAMES } from '@/config/calendarLocale';

interface WorkoutCalendarProps {
  /** Días con entrenamiento ("YYYY-MM-DD" -> { marked }). */
  markedDates: MarkedDates;
  /** Día seleccionado ("YYYY-MM-DD"). */
  selectedDate: string;
  onDayPress: (date: string) => void;
  /** Totales por mes ("YYYY-MM") para el mini-resumen del header. Opcional. */
  monthTotals?: Record<string, WorkoutTotals>;
}

const ARROW_SIZE = 22;

/** Minimal de XDate (lo que pasa renderHeader): solo lo que usamos. */
interface HeaderMonth {
  getFullYear(): number;
  getMonth(): number;
}

function monthSummary(totals: WorkoutTotals | undefined): string {
  if (!totals || totals.workouts === 0) return 'Sin entrenos';
  const label = totals.workouts === 1 ? 'entreno' : 'entrenos';
  return `${totals.workouts} ${label} · ${formatMeters(totals.meters)}`;
}

/**
 * Calendario mensual con un punto azul en los días con entrenamiento.
 * No sabe de dónde vienen los datos: recibe todo por props (la pantalla
 * conecta los hooks), así se puede reusar, ej. en Perfil.
 */
export function WorkoutCalendar({
  markedDates,
  selectedDate,
  onDayPress,
  monthTotals,
}: WorkoutCalendarProps) {
  // Suma la selección sobre los días marcados (sin mutar lo que viene del hook).
  const marked = useMemo<CalendarMarkedDates>(
    () => ({
      ...markedDates,
      [selectedDate]: { ...markedDates[selectedDate], selected: true },
    }),
    [markedDates, selectedDate]
  );

  const renderHeader = (month?: HeaderMonth) => {
    if (!month) return null;
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    // El año solo si no es el actual, como en formatDateLabel.
    const title =
      year === new Date().getFullYear()
        ? MONTH_NAMES[monthIndex]
        : `${MONTH_NAMES[monthIndex]} ${year}`;

    return (
      <View style={styles.header}>
        <Text style={styles.monthTitle}>{title}</Text>
        <Text style={styles.monthSummary}>{monthSummary(monthTotals?.[key])}</Text>
      </View>
    );
  };

  return (
    <Card padding="sm">
      <Calendar
        initialDate={selectedDate}
        firstDay={1}
        markedDates={marked}
        onDayPress={(day: DateData) => onDayPress(day.dateString)}
        theme={calendarTheme}
        renderHeader={renderHeader}
        renderArrow={(direction) =>
          direction === 'left' ? (
            <ChevronLeft size={ARROW_SIZE} color={colors.primary} />
          ) : (
            <ChevronRight size={ARROW_SIZE} color={colors.primary} />
          )
        }
        enableSwipeMonths
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  monthTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  monthSummary: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
