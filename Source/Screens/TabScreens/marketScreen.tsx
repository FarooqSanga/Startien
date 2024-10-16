import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ShopData {
  shopName: string;
  bio?: string;
  address: string;
  shopType: string;
  profilePicture?: string;
  phoneNumber?: string;
  email?: string;
}

const MarketListScreen: React.FC = () => {
  const [shops, setShops] = useState<{ shop: ShopData; shopOwnerId: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const usersRef = database().ref('users');
        const snapshot = await usersRef.once('value');
        const allShops: Array<{ shop: ShopData; shopOwnerId: string }> = [];

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          Object.keys(usersData).forEach((userId) => {
            const shopDetails = usersData[userId].shopDetails;
            if (shopDetails) {
              allShops.push({ shop: shopDetails, shopOwnerId: userId });
            }
          });
        }

        setShops(allShops);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shops: ", error);
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const renderShopItem = ({ item }: { item: { shop: ShopData; shopOwnerId: string } }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => navigation.navigate('ShopDetailScreen', { shop: item.shop, shopOwnerId: item.shopOwnerId })}
    >
      <View style={styles.profilePicture}>
        {item.shop.profilePicture ? (
          <Image source={{ uri: item.shop.profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileText}>No Image</Text>
        )}
      </View>
      <View style={styles.shopDetails}>
        <Text style={styles.shopName}>{item.shop.shopName || 'Unnamed Shop'}</Text>
        <Text style={styles.shopType}>{item.shop.shopType || 'Shop Type'}</Text>
        <Text style={styles.bio}>{item.shop.bio || 'No bio available'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200ee" barStyle="light-content" />
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderShopItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No shops available</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f5',
  },
  listContainer: {
    paddingBottom: 16,
  },
  shopItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  profilePicture: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  profileText: {
    fontSize: 12,
    color: '#999',
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shopType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  bio: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default MarketListScreen;