import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Slider: React.FC = () => (
  <View style={styles.sliderContainer}>
    <Text>Slider with 5 slides here</Text>
  </View>
);

const styles = StyleSheet.create({
  sliderContainer: {
    height: 200,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Slider;
