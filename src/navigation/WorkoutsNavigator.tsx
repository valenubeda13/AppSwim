import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';

import { colors, typography } from '@/theme';
import { WorkoutsListScreen } from '@/screens/WorkoutsListScreen';
import { WorkoutFormScreen } from '@/screens/WorkoutFormScreen';
import { WorkoutsStackParamList } from './types';

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

/**
 * Stack propio del tab "Entrenamientos": listado -> alta/edición.
 * El tab navigator (BottomTabNavigator) tiene headerShown: false global,
 * así que el header nativo se habilita solo acá.
 */
export function WorkoutsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { ...typography.bodyStrong, color: colors.textPrimary },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="WorkoutsList"
        component={WorkoutsListScreen}
        options={({ navigation }) => ({
          title: 'Entrenamientos',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('WorkoutForm', {})}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Plus size={24} color={colors.primary} strokeWidth={2.4} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="WorkoutForm"
        component={WorkoutFormScreen}
        options={{ title: 'Entrenamiento' }}
      />
    </Stack.Navigator>
  );
}
