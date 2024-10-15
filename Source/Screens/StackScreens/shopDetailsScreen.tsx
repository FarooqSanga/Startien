// ShopDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import database from '@react-native-firebase/database';
import AdCard from '../../Components/adCardComponent'; // Assuming this is the path to your AdCard component

interface ShopData {
  shopName: string;
  bio?: string;
  address: string;
  shopType: string;
  profilePicture?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
}

interface Ad {
  id: string;
  featuredImage?: string;
  price: string;
  title: string;
  features?: string[];
  location: string;
  postedDate: string;
}

const ShopDetailScreen = ({ route }: any) => {
  const { shop, shopOwnerId } = route.params; // shopOwnerId is passed from MarketListScreen
  const [ads, setAds] = useState<Ad[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    // Fetch ads posted by the shop owner
    const fetchAds = async () => {
      try {
        const adsRef = database().ref(`users/${shopOwnerId}/ads`);
        adsRef.on('value', (snapshot) => {
          if (snapshot.exists()) {
            const fetchedAds = snapshot.val();
            const adArray = Object.keys(fetchedAds).map((key) => ({
              id: key,
              ...fetchedAds[key],
            }));
            setAds(adArray);
          } else {
            setAds([]);
          }
        });
      } catch (error) {
        console.error("Error fetching ads: ", error);
      } finally {
        setLoadingAds(false);
      }
    };

    fetchAds();
    return () => database().ref(`users/${shopOwnerId}/ads`).off(); // Clean up listener
  }, [shopOwnerId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200ee" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Shop Profile Picture */}
        <View style={styles.profilePicture}>
          {shop.profilePicture ? (
            <Image source={{ uri: shop.profilePicture }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileText}>No Image</Text>
          )}
        </View>

        {/* Shop Details */}
        <Text style={styles.shopName}>{shop.shopName || 'Unnamed Shop'}</Text>
        <Text style={styles.shopType}>{shop.shopType || 'Unknown Type'}</Text>
        <Text style={styles.address}>{shop.address || 'No address available'}</Text>
        <Text style={styles.bio}>{shop.bio || 'No bio available'}</Text>
        <Text style={styles.contact}>Phone: {shop.phoneNumber || 'N/A'}</Text>
        <Text style={styles.contact}>Email: {shop.email || 'N/A'}</Text>
        <Text style={styles.contact}>Website: {shop.website || 'N/A'}</Text>

        {/* Display Ads */}
        <Text style={styles.adsTitle}>Ads by {shop.shopName || 'the shop'}</Text>

        {loadingAds ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : ads.length === 0 ? (
          <Text style={styles.noAdsText}>No ads posted by this shop.</Text>
        ) : (
          <FlatList
            data={ads}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AdCard ad={item} />}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileText: {
    fontSize: 14,
    color: '#999',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  shopType: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#777',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  contact: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  adsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  noAdsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default ShopDetailScreen;