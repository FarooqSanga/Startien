import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, StatusBar, ActivityIndicator, Image, TouchableOpacity, Linking, Alert } from 'react-native';
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
  city: string;
}

const ShopDetailScreen: FunctionComponent = ({ route }: any) => {
  const { shop, shopOwnerId } = route.params; // shopOwnerId is passed from MarketListScreen
  const [ads, setAds] = useState<Ad[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    const adsRef = database().ref(`users/${shopOwnerId}/ads`);

    const fetchAds = adsRef.on(
      'value',
      (snapshot) => {
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
        setLoadingAds(false);
      },
      (error) => {
        console.error('Error fetching ads:', error);
        setLoadingAds(false);
      }
    );

    return () => adsRef.off(); // Clean up the Firebase listener
  }, [shopOwnerId]);

  const handleCall = () => {
    if (shop.phoneNumber) {
      Linking.openURL(`tel:${shop.phoneNumber}`);
    } else {
      Alert.alert('Error', 'No phone number available for this shop.');
    }
  };

  const handleMessage = () => {
    if (shop.phoneNumber) {
      Linking.openURL(`sms:${shop.phoneNumber}`);
    } else {
      Alert.alert('Error', 'No phone number available for this shop.');
    }
  };

  const handleFollow = () => {
    Alert.alert('Followed', `You are now following ${shop.shopName}.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200ee" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Shop Profile Picture */}
        <View style={styles.profileContainer}>
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
        </View>

        <View style={styles.shopDetails}>
          <Text style={styles.bio}>{shop.bio || 'No bio available'}</Text>
          <Text style={styles.contact}>Phone: {shop.phoneNumber || 'N/A'}</Text>
          <Text style={styles.contact}>Email: {shop.email || 'N/A'}</Text>
          <Text style={styles.contact}>Website: {shop.website || 'N/A'}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleFollow}>
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleMessage}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#f5f5f7',
  },
  contentContainer: {
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  shopType: {
    fontSize: 18,
    color: '#6200ee',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  shopDetails: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  contact: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  adsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
    color: '#333',
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