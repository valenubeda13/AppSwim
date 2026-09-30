import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Trophy, User } from 'lucide-react-native';

import { colors } from '@/theme';
import { HomeScreen } from '@/screens/HomeScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';
import { WorkoutsNavigator } from './WorkoutsNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

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
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      >
        {({ navigation }) => (
          <HomeScreen onNavigateToWorkouts={() => navigation.navigate('Entrenamientos')} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Entrenamientos"
        component={WorkoutsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MisMarcas"
        options={{
          tabBarLabel: 'Mis marcas',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      >
        {() => <PlaceholderScreen title="Mis marcas" />}
      </Tab.Screen>
      <Tab.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
