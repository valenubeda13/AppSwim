import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Bell, Settings, Trash2, Waves, Timer } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  FloatingActionButton,
  IconButton,
  Screen,
  SectionHeader,
  SegmentedControl,
  StatCard,
} from '@/components/ui';
import { getItem, removeItem, setItem, STORAGE_KEYS } from '@/services/storage';
import { workoutRepository } from '@/services/repositories';
import { toISODate } from '@/utils/date';
import { useWorkouts } from '@/hooks/useWorkouts';
import { clearSeedWorkouts, SEED_NOTE, seedWorkouts } from '@/utils/dev/seedWorkouts';

interface StorageProbe {
  savedAt: string;
  counter: number;
}

const POOL_OPTIONS: { value: 25 | 50; label: string }[] = [
  { value: 25, label: '25 m' },
  { value: 50, label: '50 m' },
];

/**
 * Pantalla de prueba de las cards 1.3/1.4: muestra los "ladrillos" de ui/
 * juntos para revisar look & feel en iOS/Android antes de usarlos en
 * pantallas reales. Temporal: se borra (junto con su ruta en la
 * navegación) una vez verificada.
 */
export function DevPlaygroundScreen() {
  const [loading, setLoading] = useState(false);
  const [poolLength, setPoolLength] = useState<25 | 50>(25);
  const [probe, setProbe] = useState<StorageProbe | null>(null);

  // Al abrir, lee lo guardado: si sobrevive a cerrar y reabrir la app, el
  // storage persiste (criterio de hecho de la card 2.2).
  useEffect(() => {
    void (async () => {
      setProbe(await getItem<StorageProbe>(STORAGE_KEYS.devPlayground));
    })();
  }, []);

  const saveProbe = async () => {
    const next: StorageProbe = {
      savedAt: new Date().toISOString(),
      counter: (probe?.counter ?? 0) + 1,
    };
    await setItem(STORAGE_KEYS.devPlayground, next);
    setProbe(next);
  };

  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const [seedBusy, setSeedBusy] = useState(false);
  const seedCount = workouts.filter((w) => w.notes === SEED_NOTE).length;

  // Pasa por el WorkoutsProvider: Inicio, Entrenamientos y Perfil se
  // actualizan solas con los datos de ejemplo.
  const runSeed = async (action: 'load' | 'clear') => {
    setSeedBusy(true);
    try {
      if (action === 'load') await seedWorkouts(addWorkout);
      else await clearSeedWorkouts(workouts, deleteWorkout);
    } finally {
      setSeedBusy(false);
    }
  };

  const [crudLog, setCrudLog] = useState<string[]>([]);
  const [crudRunning, setCrudRunning] = useState(false);

  /**
   * CRUD completo de un workout contra el repositorio (criterio de hecho de
   * la card 2.3). Crea, lee, edita y borra un entreno de prueba; al final
   * no queda nada guardado.
   */
  const runWorkoutCrud = async () => {
    const log: string[] = [];
    const step = (ok: boolean, text: string) => {
      log.push(`${ok ? '✓' : '✗'} ${text}`);
      setCrudLog([...log]);
      if (!ok) throw new Error(text);
    };

    setCrudRunning(true);
    setCrudLog([]);
    let createdId: string | null = null;
    try {
      const created = await workoutRepository.create({
        date: toISODate(new Date()),
        poolLength: 25,
        totalMeters: 1500,
        durationSeconds: 1800,
        intensity: 'medium',
        sets: [],
        notes: 'Entreno de prueba (DevPlayground)',
      });
      createdId = created.id;
      step(Boolean(created.id && created.createdAt), `create → id ${created.id.slice(0, 8)}…`);

      const read = await workoutRepository.getById(created.id);
      step(read?.totalMeters === 1500, 'getById → lo encuentra con 1500 m');

      const all = await workoutRepository.getAll();
      step(
        all.some((w) => w.id === created.id),
        `getAll → aparece en la lista (${all.length} en total)`
      );

      const updated = await workoutRepository.update(created.id, { totalMeters: 2000 });
      step(
        updated.totalMeters === 2000 && updated.updatedAt >= created.updatedAt,
        'update → 2000 m y updatedAt nuevo'
      );

      await workoutRepository.remove(created.id);
      createdId = null;
      step((await workoutRepository.getById(created.id)) === null, 'remove → ya no existe');
    } catch (err) {
      if (!log.some((line) => line.startsWith('✗'))) {
        log.push(`✗ ${err instanceof Error ? err.message : String(err)}`);
        setCrudLog([...log]);
      }
      // Si falló a mitad de camino, no dejamos el entreno de prueba guardado.
      if (createdId) await workoutRepository.remove(createdId).catch(() => {});
    } finally {
      setCrudRunning(false);
    }
  };

  const clearProbe = async () => {
    await removeItem(STORAGE_KEYS.devPlayground);
    setProbe(null);
  };

  return (
    <Screen>
      <View style={{ height: spacing.lg }} />

      <SectionHeader title="AppText" />
      <Card>
        {Object.keys(typography).map((variant) => (
          <AppText key={variant} variant={variant as keyof typeof typography}>
            {variant} — Nadar 1500m
          </AppText>
        ))}
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="Card" actionLabel="Ver todo" onPressAction={() => {}} />
      <Card padding="lg" style={{ marginBottom: spacing.md }}>
        <AppText variant="bodyStrong">Card simple (padding lg)</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          No tiene onPress, no reacciona al toque.
        </AppText>
      </Card>
      <Card onPress={() => {}}>
        <AppText variant="bodyStrong">Card tocable</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Tiene onPress: encoge un poco al presionar.
        </AppText>
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="Button" />
      <Card>
        <Button label="Primary" variant="primary" onPress={() => {}} />
        <View style={{ height: spacing.sm }} />
        <Button label="Secondary" variant="secondary" onPress={() => {}} />
        <View style={{ height: spacing.sm }} />
        <Button label="Ghost" variant="ghost" onPress={() => {}} />
        <View style={{ height: spacing.sm }} />
        <Button label="Disabled" variant="primary" disabled onPress={() => {}} />
        <View style={{ height: spacing.sm }} />
        <Button
          label="Tocá para loading"
          variant="primary"
          loading={loading}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="IconButton" />
      <Card>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <IconButton icon={Bell} onPress={() => {}} />
          <IconButton icon={Settings} variant="ghost" onPress={() => {}} />
          <IconButton
            icon={Trash2}
            color={colors.error}
            backgroundColor={colors.errorLight}
            onPress={() => {}}
          />
          <IconButton icon={Bell} size={56} onPress={() => {}} />
          <IconButton icon={Bell} disabled onPress={() => {}} />
        </View>
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="StatCard" />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatCard
          icon={Waves}
          value="12.400"
          unit="m"
          label="Metros este mes"
          style={{ flex: 1 }}
        />
        <StatCard
          icon={Timer}
          value="3h 20"
          unit="min"
          label="Tiempo este mes"
          iconColor={colors.tertiary}
          iconBackground={colors.tertiaryLight}
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="Badge" />
      <Card>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Badge label="Baja" level="baja" />
          <Badge label="Media" level="media" />
          <Badge label="Alta" level="alta" />
          <Badge label="Máxima" level="maxima" />
        </View>
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="EmptyState" />
      <Card padding={0}>
        <EmptyState
          icon={Waves}
          title="Sin entrenamientos"
          description="Todavía no cargaste ningún entreno este mes."
          ctaLabel="Agregar entrenamiento"
          onPressCta={() => {}}
        />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="SegmentedControl" />
      <Card>
        <SegmentedControl options={POOL_OPTIONS} value={poolLength} onChange={setPoolLength} />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="Storage" />
      <Card>
        <AppText variant="caption" color={colors.textSecondary}>
          Guardá, cerrá la app del todo y volvé a abrirla: tiene que aparecer el mismo objeto.
        </AppText>
        <AppText variant="bodyStrong" style={{ marginVertical: spacing.md }}>
          {probe ? `#${probe.counter} — ${probe.savedAt}` : 'Nada guardado'}
        </AppText>
        <Button label="Guardar objeto de prueba" onPress={saveProbe} />
        <View style={{ height: spacing.sm }} />
        <Button label="Borrar" variant="ghost" onPress={clearProbe} />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="Datos de ejemplo" />
      <Card>
        <AppText variant="caption" color={colors.textSecondary}>
          Carga 15 entrenos de ejemplo del mes actual (marcados como seed). Borrar solo saca esos,
          no toca los entrenos reales.
        </AppText>
        <AppText variant="bodyStrong" style={{ marginVertical: spacing.md }}>
          {seedCount} entrenos de ejemplo cargados
        </AppText>
        <Button
          label="Cargar entrenos de ejemplo"
          loading={seedBusy}
          disabled={seedBusy}
          onPress={() => runSeed('load')}
        />
        <View style={{ height: spacing.sm }} />
        <Button
          label="Borrar entrenos de ejemplo"
          variant="ghost"
          disabled={seedBusy || seedCount === 0}
          onPress={() => runSeed('clear')}
        />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="Repositorio de entrenos" />
      <Card>
        <AppText variant="caption" color={colors.textSecondary}>
          Crea, lee, edita y borra un entreno de prueba usando workoutRepository.
        </AppText>
        {crudLog.map((line) => (
          <AppText
            key={line}
            variant="body"
            color={line.startsWith('✓') ? colors.success : colors.error}
            style={{ marginTop: spacing.xs }}
          >
            {line}
          </AppText>
        ))}
        <View style={{ height: spacing.md }} />
        <Button label="Probar CRUD" loading={crudRunning} onPress={runWorkoutCrud} />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionHeader title="FloatingActionButton" />
      <Card>
        <AppText
          variant="caption"
          color={colors.textSecondary}
          style={{ marginBottom: spacing.md }}
        >
          En una pantalla real se posiciona flotando (position: absolute) sobre el contenido; acá va
          inline para que se vea en el flujo.
        </AppText>
        <FloatingActionButton onPress={() => {}} />
      </Card>

      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}
