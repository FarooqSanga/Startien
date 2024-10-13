import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // State for user data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const route = useRoute();

  useEffect(() => {
    // Fetch user ID from route params or Firebase Auth
    const uid = route.params?.userId || auth().currentUser?.uid;
    if (!uid) {
      setLoading(false); // No UID found, stop loading
      return;
    }

    // Reference to the user's data in Firebase
    const userRef = database().ref(`users/${uid}`);

    // Fetch user data from Firebase
    userRef.once('value')
      .then(snapshot => {
        setUserData(snapshot.val());
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error("Error fetching user data: ", error);
        setLoading(false); // Stop loading even if there is an error
      });

    // No need for cleanup when using `once` instead of `on`
  }, [route.params]);

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  // Display message if no user data is found
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User data not found.</Text>
      </View>
    );
  }

  // Render user profile information
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(userData).map(([key, value]) => (
        <View key={key}>
          <Text style={styles.label}>{capitalizeFirstLetter(key)}:</Text>
          <TextInput
            style={styles.input}
            value={String(value)} // Convert value to string to avoid issues with non-string data
            editable={false} // Make inputs non-editable
          />
        </View>
      ))}
    </ScrollView>
  );
};

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
