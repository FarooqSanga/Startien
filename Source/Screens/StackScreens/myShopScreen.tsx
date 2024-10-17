import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface ShopData {
  shopName: string;
  bio?: string;
  address: string;
  shopType: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  contactPerson?: string;
  profilePicture?: string; // For profile picture URL
}

const MyShopDetailScreen: React.FC = () => {
  const [shopData, setShopData] = useState<ShopData>({
    shopName: '',
    bio: '',
    address: '',
    shopType: '',
    phoneNumber: '',
    email: '',
    website: '',
    openingHours: '',
    contactPerson: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      const shopRef = database().ref(`/users/${user.uid}/shopDetails`);
      shopRef
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            setShopData(data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching shop details: ', error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleSaveShopDetails = () => {
    if (!user) return;

    const shopRef = database().ref(`/users/${user.uid}/shopDetails`);
    shopRef
      .set(shopData)
      .then(() => {
        Alert.alert('Shop details saved successfully!');
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error saving shop details: ', error);
        Alert.alert('Failed to save shop details.');
      });
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      uploadImage(image.uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user) return;

    const uploadUri = uri;
    const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`shopProfileImages/${user.uid}/${filename}`);

    setUploading(true);

    try {
      await storageRef.putFile(uploadUri);
      const downloadURL = await storageRef.getDownloadURL();
      setShopData({ ...shopData, profilePicture: downloadURL });
      setUploading(false);
      Alert.alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image: ', error);
      setUploading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shop Details</Text>

      {/* Profile Picture */}
      <TouchableOpacity onPress={handleImagePick}>
        {shopData.profilePicture ? (
          <Image source={{ uri: shopData.profilePicture }} style={styles.profilePicture} />
        ) : (
          <View style={styles.profilePicturePlaceholder}>
            <Text style={styles.uploadText}>Upload Profile Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="small" color="#6200ea" />}

      {editing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Shop Name"
            value={shopData.shopName}
            onChangeText={(text) => setShopData({ ...shopData, shopName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Shop Bio"
            value={shopData.bio}
            onChangeText={(text) => setShopData({ ...shopData, bio: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={shopData.address}
            onChangeText={(text) => setShopData({ ...shopData, address: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Shop Type"
            value={shopData.shopType}
            onChangeText={(text) => setShopData({ ...shopData, shopType: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={shopData.phoneNumber}
            onChangeText={(text) => setShopData({ ...shopData, phoneNumber: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={shopData.email}
            onChangeText={(text) => setShopData({ ...shopData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Website"
            value={shopData.website}
            onChangeText={(text) => setShopData({ ...shopData, website: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Opening Hours"
            value={shopData.openingHours}
            onChangeText={(text) => setShopData({ ...shopData, openingHours: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Person"
            value={shopData.contactPerson}
            onChangeText={(text) => setShopData({ ...shopData, contactPerson: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveShopDetails}>
            <Text style={styles.buttonText}>Save Details</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Icons with Text */}
          <View style={styles.detailItem}>
            <Icon name="storefront-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Shop Name: {shopData.shopName || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="information-circle-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Bio: {shopData.bio || 'No bio available'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Address: {shopData.address}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="pricetag-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Shop Type: {shopData.shopType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="call-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Phone Number: {shopData.phoneNumber || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="mail-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Email: {shopData.email || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="globe-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Website: {shopData.website || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Opening Hours: {shopData.openingHours || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="person-outline" size={20} color="#6200ea" style={styles.icon} />
            <Text style={styles.text}>Contact Person: {shopData.contactPerson || 'N/A'}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
            <Text style={styles.buttonText}>Edit Shop Details</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e1e1e',
    textAlign: 'center',
    letterSpacing: 1,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderColor: '#6200ea',
    borderWidth: 2,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  uploadText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default MyShopDetailScreen;