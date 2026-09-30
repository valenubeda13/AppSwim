import React, { useState } from 'react';
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
