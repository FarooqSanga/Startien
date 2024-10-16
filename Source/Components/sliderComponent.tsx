import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Array of local image assets for the slider
const images = [
  require('./../Assets/imgSlider/content-writer.png'),
  require('./../Assets/imgSlider/marketing-specialists.png'), // Replace with actual image paths
  require('./../Assets/imgSlider/social-media-manager.png'), // Replace with actual image paths
];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Automatically change slides every 2.5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex });
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={images}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item} style={styles.image} />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 200,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  slide: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Slider;