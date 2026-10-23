import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FieldPathByValue, FieldValues } from 'react-hook-form';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { formatShortDate, isISODate, parseISODate, toISODate } from '@/utils/date';
import { fieldStyles, FormField, FormFieldProps } from './FormField';

const QUICK_DATES = [
  { label: 'Hoy', offset: 0 },
  { label: 'Ayer', offset: 1 },
  { label: 'Anteayer', offset: 2 },
];

function quickDateIso(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  return toISODate(date);
}

interface DateInputProps {
  /** "YYYY-MM-DD" */
  value: string;
  onChange: (isoDate: string) => void;
  onBlur: () => void;
  invalid: boolean;
}

/**
 * Botón con la fecha ("Martes 29 sep") que abre el selector nativo: en
 * Android un diálogo, en iOS un calendario inline debajo del botón.
 */
function DateInput({ value, onChange, onBlur, invalid }: DateInputProps) {
  const [iosPickerOpen, setIosPickerOpen] = useState(false);
  const date = isISODate(value) ? parseISODate(value) : new Date();

  const select = (selected: Date) => {
    onChange(toISODate(selected));
    onBlur();
  };

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onValueChange: (_event, selected) => select(selected),
      });
    } else {
      setIosPickerOpen((open) => !open);
    }
  };

  return (
    <View>
      <Pressable
        style={[fieldStyles.input, styles.button, invalid && fieldStyles.inputInvalid]}
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel="Cambiar fecha"
      >
        <Text style={styles.value}>
          {isISODate(value) ? formatShortDate(value) : 'Elegir fecha'}
        </Text>
        <Calendar size={20} color={colors.primary} />
      </Pressable>

      {Platform.OS === 'ios' && iosPickerOpen && (
        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          locale="es-AR"
          accentColor={colors.primary}
          themeVariant="light"
          onValueChange={(_event, selected) => {
            select(selected);
            setIosPickerOpen(false);
          }}
        />
      )}

      <View style={styles.quickDatesRow}>
        {QUICK_DATES.map((quick) => {
          const iso = quickDateIso(quick.offset);
          const selected = iso === value;
          return (
            <TouchableOpacity
              key={quick.label}
              style={[styles.quickDateChip, selected && styles.quickDateChipSelected]}
              activeOpacity={0.8}
              onPress={() => select(parseISODate(iso))}
              accessibilityState={{ selected }}
            >
              <Text style={[styles.quickDateLabel, selected && styles.quickDateLabelSelected]}>
                {quick.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/** Fecha ("YYYY-MM-DD" en el form) con selector nativo y atajos Hoy / Ayer / Anteayer. */
export function DateField<T extends FieldValues, N extends FieldPathByValue<T, string>>(
  props: Omit<FormFieldProps<T, N>, 'render'>
) {
  return (
    <FormField
      {...props}
      render={({ field: { value, onChange, onBlur }, invalid }) => (
        <DateInput value={value as string} onChange={onChange} onBlur={onBlur} invalid={invalid} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  quickDatesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  quickDateChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  quickDateChipSelected: {
    backgroundColor: colors.primary,
  },
  quickDateLabel: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
  quickDateLabelSelected: {
    color: colors.surface,
  },
});
