import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme';

interface WaveShapeProps {
  width: number;
}

/**
 * Ola decorativa que separa el header (foto) del contenido (fondo claro).
 * Le da a la pantalla el look "premium" de apps como Nike Run Club.
 */
export function WaveShape({ width }: WaveShapeProps) {
  return (
    <View style={styles.container}>
      <Svg width={width} height={48} viewBox={`0 0 ${width} 48`}>
        <Path
          d={`M0 24 
              C ${width * 0.25} 0, ${width * 0.75} 48, ${width} 12 
              L ${width} 48 L 0 48 Z`}
          fill={colors.background}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
});
