import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { localRecordRepository } from '@/services/repositories';

/**
 * Cantidad de marcas personales guardadas. Se relee cada vez que la pantalla
 * gana foco, así al volver de "Mis marcas" el número está al día.
 *
 * Provisorio: cuando Mis marcas tenga su provider compartido (como
 * WorkoutsProvider), esto pasa a derivarse de ahí.
 */
export function useRecordCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      localRecordRepository
        .getAll()
        .then((records) => {
          if (isActive) setCount(records.length);
        })
        .catch(() => {
          if (isActive) setCount(0);
        });
      return () => {
        isActive = false;
      };
    }, [])
  );

  return count;
}
