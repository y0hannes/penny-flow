import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { theme } from '@/theme';

interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
}

const LineChart = ({
  data,
  width = Dimensions.get('window').width - 64,
  height = 100
}: LineChartProps) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const stepX = width / (data.length - 1);
  const points = data.map((val, i) => ({
    x: i * stepX,
    y: height - ((val - min) / range) * (height - 20) - 10,
  }));

  const linePath = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L 0,${height} Z`;

  // For the dot
  const lastPoint = points[points.length - 3] || points[points.length - 1];

  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.2" />
            <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#gradient)" />
        <Path d={linePath} stroke={theme.colors.primary} strokeWidth="3" fill="none" strokeLinejoin="round" />

        {/* Intersection point from image */}
        <Circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill="#FFFFFF" stroke={theme.colors.primary} strokeWidth="2" />
      </Svg>
    </View>
  );
};

export default LineChart;
