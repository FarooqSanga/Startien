import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import AdCard from './adCardComponent'; // Import your AdCard component
import database from '@react-native-firebase/database';
import LocationInput from './locationComponent';
import SearchInput from './searchInputComponent';

interface FilterAdsComponentProps {
  category: string;
}

const FilterAdsComponent: React.FC<FilterAdsComponentProps> = ({ category }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
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
            const ad = { id: childSnapshot.key, ...childSnapshot.val() };
            if (ad.category === category) { // Filter by category initially
              adsData.push(ad);
            }
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
  }, [category]);

  // Filter ads based on selected city and search text
  useEffect(() => {
    const filtered = ads.filter((ad) => {
      const matchesCity = selectedCity ? ad.city === selectedCity : true;
      const matchesSearchQuery = searchQuery ? ad.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;

      return matchesCity && matchesSearchQuery;
    });

    setFilteredAds(filtered);
  }, [ads, selectedCity, searchQuery]);

  return (
    <View style={styles.container}>
      <LocationInput selectedLocation={selectedCity} setSelectedLocation={setSelectedCity} />
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {filteredAds.length > 0 ? (
        <FlatList
          data={filteredAds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AdCard ad={item} />}
          numColumns={2} // Display 2 items per row
          columnWrapperStyle={styles.row} // Ensure spacing between columns
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text style={styles.noResultsText}>No ads found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default FilterAdsComponent;