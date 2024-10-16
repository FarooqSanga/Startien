import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
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
  const [isEditing, setIsEditing] = useState<boolean>(false); // Edit mode state
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
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      });
  }, [route.params]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!userData) return;

    const uid = route.params?.userId || auth().currentUser?.uid;
    if (!uid) return;

    const userRef = database().ref(`users/${uid}`);
    userRef.update(userData)
      .then(() => {
        alert('Profile updated successfully!');
        setIsEditing(false); // Toggle back to view mode after saving
      })
      .catch(error => {
        console.error('Error updating profile: ', error);
        alert('Error updating profile. Please try again.');
      });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
        <ActivityIndicator size="large" color="#6200EE" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
        <Text style={styles.errorText}>User data not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={userData.firstName}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, firstName: text })}
          />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={userData.lastName}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, lastName: text })}
          />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Contact</Text>
          <TextInput
            style={styles.input}
            value={userData.contact}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, contact: text })}
          />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={userData.email} editable={false} />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={userData.dob}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, dob: text })}
          />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={userData.gender}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, gender: text })}
          />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Designation</Text>
          <TextInput
            style={styles.input}
            value={userData.designation}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, designation: text })}
          />
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={userData.country}
            editable={isEditing}
            onChangeText={(text) => setUserData({ ...userData, country: text })}
          />
        </View>

        {/* Edit/Save Button */}
        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : handleEditToggle}>
          <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    padding: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
    elevation: 2, // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.4,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProfileScreen;