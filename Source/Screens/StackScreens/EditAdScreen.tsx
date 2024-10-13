import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './../../Navigation/types';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

type EditAdScreenRouteProp = RouteProp<RootStackParamList, 'EditAdScreen'>;
type EditAdScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditAdScreen'>;

type Props = {
  route: EditAdScreenRouteProp;
  navigation: EditAdScreenNavigationProp;
};

const EditAdScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ad } = route.params;
  
  const [title, setTitle] = useState(ad.title || '');
  const [description, setDescription] = useState(ad.description || '');
  const [price, setPrice] = useState(ad.price || '');
  const [location, setLocation] = useState(ad.location || '');
  const [sellerName, setSellerName] = useState(ad.sellerInfo?.name || '');
  const [sellerEmail, setSellerEmail] = useState(ad.sellerInfo?.email || '');
  const [sellerPhone, setSellerPhone] = useState(ad.sellerInfo?.phone || '');
  const [profilePicture, setProfilePicture] = useState(ad.sellerInfo?.profilePicture || '');
  const [images, setImages] = useState(ad.images || []);
  const [status, setStatus] = useState(ad.transaction?.status || '');

  // Fetch ad details when screen loads
  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const adSnapshot = await database().ref(`users/${auth().currentUser?.uid}/ads/${ad.listingId}`).once('value');
        const adData = adSnapshot.val();
        if (adData) {
          setTitle(adData.title || '');
          setDescription(adData.description || '');
          setPrice(adData.price || '');
          setLocation(adData.location || '');
          setSellerName(adData.sellerInfo?.name || '');
          setSellerEmail(adData.sellerInfo?.email || '');
          setSellerPhone(adData.sellerInfo?.phone || '');
          setProfilePicture(adData.sellerInfo?.profilePicture || '');
          setImages(adData.images || []);
          setStatus(adData.transaction?.status || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch ad details');
      }
    };

    fetchAdDetails();
  }, [ad.listingId]);

  // Handle Save Changes
  const handleSave = async () => {
    if (!title || !description || !price || !location) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      const updatedAd = {
        ...ad,
        title,
        description,
        price,
        location,
        sellerInfo: {
          name: sellerName,
          email: sellerEmail,
          phone: sellerPhone,
          profilePicture,
        },
        images,
        transaction: {
          ...ad.transaction,
          status,
        },
      };

      await database().ref(`users/${auth().currentUser?.uid}/ads/${ad.listingId}`).update(updatedAd);
      Alert.alert('Success', 'Ad updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update ad');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Edit Ad Screen</Text>

      {/* Basic Ad Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Details</Text>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Price:</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Seller Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seller Information</Text>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={sellerName}
            onChangeText={setSellerName}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={sellerEmail}
            onChangeText={setSellerEmail}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Phone:</Text>
          <TextInput
            style={styles.input}
            value={sellerPhone}
            onChangeText={setSellerPhone}
            keyboardType="phone-pad"
          />
        </View>
        {profilePicture && (
          <Image
            source={{ uri: profilePicture }}
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
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>

      {/* Images */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((imageUrl, index) => (
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
          <TextInput
            style={styles.input}
            value={status}
            onChangeText={setStatus}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
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
    width: 120,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditAdScreen;
