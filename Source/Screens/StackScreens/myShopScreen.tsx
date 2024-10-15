// ShopDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

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
  profilePicture?: string; // For now, we're using a placeholder <View> for the picture
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
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);

  const user = auth().currentUser;

  useEffect(() => {
    // Fetch shop details from Firebase Realtime Database when the component mounts
    if (user) {
      const shopRef = database().ref(`/users/${user.uid}/shopDetails`);
      shopRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          setShopData(data);
        }
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching shop details: ", error);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSaveShopDetails = () => {
    if (!user) return;

    const shopRef = database().ref(`/users/${user.uid}/shopDetails`);
    shopRef.set(shopData)
      .then(() => {
        Alert.alert("Shop details saved successfully!");
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error saving shop details: ", error);
        Alert.alert("Failed to save shop details.");
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shop Details</Text>

      {/* Profile Picture Placeholder */}
      <View style={styles.profilePicture}>
        <Text>Profile Picture</Text>
      </View>

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
          <Text style={styles.text}>Shop Name: {shopData.shopName || "N/A"}</Text>
          <Text style={styles.text}>Bio: {shopData.bio || "No bio available"}</Text>
          <Text style={styles.text}>Address: {shopData.address}</Text>
          <Text style={styles.text}>Shop Type: {shopData.shopType}</Text>
          <Text style={styles.text}>Phone Number: {shopData.phoneNumber || "N/A"}</Text>
          <Text style={styles.text}>Email: {shopData.email || "N/A"}</Text>
          <Text style={styles.text}>Website: {shopData.website || "N/A"}</Text>
          <Text style={styles.text}>Opening Hours: {shopData.openingHours || "N/A"}</Text>
          <Text style={styles.text}>Contact Person: {shopData.contactPerson || "N/A"}</Text>
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
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 50,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyShopDetailScreen;