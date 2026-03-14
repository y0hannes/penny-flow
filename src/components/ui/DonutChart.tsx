import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { theme as staticTheme } from '@/theme';
import Text from './Text';
import { useTheme } from '@/context/ThemeContext';

interface DataItem {
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: DataItem[];
  size?: number;
  strokeWidth?: number;
}

const DonutChart = ({ data, size = 180, strokeWidth = 25 }: DonutChartProps) => {
  const { theme, isDark } = useTheme();
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentTotal = 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isDark ? '#2C2C2C' : '#E6F9F5'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Data Sections */}
          {data.map((item, index) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -currentTotal;
            currentTotal += (item.percentage / 100) * circumference;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.centerText}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1A332E' : '#E6F9F5' }]}>
          <Text variant="caption" bold style={{ color: theme.colors.primary, fontSize: 18 }}>◐</Text>
        </View>
        <Text variant="caption" color="textTertiary" bold style={{ letterSpacing: 1 }}>CATEGORIES</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  }
});

export default DonutChart;
