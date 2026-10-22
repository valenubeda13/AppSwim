import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react-native';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { SwimStroke } from '@/types';
import { STROKE_LABEL } from '@/constants/strokes';
import { formatMeters } from '@/utils/format';
import { emptySetFormValues, SetFormValues, sumSetsMeters } from '@/utils/sets';

/** La parte del formulario que toca este editor (el resto del form puede tener más campos). */
export interface SetsFormValues {
  sets: SetFormValues[];
  totalMeters: string;
}

const STROKES = Object.keys(STROKE_LABEL) as SwimStroke[];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const isPositiveInt = (value: string) => /^\d+$/.test(value) && Number(value) > 0;

/**
 * Editor de series del formulario de entrenamiento: agregar, editar y
 * borrar series ("4 × 100 m crol · desc. 20 s"). Lee el form con
 * useFormContext, así que tiene que estar dentro de un <FormProvider>.
 *
 * Si la suma de las series no coincide con los metros totales, ofrece
 * usarla como total (no lo pisa solo: puede haber metros sueltos fuera de
 * las series, como la entrada en calor).
 */
export function SetsEditor() {
  const { control, setValue, formState } = useFormContext<SetsFormValues>();
  // keyName: el id propio de cada serie ya se llama `id`; RHF usa otro campo para el key.
  const { fields, append, remove } = useFieldArray({ control, name: 'sets', keyName: 'key' });

  const sets = useWatch({ control, name: 'sets' }) ?? [];
  const totalMeters = useWatch({ control, name: 'totalMeters' });
  const setsMeters = sumSetsMeters(
    sets.map((s) => ({
      repetitions: Number(s.repetitions) || 0,
      distance: Number(s.distance) || 0,
    }))
  );
  const showUseSum = setsMeters > 0 && String(setsMeters) !== totalMeters;

  return (
    <View>
      {fields.map((field, index) => {
        const errors = formState.errors.sets?.[index];
        return (
          <View key={field.key} style={styles.setCard}>
            <View style={styles.setHeader}>
              <Text style={styles.setTitle}>Serie {index + 1}</Text>
              <Pressable
                onPress={() => remove(index)}
                hitSlop={spacing.sm}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar serie ${index + 1}`}
              >
                <Trash2 size={18} color={colors.error} />
              </Pressable>
            </View>

            <View style={styles.numbersRow}>
              <View style={styles.numberField}>
                <Text style={styles.smallLabel}>Repet.</Text>
                <Controller
                  control={control}
                  name={`sets.${index}.repetitions`}
                  rules={{ validate: (v) => isPositiveInt(v) || 'Mayor a 0' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>

              <Text style={styles.times}>×</Text>

              <View style={styles.numberField}>
                <Text style={styles.smallLabel}>Metros</Text>
                <Controller
                  control={control}
                  name={`sets.${index}.distance`}
                  rules={{ validate: (v) => isPositiveInt(v) || 'Mayor a 0' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>

              <View style={styles.numberField}>
                <Text style={styles.smallLabel}>Desc. (s)</Text>
                <Controller
                  control={control}
                  name={`sets.${index}.rest`}
                  rules={{ validate: (v) => !v.trim() || /^\d+$/.test(v) || 'Número' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="—"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="number-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
            </View>
            {(errors?.repetitions || errors?.distance || errors?.rest) && (
              <Text style={styles.fieldError}>
                {errors.repetitions?.message ?? errors.distance?.message ?? errors.rest?.message}
              </Text>
            )}

            <Controller
              control={control}
              name={`sets.${index}.stroke`}
              render={({ field: { onChange, value } }) => (
                <View style={styles.strokes}>
                  {STROKES.map((stroke) => {
                    const selected = value === stroke;
                    return (
                      <TouchableOpacity
                        key={stroke}
                        style={[styles.strokeChip, selected && styles.strokeChipSelected]}
                        activeOpacity={0.8}
                        onPress={() => onChange(stroke)}
                        accessibilityState={{ selected }}
                      >
                        <Text style={[styles.strokeLabel, selected && styles.strokeLabelSelected]}>
                          {capitalize(STROKE_LABEL[stroke])}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />

            <Controller
              control={control}
              name={`sets.${index}.description`}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Detalle (opcional): con paletas, progresivo..."
                  placeholderTextColor={colors.textTertiary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => append(emptySetFormValues())}
      >
        <Plus size={18} color={colors.primary} strokeWidth={2.5} />
        <Text style={styles.addLabel}>Agregar serie</Text>
      </TouchableOpacity>

      {setsMeters > 0 && (
        <View style={styles.sumRow}>
          <Text style={styles.sumText}>Suma de las series: {formatMeters(setsMeters)}</Text>
          {showUseSum && (
            <Pressable
              onPress={() => setValue('totalMeters', String(setsMeters), { shouldValidate: true })}
              hitSlop={spacing.sm}
            >
              <Text style={styles.sumAction}>Usar como total</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  setCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  numbersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  numberField: {
    flex: 1,
  },
  smallLabel: {
    ...typography.statLabel,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  times: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
    paddingBottom: spacing.sm + 2,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  descriptionInput: {
    ...typography.caption,
  },
  fieldError: {
    ...typography.caption,
    color: colors.error,
  },
  strokes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  strokeChip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.background,
  },
  strokeChipSelected: {
    backgroundColor: colors.primary,
  },
  strokeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  strokeLabelSelected: {
    color: colors.surface,
    fontFamily: fontFamily.bold,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  addLabel: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  sumRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sumText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sumAction: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
});
