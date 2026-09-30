import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Trophy, User, FlaskConical } from 'lucide-react-native';

import { colors, fontFamily } from '@/theme';
import { HomeScreen } from '@/screens/HomeScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';
import { DevPlaygroundScreen } from '@/screens/DevPlaygroundScreen';
import { WorkoutsNavigator } from './WorkoutsNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Componente estable (no inline) para que React Navigation no lo
// desmonte/remonte en cada render del navigator.
function MisMarcasPlaceholder() {
  return <PlaceholderScreen title="Mis marcas" />;
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: 84,
          paddingTop: 8,
          paddingBottom: 22,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.semiBold,
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Entrenamientos"
        component={WorkoutsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MisMarcas"
        component={MisMarcasPlaceholder}
        options={{
          tabBarLabel: 'Mis marcas',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="Dev"
          component={DevPlaygroundScreen}
          options={{
            tabBarIcon: ({ color, size }) => <FlaskConical color={color} size={size} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}
