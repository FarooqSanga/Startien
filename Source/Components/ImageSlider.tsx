import React, { useState, FC } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

// Define the type for the component
const ImageSlider: FC = () => {
  const images: string[] = [
    'https://via.placeholder.com/600x400?text=Image+1',
    'https://via.placeholder.com/600x400?text=Image+2',
    'https://via.placeholder.com/600x400?text=Image+3',
    'https://via.placeholder.com/600x400?text=Image+4',
    'https://via.placeholder.com/600x400?text=Image+5',
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToNextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <View style={styles.sliderContainer}>
      <Image source={{ uri: images[currentIndex] }} style={styles.image} />
      
      <TouchableOpacity style={styles.leftButton} onPress={goToPreviousSlide}>
        <Text style={styles.buttonText}>❮</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rightButton} onPress={goToNextSlide}>
        <Text style={styles.buttonText}>❯</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  leftButton: {
    position: 'absolute',
    top: '50%',
    left: 20,
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  rightButton: {
    position: 'absolute',
    top: '50%',
    right: 20,
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default ImageSlider;
