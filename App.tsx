import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
// Imports por subpath (no desde la raíz del paquete): la raíz reexporta
// los 18 estilos de Inter y los 18 quedarían en el bundle aunque solo se
// usen 5. Por subpath, Metro solo empaqueta el .ttf que se pide.
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';

import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';

// Se llama en scope global (no adentro de App) para que el splash nativo
// quede visible hasta que las fuentes terminen de cargar.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const isReady = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
