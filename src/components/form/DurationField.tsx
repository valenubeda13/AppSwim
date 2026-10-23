import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FieldPathByValue, FieldValues } from 'react-hook-form';
import { colors, spacing, typography } from '@/theme';
import { DurationParts, joinDuration, splitDuration } from '@/utils/time';
import { fieldStyles, FormField, FormFieldProps } from './FormField';

type PartKey = keyof DurationParts;
type PartsText = Record<PartKey, string>;

const PARTS: { key: PartKey; unit: string; placeholder: string }[] = [
  { key: 'hours', unit: 'h', placeholder: '0' },
  { key: 'minutes', unit: 'min', placeholder: '00' },
  { key: 'seconds', unit: 's', placeholder: '00' },
];

/** Segundos -> texto de cada input ("" en lo que vale 0, así se ve el placeholder). */
function toText(totalSeconds: number): PartsText {
  const parts = splitDuration(totalSeconds);
  const show = (n: number) => (n > 0 ? String(n) : '');
  return { hours: show(parts.hours), minutes: show(parts.minutes), seconds: show(parts.seconds) };
}

function toSeconds(text: PartsText): number {
  return joinDuration({
    hours: Number(text.hours) || 0,
    minutes: Number(text.minutes) || 0,
    seconds: Number(text.seconds) || 0,
  });
}

interface DurationInputProps {
  value: number;
  onChange: (seconds: number) => void;
  onBlur: () => void;
  invalid: boolean;
}

/**
 * Los tres inputs. Guardan su propio texto (si no, al borrar un "0" se
 * volvería a escribir solo) y avisan al form el total en segundos.
 */
function DurationInput({ value, onChange, onBlur, invalid }: DurationInputProps) {
  const [text, setText] = useState(() => toText(value));
  const [syncedValue, setSyncedValue] = useState(value);

  // El valor cambió desde afuera (ej. el form se completó al editar):
  // se ajusta el texto durante el render, sin efecto.
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (toSeconds(text) !== value) setText(toText(value));
  }

  const handleChange = (key: PartKey, input: string) => {
    const next = { ...text, [key]: input.replace(/\D/g, '') };
    const seconds = toSeconds(next);
    setText(next);
    setSyncedValue(seconds);
    onChange(seconds);
  };

  const handleBlur = (key: PartKey) => {
    // Normaliza "90 min" -> "1 h 30 min".
    setText(toText(value));
    // Valida recién al salir del último input, o antes si ya hay un tiempo
    // (así no aparece "Ingresá el tiempo" al pasar de horas a minutos).
    if (key === 'seconds' || value > 0) onBlur();
  };

  return (
    <View style={styles.row}>
      {PARTS.map(({ key, unit, placeholder }, index) => (
        <React.Fragment key={key}>
          {index > 0 && <Text style={styles.separator}>:</Text>}
          <View style={[fieldStyles.input, styles.part, invalid && fieldStyles.inputInvalid]}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              maxLength={2}
              placeholder={placeholder}
              placeholderTextColor={colors.textTertiary}
              value={text[key]}
              onChangeText={(input) => handleChange(key, input)}
              onBlur={() => handleBlur(key)}
              accessibilityLabel={unit === 'h' ? 'Horas' : unit === 'min' ? 'Minutos' : 'Segundos'}
            />
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

/** Tiempo total en h : min : s. En el form se guarda en segundos. */
export function DurationField<T extends FieldValues, N extends FieldPathByValue<T, number>>(
  props: Omit<FormFieldProps<T, N>, 'render'>
) {
  return (
    <FormField
      {...props}
      render={({ field: { value, onChange, onBlur }, invalid }) => (
        <DurationInput
          value={value as number}
          onChange={onChange}
          onBlur={onBlur}
          invalid={invalid}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  part: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.bodyStrong,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  separator: {
    ...typography.bodyStrong,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
});
