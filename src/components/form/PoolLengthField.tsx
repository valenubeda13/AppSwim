import React from 'react';
import { FieldPathByValue, FieldValues } from 'react-hook-form';
import { SegmentedControl } from '@/components/ui';
import { PoolLength } from '@/types';
import { FormField, FormFieldProps } from './FormField';

const POOL_OPTIONS: { value: PoolLength; label: string }[] = [
  { value: 25, label: '25 m' },
  { value: 50, label: '50 m' },
];

/** Largo de pileta: 25 m / 50 m. */
export function PoolLengthField<T extends FieldValues, N extends FieldPathByValue<T, PoolLength>>(
  props: Omit<FormFieldProps<T, N>, 'render'>
) {
  return (
    <FormField
      {...props}
      render={({ field: { value, onChange } }) => (
        <SegmentedControl options={POOL_OPTIONS} value={value as PoolLength} onChange={onChange} />
      )}
    />
  );
}
