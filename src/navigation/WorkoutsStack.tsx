import React from 'react';
import { Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';

import { colors, spacing } from '@/theme';
import { WorkoutsListScreen } from '@/screens/WorkoutsListScreen';
import { WorkoutFormScreen } from '@/screens/WorkoutFormScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';
import { formModalOptions, rootScreenOptions, stackScreenOptions } from './stackOptions';
import { WorkoutsStackParamList } from './types';

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

const HEADER_ICON_SIZE = 24;

// Temporal hasta la card 5.4 (detalle de entrenamiento).
function WorkoutDetailPlaceholder() {
  return <PlaceholderScreen title="Detalle" edges={[]} />;
}

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
        component={WorkoutsListScreen}
        options={({ navigation }) => ({
          ...rootScreenOptions,
          title: 'Entrenamientos',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('WorkoutForm', {})}
              hitSlop={spacing.sm}
              accessibilityLabel="Nuevo entrenamiento"
            >
              <Plus size={HEADER_ICON_SIZE} color={colors.primary} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailPlaceholder}
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
