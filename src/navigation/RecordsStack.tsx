import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlaceholderScreen } from '@/screens/Placeholder';
import { formModalOptions, rootScreenOptions, stackScreenOptions } from './stackOptions';
import { RecordsStackParamList } from './types';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

// Placeholders estables (no inline) hasta que existan las pantallas reales
// de Mis marcas. El header lo pone el stack, por eso edges vacío.
function RecordsListPlaceholder() {
  return <PlaceholderScreen title="Mis marcas" edges={[]} />;
}
function RecordDetailPlaceholder() {
  return <PlaceholderScreen title="Detalle de marca" edges={[]} />;
}
function RecordFormPlaceholder() {
  return <PlaceholderScreen title="Nueva marca" edges={[]} />;
}

/** Stack del tab "Mis marcas": listado -> detalle -> formulario (modal). */
export function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="RecordsList"
        component={RecordsListPlaceholder}
        options={{ ...rootScreenOptions, title: 'Mis marcas' }}
      />
      <Stack.Screen
        name="RecordDetail"
        component={RecordDetailPlaceholder}
        options={{ title: 'Marca' }}
      />
      <Stack.Screen
        name="RecordForm"
        component={RecordFormPlaceholder}
        options={(props) => ({ ...formModalOptions(props), title: 'Marca' })}
      />
    </Stack.Navigator>
  );
}
