# SwimApp — Pantalla Inicio

App móvil para nadadores construida con **Expo + React Native + TypeScript**.
Este primer entregable implementa completamente la pantalla **Inicio** y deja
armada la navegación de las 4 pestañas (las otras 3 son placeholders "Próximamente").

## Cómo correrlo

```bash
npm install --legacy-peer-deps
npx expo install expo-status-bar expo-linear-gradient react-native-safe-area-context react-native-screens react-native-svg @react-native-async-storage/async-storage
npx expo start
```

> El proyecto está fijado a **Expo SDK 54** (la versión disponible actualmente
> en la App Store para iPhone). El segundo comando (`npx expo install ...`)
> es a propósito: deja que el propio Expo elija la versión exacta y correcta
> de cada paquete nativo para esta SDK, en vez de fijarla a mano en el
> `package.json` — así evitamos conflictos de versiones.

Escaneá el QR con la app **Expo Go** (Android/iOS) o presioná `i` / `a`
para abrir en un simulador.

> **Windows**: instalá el proyecto en una carpeta local normal (ej: `D:\swim-app`),
> nunca dentro de una carpeta sincronizada por OneDrive/Google Drive/Dropbox —
> puede corromper la instalación de `node_modules`.

> La imagen del header (`src/assets/images/header-swimmer.jpg`) es un
> placeholder generado con degradado azul. Reemplazala por una foto real
> de natación para el look final "premium" — mismo nombre de archivo,
> mismas proporciones (aprox. 900x700 o mayor, orientación vertical/cuadrada).

## Estructura del proyecto

```
swim-app/
├── App.tsx                        # Entry point: NavigationContainer + SafeAreaProvider
├── src/
│   ├── theme/
│   │   ├── colors.ts               # Paleta de colores (único lugar para tocar color)
│   │   ├── typography.ts           # Escala tipográfica
│   │   ├── spacing.ts              # Espaciados, radios y sombras
│   │   └── index.ts                # Barrel export
│   ├── types/
│   │   └── index.ts                # Modelos: Workout, PersonalRecord, HomeStats, etc.
│   ├── utils/
│   │   └── formatters.ts           # formatMeters, formatDuration, getGreeting
│   ├── services/
│   │   ├── storage.ts              # Wrapper tipado sobre AsyncStorage
│   │   └── workoutService.ts       # CRUD de entrenamientos (con datos demo)
│   ├── hooks/
│   │   └── useHomeStats.ts         # Calcula estadísticas del mes para la Home
│   ├── components/                 # Piezas reutilizables y chicas (una responsabilidad c/u)
│   │   ├── HomeHeader.tsx          # Foto + degradado + saludo + racha + ola
│   │   ├── StreakBadge.tsx         # Pastilla "Racha actual"
│   │   ├── WaveShape.tsx           # SVG de la ola que cierra el header
│   │   ├── QuickAccessCard.tsx     # Card de "Entrenamientos" / "Mis marcas"
│   │   ├── StatItem.tsx            # Un valor dentro del resumen
│   │   ├── SummaryCard.tsx         # Card blanca con los 3 StatItem + divisores
│   │   ├── TipCard.tsx             # Card "Consejo del día"
│   │   └── SectionTitle.tsx        # Título de sección reutilizable
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Compone todo lo anterior → pantalla Inicio
│   │   └── PlaceholderScreen.tsx   # Placeholder temporal de las otras 3 pestañas
│   └── navigation/
│       ├── BottomTabNavigator.tsx  # Tab bar inferior con los 4 íconos
│       └── types.ts                # Tipado del param list de navegación
```

## Por qué está organizado así

- **`theme/`** centraliza colores, tipografía y espaciados. Ningún componente
  tiene un color o `fontSize` "hardcodeado" suelto — todo sale de acá, así
  cambiar la paleta o el tono de azul se hace en un solo lugar.
- **`components/`** son piezas chicas y con una sola responsabilidad
  (ninguna pasa las ~90 líneas). `HomeScreen.tsx` solo las **compone**,
  no tiene lógica de UI compleja adentro.
- **`services/` + `hooks/`** separan el acceso a datos (AsyncStorage) de la
  UI. Cuando construyamos la pantalla "Entrenamientos", `workoutService`
  se reutiliza tal cual — la Home ya está preparada para reflejar datos reales.
- **`types/`** define el modelo de dominio (`Workout`, `PersonalRecord`, etc.)
  una sola vez, compartido por toda la app.

## Qué implementa esta pantalla

- ✅ Header con foto, degradado, saludo personalizado dinámico según la hora
  (`getGreeting()`), racha actual y ola decorativa.
- ✅ Botón de notificaciones (campanita) con indicador.
- ✅ Accesos rápidos a "Entrenamientos" y "Mis marcas" (`onPress` listos para
  conectar a la navegación real).
- ✅ Resumen con 3 estadísticas (entrenamientos, metros, tiempo) calculadas
  dinámicamente a partir de los entrenamientos guardados en AsyncStorage
  (con datos demo la primera vez que se abre la app).
- ✅ Tarjeta motivacional "Consejo del día".
- ✅ Bottom tab bar con los 4 íconos (Inicio, Entrenamientos, Mis marcas, Perfil).

## Próximos pasos (cuando confirmes que esta pantalla está OK)

1. Pantalla **Entrenamientos**: calendario mensual + detalle + FAB "+".
2. Pantalla **Nuevo Entrenamiento** (formulario con `react-hook-form`).
3. Pantalla **Mis marcas**.
4. Pantalla **Perfil**.
