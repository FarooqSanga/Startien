import React, {FunctionComponent, useState} from 'react';
import {View, ScrollView, StyleSheet, Pressable, Text} from 'react-native';
import adsData from './../../JSON/ads.json';
import Header from '../../Components/headerComponent';
import LocationInput from '../../Components/locationComponent';
import SearchInput from '../../Components/searchInputComponent';
import Slider from '../../Components/sliderComponent';
import CategoryList from '../../Components/categoryListComponent';
import AdCard from '../../Components/adCardComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({navigation}) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* <Header /> */}
        <LocationInput
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Slider />
        <CategoryList />
        <View>
          {adsData.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.floatingButton}>
        <Pressable
        onPress={() => navigation.navigate('ViewAdScreen', { ad })}
          android_ripple={{color: 'skyblue', borderless: true, radius: 50}}
          style={{width: 60, height: 60, alignItems: 'center',
            justifyContent: 'center',}}
          onPress={() => navigation.navigate('CreateAdScreen')}>
          <Ionicons name="add" size={40} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
    color: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
  },
});

export default HomeScreen;
