import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './../../Navigation/types';
import adsData from './../../JSON/adData.json';

type EditAdScreenRouteProp = RouteProp<RootStackParamList, 'EditAdScreen'>;

type EditAdScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditAdScreen'>;

type Props = {
  route: EditAdScreenRouteProp;
  navigation: EditAdScreenNavigationProp;
};

const EditAdScreen: React.FC<Props> = ({ route }) => {
  const { adId } = route.params;
  const ad = adsData.ads.find((item) => item.listingId === adId);

  if (!ad) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ad not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Edit Ad Screen</Text>

      {/* Basic Ad Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Details</Text>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Ad ID:</Text>
          <Text style={styles.value}>{ad.listingId}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{ad.title}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{ad.description}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>{`${ad.price} ${ad.currency}`}</Text>
        </View>
      </View>

      {/* Seller Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seller Information</Text>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{ad.sellerInfo.name}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{ad.sellerInfo.email}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{ad.sellerInfo.phone}</Text>
        </View>
        {ad.sellerInfo.profilePicture && (
          <Image
            source={{ uri: ad.sellerInfo.profilePicture }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Location Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <View style={styles.cardContent}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{ad.location.city}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{ad.location.state}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{ad.location.country}</Text>
        </View>
      </View>

      {/* Images */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {ad.images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.adImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      {/* Transaction Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transaction Details</Text>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{ad.transaction.status}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>{`${ad.transaction.price} ${ad.currency}`}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
  },
  adImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default EditAdScreen;
