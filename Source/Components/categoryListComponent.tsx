import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import categoriesData from './../JSON/categories.json';

const CategoryList: React.FC = () => (
  <>
    <Text style={styles.browseCategories}>Browse Categories</Text>
    <ScrollView horizontal style={styles.categoriesContainer}>
      {categoriesData.map((category) => (
        <Pressable android_ripple={{color:'grey', borderless:true, radius:40}} style = {{backgroundColor:'white', borderWidth:3, borderColor:'#DDDDDD',  borderRadius:50, marginHorizontal:10, marginTop:0, marginBottom:15, aspectRatio:1, width:80, alignContent:'center', alignItems:'center', alignSelf:'center',}}>
        <View key={category.name} style={styles.categoryCard}>
          <Text style={styles.categoryEmoji}>{category.icon}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
        </Pressable>
      ))}
    </ScrollView>
  </>
);

const styles = StyleSheet.create({
  browseCategories: {
    fontSize: 18,
    color:'#444444',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryCard: {
    width: 80,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  categoryEmoji: {
    fontSize: 28,
    marginTop:-5
  },
  categoryName: {
    color:'black',
    fontWeight:'500',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CategoryList;
