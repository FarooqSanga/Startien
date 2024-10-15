// // src/screens/ViewEditProfileScreen.tsx

// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import database from '@react-native-firebase/database'; // Import Firebase database
// import auth from '@react-native-firebase/auth'; // Import Firebase Authentication

// const ViewEditProfileScreen: React.FC = () => {
//   const [userData, setUserData] = useState<any>(null); // State to store user data
//   const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
//   const [updating, setUpdating] = useState<boolean>(false); // State for updating indicator
//   const navigation = useNavigation();
//   const route = useRoute();

//   const uid = route.params?.userId || auth().currentUser?.uid; // Get the UID from params or auth

//   useEffect(() => {
//     if (!uid) {
//       setLoading(false);
//       return;
//     }

//     const userRef = database().ref(`users/${uid}`);
    
//     // Fetch the user data from Firebase
//     const unsubscribe = userRef.on('value', snapshot => {
//       const data = snapshot.val();
//       setUserData(data);
//       setLoading(false);
//     });

//     return () => userRef.off('value', unsubscribe); // Clean up data listener on component unmount
//   }, [uid]);

//   const handleSaveChanges = async () => {
//     if (!userData) return;
    
//     setUpdating(true);

//     try {
//       // Reference to the user data in Firebase
//       const userRef = database().ref(`users/${uid}`);
      
//       // Update the user data in Firebase
//       await userRef.update(userData);

//       Alert.alert('Success', 'Profile updated successfully!');
//       setUpdating(false);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6200EE" />
//       </View>
//     );
//   }

//   if (!userData) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>User data not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.label}>First Name:</Text>
//       <TextInput
//         style={styles.input}
//         value={userData.firstName}
//         onChangeText={(text) => setUserData({ ...userData, firstName: text })}
//       />

//       <Text style={styles.label}>Last Name:</Text>
//       <TextInput
//         style={styles.input}
//         value={userData.lastName}
//         onChangeText={(text) => setUserData({ ...userData, lastName: text })}
//       />

//       <Text style={styles.label}>Email:</Text>
//       <TextInput
//         style={styles.input}
//         value={userData.email}
//         editable={false} // Email is not editable
//       />

//       <Text style={styles.label}>Gender:</Text>
//       <TextInput
//         style={styles.input}
//         value={userData.gender}
//         onChangeText={(text) => setUserData({ ...userData, gender: text })}
//       />

//       <Text style={styles.label}>Date of Birth:</Text>
//       <TextInput
//         style={styles.input}
//         value={new Date(userData.dob).toISOString().slice(0, 10)}
//         onChangeText={(text) => setUserData({ ...userData, dob: text })}
//       />

//       <Text style={styles.label}>Contact:</Text>
//       <TextInput
//         style={styles.input}
//         value={userData.contact}
//         onChangeText={(text) => setUserData({ ...userData, contact: text })}
//       />

//       <Text style={styles.label}>Designation:</Text>
//       <TextInput
//         style={styles.input}
//         value={userData.designation}
//         onChangeText={(text) => setUserData({ ...userData, designation: text })}
//       />

//       <Button title={updating ? 'Saving...' : 'Save Changes'} onPress={handleSaveChanges} disabled={updating} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default ViewEditProfileScreen;
