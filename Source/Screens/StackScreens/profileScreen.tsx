import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  contact: string;
  country: string;
  designation: string;
  dob: string;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
}

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null); // State for user data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const route = useRoute();

  useEffect(() => {
    // Fetch user ID from route params or Firebase Auth
    const uid = route.params?.userId || auth().currentUser?.uid;
    if (!uid) {
      setLoading(false); // No UID found, stop loading
      return;
    }

    // Reference to the specific user fields in Firebase
    const userRef = database().ref(`users/${uid}`).child('/');

    // Fetch specific user data from Firebase
    userRef.once('value')
      .then(snapshot => {
        const userData = snapshot.val();
        if (userData) {
          // Only pick the required fields
          const filteredData: UserProfile = {
            contact: userData.contact || '',
            country: userData.country || '',
            designation: userData.designation || '',
            dob: userData.dob || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            gender: userData.gender || '',
            lastName: userData.lastName || ''
          };
          setUserData(filteredData);
        }
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
      <SafeAreaView>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
      </SafeAreaView>
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
      <View>
        <Text style={styles.label}>First Name:</Text>
        <TextInput style={styles.input} value={userData.firstName} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput style={styles.input} value={userData.lastName} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Contact:</Text>
        <TextInput style={styles.input} value={userData.contact} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.input} value={userData.email} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Date of Birth:</Text>
        <TextInput style={styles.input} value={userData.dob} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Gender:</Text>
        <TextInput style={styles.input} value={userData.gender} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Designation:</Text>
        <TextInput style={styles.input} value={userData.designation} editable={false} />
      </View>
      <View>
        <Text style={styles.label}>Country:</Text>
        <TextInput style={styles.input} value={userData.country} editable={false} />
      </View>
    </ScrollView>
  );
};

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
