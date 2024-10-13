import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import categoriesData from './../JSON/categories.json';

const CategoryList: React.FC = () => {
  const navigation = useNavigation(); // Access the navigation prop

  const handleCategoryClick = (categoryName: string) => {
    navigation.navigate('FilterAdsScreen', { category: categoryName }); // Navigate to FilterAdsScreen with category param
  };

  return (
    <>
      <Text style={styles.browseCategories}>Browse Categories</Text>
      <ScrollView
        horizontal
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {categoriesData.map((category) => (
          <View key={category.name} style={styles.categoryContainer}>
            <Pressable
              android_ripple={{ color: 'grey', borderless: true, radius: 40 }}
              style={styles.pressableStyle}
              onPress={() => handleCategoryClick(category.name)} // Handle press event
            >
              <View style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
            </Pressable>
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  browseCategories: {
    fontSize: 18,
    color: '#444444',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryContainer: {
    alignItems: 'center',
  },
  pressableStyle: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#DDDDDD',
    borderRadius: 50,
    marginHorizontal: 10,
    marginBottom: 15,
    aspectRatio: 1,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCard: {
    width: 80,
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: -12,
    paddingBottom: 16,
  },
});

export default CategoryList;
