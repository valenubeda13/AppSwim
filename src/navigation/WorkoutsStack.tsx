import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WorkoutDetailScreen, WorkoutFormScreen, WorkoutsScreen } from '@/screens/Workouts';
import { formModalOptions, rootScreenOptions, stackScreenOptions } from './stackOptions';
import { WorkoutsStackParamList } from './types';

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

/**
 * Stack del tab "Entrenamientos": listado -> detalle -> formulario (modal).
 * El tab navigator tiene headerShown: false, así que el header nativo se
 * habilita solo en los stacks.
 */
export function WorkoutsStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="WorkoutsList"
        component={WorkoutsScreen}
        // El alta se hace con el FAB de la pantalla (con la fecha elegida), no desde el header.
        options={{ ...rootScreenOptions, title: 'Entrenamientos' }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Entrenamiento' }}
      />
      <Stack.Screen
        name="WorkoutForm"
        component={WorkoutFormScreen}
        options={(props) => ({ ...formModalOptions(props), title: 'Entrenamiento' })}
      />
    </Stack.Navigator>
  );
}
