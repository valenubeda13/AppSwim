import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FieldPathByValue, FieldValues } from 'react-hook-form';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { Intensity } from '@/types';
import { INTENSITIES, INTENSITY_COLOR, INTENSITY_LABEL } from '@/constants/intensity';
import { FormField, FormFieldProps } from './FormField';

/** El celeste es claro: sobre él el texto va oscuro; en el resto, blanco. */
const SELECTED_TEXT: Record<Intensity, string> = {
  low: colors.primaryDark,
  medium: colors.textOnDark,
  high: colors.textOnDark,
  max: colors.textOnDark,
};

/**
 * Intensidad en 4 chips (Baja / Media / Alta / Máxima). Cada uno tiene su
 * color, de celeste a azul profundo; el elegido se pinta entero.
 */
export function IntensityPicker<T extends FieldValues, N extends FieldPathByValue<T, Intensity>>(
  props: Omit<FormFieldProps<T, N>, 'render'>
) {
  return (
    <FormField
      {...props}
      render={({ field: { value, onChange } }) => (
        <View style={styles.row} accessibilityRole="radiogroup">
          {INTENSITIES.map((intensity) => {
            const selected = value === intensity;
            const color = INTENSITY_COLOR[intensity];
            return (
              <TouchableOpacity
                key={intensity}
                style={[
                  styles.chip,
                  { borderColor: color },
                  selected && { backgroundColor: color },
                ]}
                activeOpacity={0.8}
                onPress={() => onChange(intensity)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                {!selected && <View style={[styles.dot, { backgroundColor: color }]} />}
                <Text
                  style={[
                    styles.label,
                    selected && { color: SELECTED_TEXT[intensity], fontFamily: fontFamily.bold },
                  ]}
                  numberOfLines={1}
                >
                  {INTENSITY_LABEL[intensity]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
