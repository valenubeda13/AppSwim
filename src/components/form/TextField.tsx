import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { FieldPathByValue, FieldValues } from 'react-hook-form';
import { colors, spacing, typography } from '@/theme';
import { fieldStyles, FormField, FormFieldProps } from './FormField';

type InputProps = Pick<
  TextInputProps,
  'placeholder' | 'keyboardType' | 'multiline' | 'maxLength' | 'autoCapitalize'
>;

export interface TextFieldProps<T extends FieldValues, N extends FieldPathByValue<T, string>>
  extends Omit<FormFieldProps<T, N>, 'render'>, InputProps {
  /** Unidad pegada al input, a la derecha (ej. "m"). */
  suffix?: string;
  /** Muestra "120/500" debajo. Requiere `maxLength`. */
  showCounter?: boolean;
}

/**
 * Campo de texto (una línea o multilínea). Sirve también para números: el
 * valor queda como texto y el esquema de Zod lo convierte al guardar.
 *
 *   <TextField control={control} name="totalMeters" label="Metros totales"
 *     keyboardType="number-pad" suffix="m" />
 */
export function TextField<T extends FieldValues, N extends FieldPathByValue<T, string>>({
  control,
  name,
  label,
  suffix,
  showCounter,
  ...inputProps
}: TextFieldProps<T, N>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      render={({ field: { value, onChange, onBlur }, invalid }) => (
        <View>
          <View
            style={[
              fieldStyles.input,
              styles.box,
              inputProps.multiline && styles.multilineBox,
              invalid && fieldStyles.inputInvalid,
            ]}
          >
            <TextInput
              {...inputProps}
              style={[styles.input, inputProps.multiline && styles.multilineInput]}
              placeholderTextColor={colors.textTertiary}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
          </View>
          {showCounter && inputProps.maxLength ? (
            <Text style={styles.counter}>
              {(value as string).length}/{inputProps.maxLength}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  // El borde y el fondo los pone el contenedor, así el sufijo queda adentro.
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 0,
  },
  multilineBox: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  suffix: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  counter: {
    ...typography.statLabel,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});
