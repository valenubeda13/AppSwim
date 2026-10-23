import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { colors, radius, spacing, typography } from '@/theme';

export interface FormFieldRenderProps<T extends FieldValues, N extends FieldPath<T>> {
  field: ControllerRenderProps<T, N>;
  /** true si el campo tiene error (para pintar el borde en rojo). */
  invalid: boolean;
}

export interface FormFieldProps<T extends FieldValues, N extends FieldPath<T>> {
  /**
   * `control` de useForm: de acá TS infiere los nombres de campo válidos.
   * El tercer genérico (valores ya transformados por Zod) no le importa al campo.
   */
  control: Control<T, any, any>;
  name: N;
  label: string;
  render: (props: FormFieldRenderProps<T, N>) => ReactElement;
}

/**
 * Base de todos los campos del formulario: label arriba, el input que arma
 * `render` y el mensaje de error debajo. Se conecta a React Hook Form con un
 * Controller; las reglas no van acá sino en el esquema de Zod.
 *
 *   <FormField control={control} name="date" label="Fecha" render={({ field }) => ...} />
 */
export function FormField<T extends FieldValues, N extends FieldPath<T>>({
  control,
  name,
  label,
  render,
}: FormFieldProps<T, N>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          {render({ field, invalid: Boolean(error) })}
          {error?.message ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

/** Estilos compartidos por los inputs de los campos (mismo look en todos). */
export const fieldStyles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.textPrimary,
  },
  inputInvalid: {
    borderColor: colors.error,
  },
});

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
