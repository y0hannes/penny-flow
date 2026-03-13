import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/theme';
import Text from './Text';

interface SegmentedControlProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const SegmentedControl = ({ options, selectedOption, onSelect }: SegmentedControlProps) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.segment,
            selectedOption === option && styles.activeSegment,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            variant="body"
            color={selectedOption === option ? 'textPrimary' : 'textSecondary'}
            bold={selectedOption === option}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F0F1F5',
    borderRadius: 12,
    marginHorizontal: theme.spacing.md,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSegment: {
    backgroundColor: '#FFFFFF',
    // Shadow for selected state
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SegmentedControl;
