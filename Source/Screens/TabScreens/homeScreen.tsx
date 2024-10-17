import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomStatusBar from '../../Components/customStatusBar';
import LocationInput from '../../Components/locationComponent';
import SearchInput from '../../Components/searchInputComponent';
import Slider from '../../Components/sliderComponent';
import CategoryList from '../../Components/categoryListComponent';
import AdCard from '../../Components/adCardComponent';
import database from '@react-native-firebase/database';

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({ navigation }) => {
  const [selectedCity, setSelectedCity] = useState<string>(''); // Changed from 'selectedLocation' to 'selectedCity'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ads, setAds] = useState<any[]>([]);
  const [filteredAds, setFilteredAds] = useState<any[]>([]);

  // Fetch ads data from Firebase Realtime Database
  useEffect(() => {
    const fetchAds = () => {
      const adsRef = database().ref('adsCollection');
      adsRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
          const adsData: any[] = [];
          snapshot.forEach((childSnapshot) => {
            adsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          setAds(adsData);
        } else {
          setAds([]); // Handle case where there are no ads
        }
      });

      // Clean up listener on unmount
      return () => adsRef.off('value');
    };

    fetchAds();
  }, []);

  // Filter ads based on selected city and search text
  useEffect(() => {
    const filtered = ads.filter((ad) => {
      const matchesCity = selectedCity ? ad.city === selectedCity : true; // Filter by city
      const matchesSearchQuery = searchQuery ? ad.title.toLowerCase().includes(searchQuery.toLowerCase()) : true; // Filter by search query

      return matchesCity && matchesSearchQuery;
    });

    setFilteredAds(filtered);
  }, [ads, selectedCity, searchQuery]);

  return (
    <View style={styles.container}>
      <CustomStatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <View style = {{backgroundColor:"#6200ea"}}>
        <Text style={{ fontWeight: 'bold', fontSize: 26, color: 'white', paddingHorizontal: 16, paddingVertical: 14 }}>
          Startien
        </Text>
      </View>

      <FlatList
        data={filteredAds} // Use filtered ads
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AdCard ad={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <>
            {/* Location input is now city input */}
            <LocationInput selectedLocation={selectedCity} setSelectedLocation={setSelectedCity} /> 
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Slider />
            <CategoryList />
          </>
        }
      />

      <View style={styles.floatingButton}>
        <Pressable
          onPress={() => navigation.navigate('CreateAdScreen')}
          android_ripple={{ color: 'skyblue', borderless: true, radius: 50 }}
          style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={40} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
  },
});

export default HomeScreen;
